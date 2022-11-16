const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');

const base = db.Optometryaudiometry;
const optometryAndAudiometryController = {
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
              rightEyeVisualAcuity: joi.string(),
              leftEyeVisualAcuity: joi.string(),
              colorVision: joi.string(),
              visualField: joi.string(),
              depthVision: joi.string(),
              optometryDescription: joi.string(),
              rightEarCondition: joi.string(),
              leftEarCondition: joi.string(),
              audiometryCondition: joi.string(),
              audiometryDescription: joi.string(),
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
        if (where.rightEyeVisualAcuity) where.rightEyeVisualAcuity = where.rightEyeVisualAcuity;
        if (where.leftEyeVisualAcuity) where.leftEyeVisualAcuity = where.leftEyeVisualAcuity;
        if (where.colorVision) where.colorVision = where.colorVision;
        if (where.visualField) where.visualField = where.visualField;
        if (where.depthVision) where.depthVision = where.depthVision;
        if (where.optometryDescription) where.optometryDescription = where.optometryDescription;
        if (where.rightEarCondition) where.rightEarCondition = where.rightEarCondition;
        if (where.leftEarCondition) where.leftEarCondition = where.leftEarCondition;
        if (where.audiometryCondition) where.audiometryCondition = where.audiometryCondition;
        if (where.audiometryDescription) where.audiometryDescription = where.audiometryDescription;
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
        rightEyeVisualAcuity: joi.string(),
        leftEyeVisualAcuity: joi.string(),
        colorVision: joi.string(),
        visualField: joi.string(),
        depthVision: joi.string(),
        optometryDescription: joi.string(),
        rightEarCondition: joi.string(),
        leftEarCondition: joi.string(),
        audiometryCondition: joi.string(),
        audiometryDescription: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      console.log('value', value);
      value.examiner_id = req.user.id;
      const optometryAndAudiometry = await base.create(value);
      await db.User.increment({
        numberOfFilledForms : +1,
        numberOfExaminedPersonnels: +1,
      },
      { where: { id: value.examiner_id } });
      console.log('optometryAndAudiometry', optometryAndAudiometry)
      console.log('value.examiner_id', value.examiner_id)

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

      const optometryAndAudiometry = await base.findByPk(req.params.id);
      if (!optometryAndAudiometry) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('optometryAndAudiometry', { scope: 'joi.field.optometryAndAudiometry' }),
          }),
          404
        );
      }
      await optometryAndAudiometry.destroy();
      return response.success(res, optometryAndAudiometry, res.t('CRUD.Deleted'));
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

      const optometryAndAudiometry = await base.findByPk(value.id, {
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

      if (!optometryAndAudiometry) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('optometryAndAudiometry', { scope: 'joi.field.optometryAndAudiometry' }),
          }),
          404
        );
      }

      return response.success(res, optometryAndAudiometry, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  update: async (req, res) => {
    try {

      const schema = joi.object().keys({
        rightEyeVisualAcuity: joi.string(),
        leftEyeVisualAcuity: joi.string(),
        colorVision: joi.string(),
        visualField: joi.string(),
        depthVision: joi.string(),
        optometryDescription: joi.string(),
        rightEarCondition: joi.string(),
        leftEarCondition: joi.string(),
        audiometryCondition: joi.string(),
        audiometryDescription: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const id = req.params.id;

      // let optometryAndAudiometry = await base.findOne({
      //   where: {
      //       [Op.or]: [
      //         {
      //           optometryDescription: value.optometryDescription,
      //         },
      //       ],
      //   },
      // });

      // if (optometryAndAudiometry) {
      //   return response.validation(
      //     res,
      //     res.t('User.Title_Or_Description_Already_Exist'),  //!FIX THIS AFTER YOU FOUND UNIQUE PARTS 
      //   );
      // }
      
      optometryAndAudiometry = await base.findByPk(id);
      if (!optometryAndAudiometry) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('optometryAndAudiometry', { scope: 'joi.field.optometryAndAudiometry' }),
          }),
          404
        );
      }

      //save to db
      await optometryAndAudiometry.update(value);
      return response.success(res, optometryAndAudiometry, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = optometryAndAudiometryController;
