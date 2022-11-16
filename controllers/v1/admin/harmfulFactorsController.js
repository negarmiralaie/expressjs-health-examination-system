// ? //////////////////////////////// Some Qs Left ////////////////////////////////////////////////////
const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');

const base = db.Harmfulfactor;
const harmfulFactorsController = {
  list: async (req, res) => { 
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
              currentJobRole: joi.string(),
              currentJobDuty: joi.string(),
              currentJobStartingdate: joi.string(),
              resultDescription: joi.string(),
              healthExpertSuggestion: joi.array().items(joi.string()), //Array
              DiseaseBg: joi.array().items(joi.string()), //Array
              description: joi.string(),
              height: joi.string(),
              weight: joi.string(),
              bmi: joi.string(),
              bmiStatus: joi.string(),
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
        if (where.currentJobRole) where.currentJobRole = where.currentJobRole;
        if (where.currentJobDuty) where.currentJobDuty = where.currentJobDuty;
        if (where.currentJobStartingdate) where.currentJobStartingdate = where.currentJobStartingdate;
        if (where.resultDescription) where.resultDescription = where.resultDescription;
        if (where.healthExpertSuggestion) where.healthExpertSuggestion = where.healthExpertSuggestion;
        if (where.DiseaseBg) where.DiseaseBg = where.DiseaseBg;
        if (where.description) where.description = where.description;
        if (where.height) where.height = where.height;
        if (where.weight) where.weight = where.weight;
        if (where.bmi) where.bmi = where.bmi;
        if (where.bmiStatus) where.bmiStatus = where.bmiStatus;
      }

      console.log('where', where);
      const optometryAndAudiometry = await Helper.paginate(
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
      console.log('optometryAndAudiometry', optometryAndAudiometry);
      return response.success(res, optometryAndAudiometry, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  create: async (req, res) => {
    try {
      const schema = joi.object().keys({ 
        // examiner_id: joi.number(),
        examined_id: joi.number(),
        currentJobRole: joi.string(),
        currentJobDuty: joi.string(),
        currentJobStartingdate: joi.string(),
        resultDescription: joi.string(),
        healthExpertSuggestion: joi.array().items(joi.string()), //Array
        DiseaseBg: joi.array().items(joi.string()), //Array
        description: joi.string(),
        height: joi.string(),
        weight: joi.string(),
        bmi: joi.string(),
        bmiStatus: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      value.examiner_id = req.user.id;
      const optometryAndAudiometry = await base.create(value);
      await db.User.increment({
        numberOfFilledForms : +1,
        numberOfExaminedPersonnels: +1,
      },
      { where: { id: value.examiner_id } });
      console.log('optometryAndAudiometry', optometryAndAudiometry)

      return response.success(res, optometryAndAudiometry, res.t('CRUD.Create'));
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

      const harmfulFactor = await base.findByPk(req.params.id);
      if (!harmfulFactor) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('harmfulFactor', { scope: 'joi.field.harmfulFactor' }),
          }),
          404
        );
      }
      await harmfulFactor.destroy();
      return response.success(res, harmfulFactor, res.t('CRUD.Deleted'));
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

      const harmfulFactor = await base.findByPk(value.id, {
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

      if (!harmfulFactor) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('harmfulFactor', { scope: 'joi.field.harmfulFactor' }),
          }),
          404
        );
      }

      return response.success(res, harmfulFactor, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  update: async (req, res) => {
    try {

      const schema = joi.object().keys({
        currentJobRole: joi.string(),
        currentJobDuty: joi.string(),
        currentJobStartingdate: joi.string(),
        resultDescription: joi.string(),
        healthExpertSuggestion: joi.array().items(joi.string()), //Array
        DiseaseBg: joi.array().items(joi.string()), //Array
        description: joi.string(),
        height: joi.string(),
        weight: joi.string(),
        bmi: joi.string(),
        bmiStatus: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const id = req.params.id;

      let harmfulFactor = await base.findOne({
        where: {
            [Op.or]: [
              {
                harmfulFactor: value.harmfulFactor,
              },
            ],
        },
      });

      if (harmfulFactor) {
        return response.validation(
          res,
          res.t('User.Title_Or_Description_Already_Exist'),  //!FIX THIS AFTER YOU FOUND UNIQUE PARTS 
        );
      }
      
      harmfulFactor = await base.findByPk(id);
      if (!harmfulFactor) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('harmfulFactor', { scope: 'joi.field.harmfulFactor' }),
          }),
          404
        );
      }

      //save to db
      await harmfulFactor.update(value);
      return response.success(res, harmfulFactor, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = harmfulFactorsController;
