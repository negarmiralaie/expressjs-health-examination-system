// ? //////////////////////////////// Some Qs Left ////////////////////////////////////////////////////
const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');
const generator = require('generate-password');

// const base = db.HealthInfo;
const healthInfoController = {
  list: async (req, res) => { //^ Gets list pf health infos
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
              examinationType: joi.string(),
              militaryStatus: joi.string(),
              serviceLine: joi.string(),
              healthExpertSuggestion: joi.string,
              diseaseBg: joi.string,
              testResults: joi.string,
              rightEyeVisualAcuity: joi.string,
              leftEyeVisualAcuity: joi.string,
              colorVision: joi.string,
              visualField: joi.string,
              depthVision: joi.string,
              rightEarCondition: joi.string,
              leftEarCondition: joi.string,
              medicalAdvice: joi.string,
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
        if (where.examinationType) where.examinationType = where.examinationType;
        if (where.militaryStatus) where.militaryStatus = where.militaryStatus;
        if (where.serviceLine) where.serviceLine = where.serviceLine;
        if (where.healthExpertSuggestion) where.healthExpertSuggestion = where.healthExpertSuggestion;
        if (where.diseaseBg) where.diseaseBg = where.diseaseBg;
        if (where.testResults) where.testResults = where.testResults;
        if (where.rightEyeVisualAcuity) where.rightEyeVisualAcuity = where.rightEyeVisualAcuity;
        if (where.leftEyeVisualAcuity) where.leftEyeVisualAcuity = where.leftEyeVisualAcuity;
        if (where.colorVision) where.colorVision = where.colorVision;
        if (where.visualField) where.visualField = where.visualField;
        if (where.depthVision) where.depthVision = where.depthVision;
        if (where.rightEarCondition) where.rightEarCondition = where.rightEarCondition;
        if (where.leftEarCondition) where.leftEarCondition = where.leftEarCondition;
        if (where.medicalAdvice) where.medicalAdvice = where.medicalAdvice;
      }

      console.log('where', where);
      const healthInfo = await Helper.paginate(
        base,
        value.page,
        {
          order: [[value.filter.order.by, value.filter.order.sort]],
          where,
          include: [
            {
              model: db.User,
            },
            {
              model: db.Harmfulfactors,
            },
            {
              model: db.OptometryAndAudiometry,
            },
            {
              model: db. TestsAndExaminations,
            },
            {
              model: db.spirometryDescription
            }
          ],
        },
        value.limit
      );

      console.log('healthInfo', healthInfo);
      return response.success(res, healthInfo, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = healthInfoController;
