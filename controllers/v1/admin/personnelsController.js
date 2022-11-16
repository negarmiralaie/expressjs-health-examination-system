const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { 
  StatusList,
  genderList,
  examinationTypeList,
  militaryStatusList,
  serviceLineList,
  maritalStatusList,
} = require('../../../components/enums');
const { Op } = require('sequelize');
const rbac = require('../../../components/auth/rbac');
const generator = require('generate-password');

const base = db.Personnel;
const personnelsController = {
  listPersonnels: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        page: joi.number(),
        limit: joi.number(),
        filter: joi
          .object()
          .keys({
            where: joi
            .object()
            .keys({
              fullName: joi.string(),
              SSN: joi.string(),
              personalNo: joi.string(),
              factoryName: joi.string(),
              SSN: joi.number(),
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

        if (where.fullName) where.fullName = where.fullName;
        if (where.SSN) where.SSN = where.SSN;
        if (where.personalNo) where.personalNo = where.personalNo;
        if (where.factoryName) where.factoryName = where.factoryName;
        if (where.status) where.status = where.status;
      };

      const personnels = await Helper.paginate(
        base,
        value.page,
        {
        //   attributes: ['fullName', 'factoryName', 'role', 'birthYear', 'SSN', 'status', 'date'],
          order: [[value.filter.order.by, value.filter.order.sort]],
          where,
        },
        value.limit
      );

      return response.success(res, personnels, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  createPersonnel: async (req, res) => {
    try {
      let auther = await rbac();
      // Get all available roles from casbin and store them in rawRoles so that we can tell client that its entered role must be one of these
      const rawRoles = await auther.GetEnforcer().getAllSubjects();
      console.log(rawRoles);

      const schema = joi.object().keys({ 
        factoryName: joi.string().required(),
        examinationType: joi
          .string()
          .only()
          .allow(...examinationTypeList)
          .required(),
        date: joi.string().required(),
        fileNo: joi.string().required(),
        personalNo: joi.string().required(),
        fullName: joi.string().required(),
        fatherName: joi.string().required(),
        gender: joi
          .string()
          .only()
          .allow(...genderList)
          .required(),
        maritalStatus: joi
          .string()
          .only()
          .allow(...maritalStatusList)
          .required(),
        childrenNumber: joi.number().required(),
        birthYear: joi.string().required(),
        SSN: joi.string().required(),
        militaryStatus: joi
          .string()
          .only()
          .allow(...militaryStatusList)
          .required(),
        serviceLine: joi
          .string()
          .only()
          .allow(...serviceLineList)
          .required(),
        description: joi.string(),
        status: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      // Check for duplicate personnel using given personalNo
      const duplicate = await base.findAll({
        where: {
          personalNo: value.personalNo,
        },
      });

      // If duplicate existed....
      if (duplicate.length > 0) {
        return response.customError(
          res,
          res.t('CRUD.Duplicated', {
            name: res.t('joi.hybrid.personalNo'),
          }),
          404
        );
      };

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
      // value.role = 'personnel';

      const photo = req.photo;
      if (photo) {
        const photo = await uploadFileController.multipleFileUpload(photo);
        value.photoUrl = process.env.SERVER_ADDR + photo.filePath; //! USEFUL FOR SETTINGS
        console.log(value.photoUrl);
      }

      const personnel = await base.create(value);
      if (personnel.role === 'personnel') {
        await db.Factory.increment({
          numberOfPersonnels : +1,
        },
        { where: { id: factory_id } });
      }

      return response.success(res, personnel, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //Delete 
  deletePersonnel: async (req, res) => {
    try {
      const schema = joi.object().keys({
        id: joi.string,
      });
      const { error, value } = schema.validate(req.password, {
        abortEarly: true,
      });
      if (error)return response.validation(res, error);

      const personnel = await base.findByPk(req.params.id);
      if (!personnel) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('personnel', { scope: 'joi.field.personnel' }),
          }),
          404
        );
      }

      await personnel.destroy();
      return response.success(res, personnel, res.t('CRUD.Deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  getPersonnelById: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        id: joi.number().required(),
      });
  
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });

      if (error) return response.validation(res, error);

      const personnel = await base.findByPk(value.id);
    //   const personnel = await base.findOne({
    //     attributes: ['fullName', 'factoryName', 'role', 'birthYear', 'SSN', 'status', 'date'],
    //     where: { id: value.id }
    //   });

      if (!personnel) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('personnel', { scope: 'joi.field.personnel' }),
          }),
          404
        );
      }

      return response.success(res, personnel, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  updatePersonnel: async (req, res) => {
    try {
      let auther = await rbac();
      let rawRoles = await auther.GetEnforcer().getAllSubjects();

      const schema = joi.object().keys({ 
        factoryName: joi.string(),
        examinationType: joi
          .string()
          .only()
          .allow(...examinationTypeList),
        date: joi.string(),
        fileNo: joi.string(),
        personalNo: joi.string(),
        fullName: joi.string(),
        fatherName: joi.string(),
        gender: joi
          .string()
          .only()
          .allow(...genderList),
        maritalStatus: joi
          .string()
          .only()
          .allow(...maritalStatusList),
        childrenNumber: joi.number(),
        birthYear: joi.string(),
        SSN: joi.string(),
        militaryStatus: joi
          .string()
          .only()
          .allow(...militaryStatusList),
        serviceLine: joi
          .string()
          .only()
          .allow(...serviceLineList),
        description: joi.string(),
        status: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const personnel = await base.findByPk(req.params.id);
      if (!personnel) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('personnel', { scope: 'joi.field.personnel' }), 
          }),
          404
        );
      };

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

      // // If a new role was entered to be updated.... update his role....
      // if (value.role && user.role != value.role) {
      //   console.log({ role: user.role });
      //   await auther.GetEnforcer().deleteRoleForUser(user.id + '', user.role);
      //   const add = await auther
      //     .GetEnforcer()
      //     .addRoleForUser(user.id + '', value.role);
      //   console.log({ add });
      // }

      if (value.password) value.password = await Helper.Hash(value.password);

      //save to db
      await personnel.update(value);
      return response.success(res, personnel, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // لیست پرسنل صنایع من 
  getMyPersonnels: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        page: joi.number(),
        limit: joi.number(),
        filter: joi
          .object()
          .keys({
            where: joi
            .object()
            .keys({
              fullName: joi.string(),
              SSN: joi.string(),
              personalNo: joi.string(),
              status: joi.string(),
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

        if (where.fullName) where.fullName = where.fullName;
        if (where.SSN) where.SSN = where.SSN;
        if (where.personalNo) where.personalNo = where.personalNo;
        if (where.status) where.status = where.status;
      };

      const user = req.user;
      console.log('user', user);
      where.factory_id = user.factory_id;
      console.log('where.factory_id', where.factory_id);
      // const factory_id = user.role === 'factory' ? user.id : user.factory_id;
      // where.factory_id = factory_id;

      const users = await Helper.paginate(
        base,
        value.page,
        {
          order: [[value.filter.order.by, value.filter.order.sort]],
          where,
          include: [
            {
              model: db.Factory,
            },
          ],
        },
        value.limit
      );

      return response.success(res, users, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // getFormsStatusByPersonnelId : async (req, res) => {

  // }
};

module.exports = personnelsController;
