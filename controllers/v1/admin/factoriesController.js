const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');
const Sequelize = require('sequelize')
const { StatusList } = require('../../../components/enums');
const uploadFileController = require('./fileUploadController')

const base = db.Factory;
const caseBase = db.Case;
const factoriesController = {
  // List Factories
  list: async (req, res) => { //^ Gets list of factories
    try {
      // base.truncate({cascade: true, restartIdentity:true}) //*
      const Schema = joi.object().keys({
        page: joi.number(),
        limit: joi.number(),
        filter: joi
          .object()
          .keys({
            where: joi
            .object()
            .keys({
              abbrvCode: joi.string(),
              name: joi.string(),
              mobile: joi.string(),
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
        if (where.abbrvCode) where.abbrvCode = where.abbrvCode;
        if (where.name) where.name = where.name;
        if (where.mobile) where.mobile = where.mobile;
        if (where.status) where.status = where.status;
      }

      const factories = await Helper.paginate(
        base,
        value.page,
        {
          order: [[value.filter.order.by, value.filter.order.sort]],
          where,
        },
        value.limit
      );

      return response.success(res, factories, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  create: async (req, res) => {
    try {
      const schema = joi.object().keys({ 
        abbrvCode: joi.string().required(),
        name: joi.string().required(),
        mobile: joi.string(),
        status: joi
        .string()
        .only()
        .allow(...StatusList)
        .required(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      console.log('value.abbrvCode', value.abbrvCode);
      let duplicate = await base.findAll({
        where: {
            [Op.and]: [
              {
                abbrvCode: 'IPCO-' + value.abbrvCode,
              },
              {
                name: value.name,
              },
            ],
        },
      });
      console.log('duplicate', duplicate)

      if (duplicate.length > 0) {
        return response.customError(
          res,
          res.t('CRUD.Duplicated', {
            name: res.t('joi.hybrid.abbrvCode_name'),
          }),
          404
        );
      }

      value.abbrvCode = 'IPCO-' + value.abbrvCode;

      // Bc of our upload middleware, now we have access to req.files
      const files = req.files;
      value.numberOfCases = files ? Object.keys(files).length : 0;

      const factory = await base.create(value);

      console.log(factory);
      const factory_id = factory.dataValues.id;

      if (files) {
        const filesArray = await uploadFileController.multipleFileUpload(files);
        // Now store these files in case db
        for (const file of filesArray) {
          const caseFile = await caseBase.create({
            factory_id,
            title: file.fileName,
            fileUrl: process.env.SERVER_ADDR + file.filePath,
          });
        }
      }

      return response.success(res, factory, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //Delete factory
  delete: async (req, res) => {
    try {
      const schema = joi.object().keys({
        id: joi.string,
      });
      const { error, value } = schema.validate(req.password, {
        abortEarly: true,
      });
      if (error)return response.validation(res, error);

      const factory = await base.findByPk(req.params.id);
      if (!factory) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('factory', { scope: 'joi.field.factory' }),
          }),
          404
        );
      }
      const result = await db.Case.destroy({where: { factory_id: factory.id }})
      // await factory.removeCases(factory.id);
      await factory.destroy();
      return response.success(res, factory, res.t('CRUD.Deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Get a factory information
  get: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        id: joi.number().required(),
      });
  
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });

      if (error) return response.validation(res, error);

      const factories = await base.findByPk(value.id, {});

      if (!factories) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('factory', { scope: 'joi.field.factory' }),
          }),
          404
        );
      }

      return response.success(res, factories, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        id: joi.number().required(),
      });
  
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });

      if (error) return response.validation(res, error);

      const factory = await base.findByPk(value.id, {});

      if (!factory) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('factory', { scope: 'joi.field.factory' }),
          }),
          404
        );
      }

      if (factory.status === StatusList [0]) factory.status = StatusList[1];
      else factory.status = StatusList[0];
      await factory.update(factory); //!Check this

      return response.success(res, factory, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  update: async (req, res) => {
    try {
      const schema = joi.object().keys({
        abbrvCode: joi.string(),
        name: joi.string(),
        mobile: joi.string(),
        status: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const { id } = req.params;

      const factory = await base.findByPk(id);
      if (!factory) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('factory', { scope: 'joi.field' }),
          }),
          404
        );
      }

      //save to db
      console.log('value', value)
      await factory.update(value);
      return response.success(res, factory, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = factoriesController;
