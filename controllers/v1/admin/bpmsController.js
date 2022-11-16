const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { StatusList } = require('../../../components/enums');
const { Helper } = require('../../../components/helper');
const rbac = require('../../../components/auth/rbac');
const { Op } = require('sequelize');

const base = db.Bpms;
const statusController = {
  getByTitle: async (req, res) => {
    try {
      const Schema = joi.object().keys({
        //@ts-ignore
        title: joi.string().required(),
      });
      const { error, value } = Schema.validate(req.params, {
        abortEarly: true,
      });
      if (error) {
        return response.validation(res, error);
      }
      const bpms = await base.findOne({
        where: {
          title: value.title,
        },
      });
      if (!bpms) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.bpms') }),
          404
        );
      }

      const extractBpms = await Helper.extractBpms(bpms);

      return response.success(res, extractBpms, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  getMyBpms: async (req, res) => {
    try {
      let auther = await rbac();
      let rawRoles = await auther
        .GetEnforcer()
        .getImplicitRolesForUser(req.user.id + '');

      const bpms = await base.findOne({
        where: {
          title: rawRoles[rawRoles.length - 1],
        },
      });

      if (!bpms) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.bpms') }),
          404
        );
      }

      const extractBpms = await Helper.extractBpms(bpms);

      return response.success(res, extractBpms, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  getFields: async (req, res) => {
    try {
      const jsonFields = require('../../../components/lang/messages/fa.json');
      return response.success(res, jsonFields.BPMS, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  update: async (req, res) => {
    try {
      const schema = joi.object().keys({
        title: joi.string().required(),
        showOnOrderList: joi.array().items(joi.number()),
        details: joi.array().items(joi.number()),
        changeStatusFrom: joi.array().items(joi.number()),
        changeStatusTo: joi.array().items(joi.number()),
        edit: joi.object(),
      });
      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) {
        return response.validation(res, error);
      }

      // TODO: conditions for value

      const bpmss = await base.findAll({});

      const bpms = await base.findOne({
        where: {
          title: value.title,
        },
      });
      if (!bpms) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.bpms') }),
          404
        );
      }

      await bpms.update(value);

      return response.success(res, bpms, res.t('CRUD.Update'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
};

module.exports = statusController;
