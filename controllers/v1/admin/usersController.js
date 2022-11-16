const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const {  StatusList } = require('../../../components/enums');
const { Op } = require('sequelize');
const rbac = require('../../../components/auth/rbac');
const generator = require('generate-password');

const base = db.User;
const usersController = {

  listUsers: async (req, res) => { //^ Gets list pf users
    try {
      // base.truncate({cascade: true, restartIdentity:true}) //*
      // db.Cases.truncate({cascade: true, restartIdentity:true}) //*
      // db.Factories.truncate({cascade: true, restartIdentity:true}) //*
      const Schema = joi.object().keys({
        page: joi.number(),
        limit: joi.number(),
        filter: joi
          .object()
          .keys({
            where: joi
            .object()
            .keys({
              factoryName: joi.string(),
            })
            .default({}),
            order: joi
              .object()
              .keys({
                by: joi.string().default('createdAt'),
                sort: joi.string().only().allow('asc', 'desc').default('desc'),
              })
              .default({ by: 'createdAt', sort: 'desc' }),
          })
          .default({ order: { by: 'createdAt', sort: 'desc' } }),
      });

      const { error, value } = Schema.validate(req.query, { abortEarly: true });
      if (error) return response.validation(res, error);

      let where = {};
      if (value.filter.where) {
        where = {
          ...value.filter.where,
        };

        if (where.factoryName) where.factoryName = where.factoryName;
      };

      const users = await Helper.paginate(
        base,
        value.page,
        {
          // attributes: ['id', 'fullName', 'factoryName', 'username', 'role', 'mobile', 'expirationDate', 'status'],
          order: [[value.filter.order.by, value.filter.order.sort]],
          where,
        },
        value.limit
      );

      return response.success(res, users, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  createUser: async (req, res) => {
    try {
      let auther = await rbac();
      // Get all available roles from casbin and store them in rawRoles so that we can tell client that its entered role must be one of these
      const rawRoles = await auther.GetEnforcer().getAllSubjects();
      console.log('rawRoles', rawRoles)
      const schema = joi.object().keys({ 
        factoryName: joi.string().required(),
        fullName: joi.string().required(),
        username: joi.string(),
        password: joi.string(),
        role: joi
          .string()
          .only()
          .allow(...rawRoles)
          .required(),
        email: joi.string(),
        mobile: joi.string(),
        phone: joi.string(),
        address: joi.string(),
        expirationDate: joi.string(),
        dedicatedIp: joi.string(),
        status: joi
        .string()
        .only()
        .allow(...StatusList)
        .required(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);
      const duplicate = await base.findAll({
        where: {
          [Op.and]: [
            {
              mobile: value.mobile,
            },
            {
              username: value.username,
            },
          ],
        },
      });

      if (duplicate.length > 0) {
        return response.customError(
          res,
          res.t('CRUD.Duplicated', {
            name: res.t('joi.hybrid.mobile_username'),
          }),
          404
        );
      };

      // NOW CHECK IF FACTORY_ID EXISTS...
      const factory = await db.Factory.findOne({
        attributes: ['id'],
        where: {
          name: value.factoryName,
        },
      });

      if (!factory) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.factory') }),
          404
        );
      };

      const factory_id = factory.dataValues.id;
      value.factory_id = factory_id;

      // ! CHECK IF THIS PART ALSO WORKS FOR OTHER USERS THAN EXMAINERS....
      // if(value.role === 'examiner') {
      value.numberOfExaminedPersonnels = 0;
      value.numberOfFilledForms = 0;
      // } else {
        // value.numberOfExaminedPersonnels = null;
        // value.numberOfFilledForms = null;
      // };

      value.password = await Helper.Hash(value.password);

      const photo = req.photo;
      if (photo) {
        const photo = await uploadFileController.multipleFileUpload(photo);
        value.photoUrl = process.env.SERVER_ADDR + photo.filePath; //^ USEFUL FOR SETTINGS
        console.log(value.photoUrl);
      };

      const user = await base.create(value);

      // After you save user, assign gievn role to him.
      // This is how we assign a role to user.it will be accessed using user.is+'-ser'
      // await auther.GetEnforcer().addRoleForUser(user.id + '-user', value.role); //*
      // const obj = 'users'; //*
      // const act = 'read'; //*
      // This adds this:rawpermissions [
      //            [ '18-user', 'users', 'read' ],
      //            [ '18-user', 'factories', 'delete' ]
      //         ]
      // And this:
      // permissions [
      //   { obj: 'users', title: 'users', acts: [ [Object] ] },
      //   { obj: 'factories', title: 'factories', acts: [ [Object] ] }
      // ]

      // await auther.AddPermission(user.id + '-user', 'users', 'create'); //*
      // await auther.AddPermission(user.id + '-user', 'users', 'read'); //*
      // await auther.AddPermission(user.id + '-user', 'users', 'update'); //*
      // await auther.AddPermission(user.id + '-user', 'users', 'delete'); //*
      // if (user.role === 'examiner') {
      //   await db.Factory.increment({
      //     numberOfPersonnels : +1,
      //   },
      //   { where: { id: user.factory_id } });
      // }
      return response.success(res, user, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const schema = joi.object().keys({
        id: joi.string,
      });
      const { error, value } = schema.validate(req.password, {
        abortEarly: true,
      });
      if (error)return response.validation(res, error);

      const user = await base.findByPk(req.params.id);
      if (!user) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('user', { scope: 'joi.field.user' }),
          }),
          404
        );
      }

      await user.destroy();
      return response.success(res, user, res.t('CRUD.Deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  getUserById: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        id: joi.number().required(),
      });
  
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });

      if (error) return response.validation(res, error);

      const user = await base.findByPk(value.id);
      if (!user) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('user', { scope: 'joi.field.user' }),
          }),
          404
        );
      }

      return response.success(res, user, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Update User
  updateUser: async (req, res) => {
    try {
      let auther = await rbac();
      let rawRoles = await auther.GetEnforcer().getAllSubjects();

      const schema = joi.object().keys({ 
        factoryName: joi.string(),
        fullName: joi.string(),
        username: joi.string(),
        password: joi.string(),
        role: joi
          .string()
          .only()
          .allow(...rawRoles),
        email: joi.string(),
        mobile: joi.string(),
        phone: joi.string(),
        address: joi.string(),
        expirationDate: joi.string(),
        dedicatedIp: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      console.log('value', value)
      if (error) return response.validation(res, error);

      const user = await base.findByPk(req.params.id);
      if (!user) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('user', { scope: 'joi.field.user' }), 
          }),
          404
        );
      }

      // // If a new role was entered to be updated.... update his role....
      // if (value.role && user.role != value.role) {
      //   console.log({ role: user.role });
      //   await auther.GetEnforcer().deleteRoleForUser(user.id + '', user.role);
      //   const add = await auther
      //     .GetEnforcer()
      //     .addRoleForUser(user.id + '', value.role);
      //   console.log({ add });
      // }

      if (value.factoryName) {
        // NOW CHECK IF FACTORY_ID EXISTS USING GIVEN FACTORYNAME...
        const factory_id = await db.Factory.findOne({
          attributes: ['id'],
          where: {
            name: value.factoryName,
          },
        });

        if (!factory_id) {
          return response.customError(
            res,
            res.t('CRUD.Not_Found', { name: res.t('joi.field.factory') }),
            404
          );
        };
      }

      if (value.password) value.password = await Helper.Hash(value.password);

      console.log('value.username', value)
      //save to db
      await user.update(value);
      return response.success(res, user, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  getUsersActivity: async (req, res) => { //^ Gets list pf users
    try {
  //     const Schema = joi.object().keys({
  //       page: joi.number(),
  //       limit: joi.number(),
  //       filter: joi
  //         .object()
  //         .keys({
  //           where: joi
  //           .object()
  //           .keys({
  //             fullName: joi.string(),
  //             username: joi.string(),
  //           })
  //           .default({}),
  //           order: joi
  //             .object()
  //             .keys({
  //               by: joi.string().default('createdAt'),
  //               sort: joi.string().only().allow('asc', 'desc').default('desc'),
  //             })
  //             .default({ by: 'createdAt', sort: 'desc' }),
  //         })
  //         .default({ order: { by: 'createdAt', sort: 'desc' } }),
  //     });

  //     const { error, value } = Schema.validate(req.query, { abortEarly: true });
  //     if (error) return response.validation(res, error);

  //     let where = {};
  //     if (value.filter.where) {
  //       where = {
  //         ...value.filter.where,
  //       };

  //       if (where.fullName) where.fullName = where.fullName;
  //       if (where.username) where.username = where.username;
  //     };

  //     where.role = 'admin';

  //     const users = await Helper.paginate(
  //       base,
  //       value.page,
  //       {
  //         order: [[value.filter.order.by, value.filter.order.sort]],
  //         where,
  //         include: [
  //           {
  //             model: db.Factory,
  //           },
  //         ],
  //       },
  //       value.limit
  //     );


  //     return response.success(res, users, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = usersController;
