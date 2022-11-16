const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const base = db.Sugguestion;
const userKey =
'User' +
(process.env.USER_APP_KEY || 'authenticator.generateSecret()') +
'Lorem User real';
const adminKey =
'Admin' + (process.env.ADMIN_APP_KEY || 'secret') + 'Lorem Admin';
const suggestionsController = {
  // List Suggestion
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
              title: joi.string(),
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

      const suggestions = await Helper.paginate(
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
              model: db.Factory,
            },
          ],
        },
        value.limit
      );


      console.log('suggestions', suggestions);
      return response.success(res, suggestions, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  create: async (req, res) => {
    try {
      const schema = joi.object().keys({ 
        // factory_id: joi.number(),
        title: joi.string().required(),
        description: joi.string().required(),
      });

      const updatedSchema = schema.optional("user_id", "factory_id");
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);
      const token = req.headers.authentication;
      console.log('token', token)

      const decode = await jwt.verify(token, userKey);
      const id = decode.sub;
      const role = decode._type;

        const user_id = id;
        if (user_id) {
          let user = await db.User.findByPk(user_id);
          value.user_id = user_id;
          value.factory_id = user.factory_id;


          if (!user) {
            return response.customError(
              res,
              res.t('CRUD.Not_Found', { name: res.t('joi.field.user') }),
              404
            );
          }
        }

      const duplicate = await base.findAll({
        where: {
          [Op.or]: [
            {
              title: value.title,
            },
            {
              description: value.description,
            },
          ],
        },
      });

      if (duplicate.length > 0) {
        return response.customError(
          res,
          res.t('CRUD.Duplicated', {
            name: res.t('joi.hybrid.title_description'),
          }),
          404
        );
      }

      const suggestion = await base.create(value);
      return response.success(res, suggestion, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //Delete Suggestion
  delete: async (req, res) => {
    try {
      const schema = joi.object().keys({
        id: joi.string,
      });
      const { error, value } = schema.validate(req.password, {
        abortEarly: true,
      });
      if (error)return response.validation(res, error);

      const suggestion = await base.findByPk(req.params.id);
      if (!suggestion) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('suggestion', { scope: 'joi.field.suggestion' }),
          }),
          404
        );
      }
      await suggestion.destroy();
      return response.success(res, suggestion, res.t('CRUD.Deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Get a Suggestion information
  get: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        id: joi.number().required(),
      });
  
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });
      if (error) return response.validation(res, error);

      const suggestion = await base.findByPk(value.id, {
        include: [
          {
            model: db.User,
          },
          {
            model: db.Factory,
          },
        ],
      });
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // if (suggestion !== null && suggestion.factory_id) {
      //   suggestion.factory_id = await base.findByPk(suggestion.factory_id);
      // }

      if (!suggestion) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('suggestion', { scope: 'joi.field.suggestion' }),
          }),
          404
        );
      }

      return response.success(res, suggestion, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // Update Suggestion
  update: async (req, res) => {
    try {

      const schema = joi.object().keys({
        title: joi.string(),
        description: joi.string()
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      let suggestion = await base.findOne({
        where: {
          [Op.and]: {
            [Op.not]: {
              id: req.params.id,
            },
            [Op.or]: [
              {
                title: value.title,
              },
              {
                description: value.description,
              },
            ],
          },
        },
      });

      if (suggestion) {
        return response.validation(
          res,
          res.t('User.Title_Or_Description_Already_Exist'),
          // 'username'
        );
      }
      
      suggestion = await base.findByPk(req.params.id);
      if (!suggestion) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', {
            name: res.t('suggestion', { scope: 'joi.field' }),
          }),
          404
        );
      }

      //save to db
      await suggestion.update(value);
      return response.success(res, suggestion, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = suggestionsController;
