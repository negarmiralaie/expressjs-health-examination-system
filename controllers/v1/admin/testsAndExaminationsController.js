const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');

const base = db.TestExamination;
const testsAndExaminationsController = {
  list: async (req, res) => { //^ Gets list pf factories
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
              examiner_id: joi.number(),
              examined_id: joi.number(),
              bloodPressure: joi.string(),
              pulsePerMinute: joi.string(),
              testResults: joi.string(),
              testDescription: joi.string(),
              examinationDescription: joi.string(),
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
        // console.log('value.filter.where', value.filter.where)
        where = {
          ...value.filter.where,
        };
        if (where.bloodPressure) where.bloodPressure = where.bloodPressure;
        if (where.pulsePerMinute) where.pulsePerMinute = where.pulsePerMinute;
        if (where.testResults) where.testResults = where.testResults;
        if (where.testDescription) where.testDescription = where.testDescription;
        if (where.examinationDescription) where.examinationDescription = where.examinationDescription;
      }

      console.log('where', where);
      const testsAndExaminations = await Helper.paginate(
        base,
        value.page,
        {
          order: [[value.filter.order.by, value.filter.order.sort]],
          where,
          include: [
            {
              model: db.User,
            },
          ],
        },
        value.limit
      );
      console.log('testsAndExaminations', testsAndExaminations);
      return response.success(res, testsAndExaminations, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  create: async (req, res) => {
    try {
      const schema = joi.object().keys({ 
        // examiner_id: joi.number(),
        examined_id: joi.number().required(),
        bloodPressure: joi.string(),
        pulsePerMinute: joi.string(),
        testResults: joi.string(),
        testDescription: joi.string(),
        examinationDescription: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const examined = await db.Personnel.findByPk(value.examined_id);
      if (!examined) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.personnel') }),
          404
        );
      }

      console.log('req.user', req.user)
      value.examiner_id = req.user.id;
      const testsAndExaminations = await base.create(value);
      await db.User.increment({
        numberOfFilledForms : +1,
        numberOfExaminedPersonnels: +1,
      },
      { where: { id: value.examiner_id } });
      console.log('testsAndExaminations', testsAndExaminations)

      return response.success(res, testsAndExaminations, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  delete: async (req, res) => {
    try {
      const schema = joi.object().keys({
        id: joi.string,
      });
      const { error, value } = schema.validate(req.password, {
        abortEarly: true,
      });

      if (error)return response.validation(res, error);

      const testsAndExamination = await base.findByPk(req.params.id);
      if (!testsAndExamination) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('testsAndExamination', { scope: 'joi.field.testsAndExamination' }),
          }),
          404
        );
      }
      await testsAndExamination.destroy();
      return response.success(res, testsAndExamination, res.t('CRUD.Deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  get: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        id: joi.number().required(),
      });
  
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });
      if (error) return response.validation(res, error);

      const testsAndExamination = await base.findByPk(value.id, {
        include: [
          {
            model: db.User,
          },
        ],
      });
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // if (suggestion !== null && suggestion.factory_id) {
      //   suggestion.factory_id = await base.findByPk(suggestion.factory_id);
      // }

      if (!testsAndExamination) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('testsAndExamination', { scope: 'joi.field.testsAndExamination' }),
          }),
          404
        );
      }

      return response.success(res, testsAndExamination, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  update: async (req, res) => {
    try {

      const schema = joi.object().keys({
        bloodPressure: joi.string(),
        pulsePerMinute: joi.string(),
        testResults: joi.string(),
        testDescription: joi.string(),
        examinationDescription: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const id = req.params.id;

      let testsAndExamination = await base.findOne({
        where: {
            [Op.or]: [
              {
                testResults: value.testResults,
              },
            ],
        },
      });

      if (testsAndExamination) {
        return response.validation(
          res,
          res.t('User.Title_Or_Description_Already_Exist'),  //!FIX THIS AFTER YOU FOUND UNIQUE PARTS 
        );
      }
      
      testsAndExamination = await base.findByPk(id);
      if (!testsAndExamination) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('testsAndExamination', { scope: 'joi.field.testsAndExamination' }),
          }),
          404
        );
      }

      //save to db
      await testsAndExamination.update(value);
      return response.success(res, testsAndExamination, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = testsAndExaminationsController;
