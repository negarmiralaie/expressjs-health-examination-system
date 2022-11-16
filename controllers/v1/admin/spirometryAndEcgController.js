// ? //////////////////////////////// Some Qs Left ////////////////////////////////////////////////////
const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');

const base = db.SpirometryEcg;
const spirometryAndEcgController = {
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
              spiro: joi.string(),
              spirometryDescription: joi.string(),
              ecg: joi.string(),
              ecgDescription: joi.string(),
              medicineExpertSuggest: joi.string(),
              medicalAdvice: joi.array().items(joi.string()),
              description: joi.string(),
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

      console.log(222222222222)

      const { error, value } = Schema.validate(req.query, { abortEarly: true });
      if (error) {
        console.log('error', error)
        return response.validation(res, error);
      }

      let where = {};
      if (value.filter.where) {
        where = {
          ...value.filter.where,
        };
        if (where.spiro) where.spiro = where.spiro;
        if (where.spirometryDescription) where.spirometryDescription = where.spirometryDescription;
        if (where.ecg) where.ecg = where.ecg;
        if (where.ecgDescription) where.ecgDescription = where.ecgDescription;
        if (where.medicineExpertSuggest) where.medicineExpertSuggest = where.medicineExpertSuggest;
        if (where.medicalAdvice) where.medicalAdvice = where.medicalAdvice;
        if (where.description) where.description = where.description;
      }

      console.log('where', where);
      const spirometryAndEcg = await Helper.paginate(
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
      console.log('spirometryAndEcg', spirometryAndEcg);
      return response.success(res, spirometryAndEcg, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  create: async (req, res) => {
    try {
      const schema = joi.object().keys({ 
        // examiner_id: joi.number(),
        examined_id: joi.number(),
        spiro: joi.string(),
        spirometryDescription: joi.string(),
        ecg: joi.string(),
        ecgDescription: joi.string(),
        medicineExpertSuggest: joi.string(),
        medicalAdvice: joi.array().items(joi.string()),
        description: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      // const duplicate = await base.findAll({
      //   where: {
      //     [Op.and]: [
      //       {
      //         spiro: value.spiro,
      //       },
      //       {
      //         spirometryDescription: value.spirometryDescription,
      //       },
      //       {
      //         ecg: value.ecg,
      //       },
      //       {
      //         ecgDescription: value.ecgDescription,
      //       },
      //     ],
      //   },
      // });

      // if (duplicate.length > 0) {
      //   return response.customError(
      //     res,
      //     res.t('CRUD.Duplicated', {
      //       name: res.t('joi.hybrid.title_fileUrl'), //!!!!MUST BE FIXED AFTER UNIQUE FIELDS ARE FOUND!!!!!!!
      //     }),
      //     404
      //   );
      // }

      value.examiner_id = req.user.id;
      const spirometryAndEcg = await base.create(value);
      await db.User.increment({
        numberOfFilledForms : +1,
        numberOfExaminedPersonnels: +1,
      },
      { where: { id: value.examiner_id } });
      console.log('spirometryAndEcg', spirometryAndEcg)

      return response.success(res, spirometryAndEcg, res.t('CRUD.Create'));
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

      const spiroAndEcg = await base.findByPk(req.params.id);
      if (!spiroAndEcg) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('spiroAndEcg', { scope: 'joi.field.spiroAndEcg' }),
          }),
          404
        );
      }
      await spiroAndEcg.destroy();
      return response.success(res, spiroAndEcg, res.t('CRUD.Deleted'));
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

      const spiroAndEcg = await base.findByPk(value.id, {
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

      if (!spiroAndEcg) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('spiroAndEcg', { scope: 'joi.field.spiroAndEcg' }),
          }),
          404
        );
      }

      return response.success(res, spiroAndEcg, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  update: async (req, res) => {
    try {

      const schema = joi.object().keys({
        spiro: joi.string(),
        spirometryDescription: joi.string(),
        ecg: joi.string(),
        ecgDescription: joi.string(),
        medicineExpertSuggest: joi.string(),
        medicalAdvice: joi.array().items(joi.string()),
        description: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const id = req.params.id;

      let spiroAndEcg = await base.findOne({
        where: {
            [Op.or]: [
              {
                spiro: value.spiro,
              },
              // {
              //   spirometryDescription: value.spirometryDescription,
              // },
              // {
              //   ecg: value.ecg,
              // },
              // {
              //   ecgDescription: value.ecgDescription,
              // },
            ],
        },
      });

      if (spiroAndEcg) {
        return response.validation(
          res,
          res.t('User.Title_Or_Description_Already_Exist'),  //!FIX THIS AFTER YOU FOUND UNIQUE PARTS 
        );
      }
      
      spiroAndEcg = await base.findByPk(id);
      if (!spiroAndEcg) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('spiroAndEcg', { scope: 'joi.field.spiroAndEcg' }),
          }),
          404
        );
      }

      //save to db
      await spiroAndEcg.update(value);
      return response.success(res, spiroAndEcg, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = spirometryAndEcgController;