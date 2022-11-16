const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');

const base = db.Case;
const casesController = {
  // List Cases
  list: async (req, res) => { //^ Gets list pf cases
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
              title: joi.string(),
              fileUrl: joi.string(),
              factory_id: joi.number(),
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

        if (where.title) where.title = where.title;
        if (where.fileUrl) where.fileUrl = where.fileUrl;
      }

      const cases = await Helper.paginate(
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

      return response.success(res, cases, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  create: async (req, res) => {
    try {
      const schema = joi.object().keys({ 
        title: joi.string(),
        fileUrl: joi.string(),
      });

      // Try to get factory_id from headers //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      const user = req.user;
      const factory_id = user.id;
      console.log('user', user);
      console.log('factory_id', factory_id);

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      // Check to see if factory_id is valid and a factory with this id exists
      if (value.factory_id) {
        const factory = await db.Factory.findByPk(value.factory_id, {});

        if (!factory) {
          return response.customError(
            res,
            res.t('CRUD.Not_Found', { name: res.t('joi.field.factory') }),
            404
          );
        }
      }

      const duplicate = await base.findAll({
        where: {
          [Op.and]: [
            {
              title: value.title,
            },
            {
              factory_id: value.factory_id,
            },
          ],
        },
      });

      if (duplicate.length > 0) { 
        return response.customError(
          res,
          res.t('CRUD.Duplicated', {
            name: res.t('joi.hybrid.title_factoryId'),
          }),
          404
        );
      }

        // Bc of our upload middleware, now we have access to req.file
        const file = req.file;
  
        if (file) {
          const fileSet = await uploadFileController.singleFileUpload(files);
          const caseFile = await caseBase.create({
            factory_id,
            title: fileSet.fileName,
            fileUrl: process.env.SERVER_ADDR + fileSet.filePath,
          });
        }

      const createdCase = await base.create(value);

      return response.success(res, createdCase, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //Delete Case
  delete: async (req, res) => {
    try {
      const schema = joi.object().keys({
        id: joi.string,
      });
      const { error, value } = schema.validate(req.password, {
        abortEarly: true,
      });
      if (error)return response.validation(res, error);

      const foundCase = await base.findByPk(req.params.id);
      if (!foundCase) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('case', { scope: 'joi.field.case' }),
          }),
          404
        );
      }
      await foundCase.destroy();
      return response.success(res, foundCase, res.t('CRUD.Deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Get a case information
  getByFactoryName: async (req, res) => {
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
          // Find factory_id using factoryName:
          const factoryName = value.filter.where.factoryName;
          const factory = await db.Factory.findOne({ where: { name: factoryName } });

          if (!factory) {
            return response.customError(
              res,
              res.t('CRUD.Not_Found', { name: res.t('joi.field.factory') }),
              404
            );
          }

          const factory_id = factory.id;
          where = {
            ...value.filter.where,
          };
          delete where.factoryName;
          where.factory_id = factory_id;
        };

        const foundCases = await Helper.paginate(
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

        console.log('foundCases', foundCases)

      // if (foundCase !== null && foundCase.factory_id) {
      //   foundCase.factory_id = await base.findByPk(foundCase.factory_id);
      // }

      if (!foundCases) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('case', { scope: 'joi.field.case' }),
          }),
          404
        );
      }

      return response.success(res, foundCases, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  myCases: async (req, res) => { //^ Gets list pf cases
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
              title: joi.string(),
              fileUrl: joi.string(),
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

      const user = req.user;
      const factory_id = user.role === 'factory' ? user.id : user.factory_id;
      console.log('factory_id', factory_id);

      let where = {};
      where.factory_id = factory_id;

      const cases = await Helper.paginate(
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

      return response.success(res, cases, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = casesController;
