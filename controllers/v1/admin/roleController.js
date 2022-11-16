const response = require('../../../components/responseHandler');
const rbac = require('../../../components/auth/rbac');
const joi = require('joi');
const db = require('../../../db/models');

const RoleController = {
  _formatPermissions: async (rawpermissions, t) => {
    try {
      let perms = {};
      console.log('rawpermissions', rawpermissions);
      for (const per of rawpermissions) {
        if (perms[per[1]]) {
          perms[per[1]].push({
            act: per[2],
            title: t(per[2], { scope: 'Perm.act' }),
          });
        } else {
          perms[per[1]] = [
            {
              act: per[2],
              title: t(per[2], { scope: 'Perm.act' }),
            },
          ];
        }
      }
      let permissions = [];
      for (const key in perms) {
        permissions.push({
          obj: key,
          title: t(key, { scope: 'Perm.obj' }),
          acts: perms[key],
        });
      }
      return permissions;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  //get list Permissions
  ListAllPermissions: async (req, res) => {
    try {
      let auther = await rbac();
      const rawpermissions = [];
      rawpermissions [0] = await auther
        .GetEnforcer()
        .getImplicitPermissionsForUser('admin');

      rawpermissions [1] = await auther
        .GetEnforcer()
        .getImplicitPermissionsForUser('factory');

      rawpermissions [2] = await auther
        .GetEnforcer()
        .getImplicitPermissionsForUser('user');

      const formatedPermissions = [];
      formatedPermissions [1] = await RoleController._formatPermissions(
        rawpermissions[1],
        res.t
      );

      formatedPermissions [0] = await RoleController._formatPermissions(
        rawpermissions[0],
        res.t
      );

      formatedPermissions [2] = await RoleController._formatPermissions(
        rawpermissions[2],
        res.t
      );
      
      return response.success(res, formatedPermissions, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  UpdatePermission: async (req, res) => {
    try {
      let auther = await rbac();
      let objs = await auther.GetEnforcer().getAllObjects();
      let acts = await auther.GetEnforcer().getAllActions();
      console.log({ objs, acts });
      const Schema = joi.object().keys({
        title: joi.string().required(),
        //[
        permissions: joi.array().items(
          joi.object().keys({
            obj: joi
              .string()
              .only()
              .allow(...objs),
            acts: joi.array().items(joi.string()),
          })
        ),
      });

      const { error, value } = Schema.validate(req.body, { abortEarly: true });
      if (error) {
        return response.validation(res, error);
      }
      let deleteRoles = await auther.GetEnforcer().deleteRole(value.title);

      let ids = await module.exports.GetMangesHaveThisRole(value.title);
      await auther.GetEnforcer().deleteRole(value.title);
      value.permissions.forEach(async (o) => {
        await o.acts.forEach(async (act) => {
          await auther.AddPermission(value.title, o.obj, act);
        });
      });
      await module.exports.RoleBackManges(ids, value.title);
      let users = await db.Admin.findAll({
        where: {
          role: value.title,
        },
      });
      for (let index = 0; index < users.length; index++) {
        await auther
          .GetEnforcer()
          .addRoleForUser(users[index].id + '', value.title);
      }

      const bpms = await db.Bpms.findOne({
        where: {
          title: value.title,
        },
      });

      if (!bpms) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.name') }),
          404
        );
      }

      await bpms.update({
        title: value.title });

      return response.success(res, value);
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // get a users perticuler data
  ListAllRoles: async (req, res) => {
    try {
      console.log(66666)
      let auther = await rbac();
      let objs = await auther.GetEnforcer().getAllObjects();
      let acts = await auther.GetEnforcer().getAllActions();
      console.log('objs', objs)
      console.log('acts', acts)
      //FIXME only return roles
      let rawRoles = await auther.GetEnforcer().getAllSubjects();
      return response.success(res, rawRoles, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Get the list of permissions Role has
  ListRolePermissions: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        //@ts-ignore
        name: joi.string().required(),
      });
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });
      if (error) {
        return response.validation(res, error);
      }
      let auther = await rbac();
      let rawpermissions = await auther
        .GetEnforcer()
        .getImplicitPermissionsForUser(value.name);
      let roles = await auther
        .GetEnforcer()
        .getImplicitRolesForUser(value.name);
      return response.success(
        res,
        {
          roles,
          permissions: await RoleController._formatPermissions(
            rawpermissions,
            res.t
          ),
        },
        res.t('CRUD.Success')
      );
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //TEST Get list of own permissions for user
  ListMyPermissions: async (req, res) => {
    try {
      let auther = await rbac();
      let rawpermissions = await auther
        .GetEnforcer()
        .getImplicitPermissionsForUser(req.user.id + '');

      console.log('rawpermissions', rawpermissions)

      const formatedPermissions = await RoleController._formatPermissions(
        rawpermissions,
        res.t
      );
      return response.success(res, formatedPermissions, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Get the list of Roles User has
  ListMyRoles: async (req, res) => {
    try {
      let auther = await rbac();
      let rawRoles = await auther
        .GetEnforcer()
        .getImplicitRolesForUser(req.user.id + '');
      return response.success(res, rawRoles, res.t('CRUD.Success'));
    } catch (err) {
      response.catchError(err);
    }
  },

  ListRolesById: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        //@ts-ignore
        id: joi.number().required(),
      });
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });
      if (error) {
        return response.validation(res, error);
      }
      let data = [];
      let auther = await rbac();
      let rawRoles = await auther
        .GetEnforcer()
        .getImplicitRolesForUser(value.id + '');
      for (let i in rawRoles) {
        let rawpermissions = await auther
          .GetEnforcer()
          .getImplicitPermissionsForUser(rawRoles[i]);
        let roles = await auther
          .GetEnforcer()
          .getImplicitRolesForUser(rawRoles[i]);
        data.push({
          role_name: rawRoles[i],
          roles,
          permissions: RoleController._formatPermissions(rawpermissions, res.t),
        });
      }
      return response.success(res, data, res.t('CRUD.Success'));
    } catch (err) {
      response.catchError(err);
    }
  },

  // Get the list of permissions User has
  ListUserPermissions: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        //@ts-ignore
        id: joi.number().required(),
      });
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });
      if (error) {
        return response.validation(res, error);
      }
      let auther = await rbac();
      let rawpermissions = await auther
        .GetEnforcer()
        .getImplicitPermissionsForUser(value.id + '');

      const formatedPermissions = await RoleController._formatPermissions(
        rawpermissions,
        res.t
      );
      return response.success(res, formatedPermissions, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Create a role and add permissions to the role
  CreateRole: async (req, res) => {
    try {
      // db.User.truncate({cascade: true, restartIdentity:true}) //*
      // db.Factory.truncate({cascade: true, restartIdentity:true}) //*

      let auther = await rbac();
      let objs = await auther.GetEnforcer().getAllObjects();
      let acts = await auther.GetEnforcer().getAllActions();
      console.log('objs', objs);
      console.log('acts', acts);
      const Schema = joi.object().keys({
        title: joi.string().required(),
        //[
        permissions: joi.array().items(
          joi.object().keys({
            obj: joi
              .string()
              .only(),
              // .allow(...objs),
            acts: joi.array().items(
              joi
                .string()
                .only()
                // .allow(...acts)
            ),
          })
        ),
      });
      const { error, value } = Schema.validate(req.body, { abortEarly: true });
      if (error) {
        console.log('error', error)
        return response.validation(res, error);
      }
console.log(value)

      const bpms = await db.Bpms.findOne({
        where: {
          title: value.title,
        },
      });

      console.log('bpms', bpms);

      if (bpms) {
        return response.customError(
          res,
          res.t('CRUD.Duplicated', { name: res.t('joi.field.name') }),
          404
        );
      }

      console.log('bpms', bpms)

      await db.Bpms.create({
        title: value.title,
      });

      value.permissions.forEach(async (o) => {
        await o.acts.forEach(async (act) => {
          await auther.AddPermission(value.title, o.obj, act);
        });
      });
      return response.success(res, value);
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //add user to a role
  AddRoleToUser: async (req, res) => {
    try {
      let auther = await rbac();
      //FIXME only return roles
      let rawRoles = await auther.GetEnforcer().getAllSubjects();

      const Schema = joi.object().keys({
        user_id: joi.number().required(),
        role: joi
          .string()
          .only()
          .allow(...rawRoles),
      });
      const { error, value } = Schema.validate(req.body, { abortEarly: true });
      if (error) {
        return response.validation(res, error);
      }

      const user = await db.User.findByPk(value.user_id);
      await user.update({
        role: value.role,
      });

      let ok = await auther
        .GetEnforcer()
        .addRoleForUser(value.user_id + '', value.role);
      return response.success(res, ok, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Delete a role and permissions to the role
  DeleteRole: async (req, res) => {
    try {
      let auther = await rbac();
      const Schema = joi.object().keys({
        title: joi.string().required(),
      });
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });
      if (error) {
        return response.validation(res, error);
      }
      let deleteRoles = await auther.GetEnforcer().deleteRole(value.title);
      return response.success(res, deleteRoles);
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // get permissions with admin id
  adminPermissions: async (id, res) => {
    try {
      let data = [];
      let auther = await rbac();
      let rawRoles = await auther
        .GetEnforcer()
        .getImplicitRolesForUser(id + '');
      for (let i in rawRoles) {
        let rawpermissions = await auther
          .GetEnforcer()
          .getImplicitPermissionsForUser(rawRoles[i]);
        let roles = await auther
          .GetEnforcer()
          .getImplicitRolesForUser(rawRoles[i]);
        data.push({
          role_name: rawRoles[i],
          roles,
          permissions: RoleController._formatPermissions(rawpermissions, res.t),
        });
      }
      return data;
    } catch (err) {
      console.log(err);
      throw new Error('RBAC Error: ', err);
    }
  },

  GetMangesHaveThisRole: async (title) => {
    let auther = await rbac();
    let ids = [];

    let users = await db.User.findAll({
      attributes: ['id'],
    });
    await users.map(async (el) => {
      let roles = await auther
        .GetEnforcer()
        .getImplicitRolesForUser(el.id + '');
      await roles.map((role) => {
        if (role == title) ids.push(el.id + '');
      });
    });
    return ids;
  },

  RoleBackManges: async (ids, title) => {
    let auther = await rbac();
    await Promise.all(
      ids.map(async (id) => {
        await auther.GetEnforcer().addRoleForUser(id, title);
      })
    );
    return true;
  },

  UpdateRole: async (req, res) => {
    try {
      let auther = await rbac();
      let objs = await auther.GetEnforcer().getAllObjects();
      let acts = await auther.GetEnforcer().getAllActions();
      console.log({ objs, acts });
      const Schema = joi.object().keys({
        title: joi.string().required(),
        //[
        permissions: joi.array().items(
          joi.object().keys({
            obj: joi
              .string(),
              // .only()
              // .allow(...objs),
            acts: joi.array().items(joi.string()),
          })
        ),
      });

      const { error, value } = Schema.validate(req.body, { abortEarly: true });
      console.log(4)
      if (error) {
        console.log('error', error)
        return response.validation(res, error);
      }
      console.log(3)
      let deleteRoles = await auther.GetEnforcer().deleteRole(value.title);
console.log(1)
      let ids = await module.exports.GetMangesHaveThisRole(value.title);
      console.log(2)
      await auther.GetEnforcer().deleteRole(value.title);

      console.log('value.permissions', value.permissions)

      value.permissions.forEach(async (o) => {
        await o.acts.forEach(async (act) => {
          await auther.AddPermission(value.title, o.obj, act);
        });
      });
      await module.exports.RoleBackManges(ids, value.title);
      let users = await db.User.findAll({
        where: {
          role: value.title,
        },
      });
      for (let index = 0; index < users.length; index++) {
        await auther
          .GetEnforcer()
          .addRoleForUser(users[index].id + '', value.title);
      }

      const bpms = await db.Bpms.findOne({
        where: {
          title: value.title,
        },
      });

      if (!bpms) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.name') }),
          404
        );
      }

      await bpms.update({
        title: value.title,
      });

      return response.success(res, value);
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = RoleController;
