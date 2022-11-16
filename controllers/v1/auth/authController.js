// const async = require('hbs/lib/async');
const joi = require('joi');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const db = require('../../../db/models');
const { StatusList } = require('../../../components/enums');
const { exRedis } = require('../../../components/redis');
const { Helper } = require('../../../components/helper');
const response = require('../../../components/responseHandler');
const { AuthHandler, rbac } = require('../../../components/auth');
const { t } = require('localizify');

const roleController = require('../admin/roleController');

const authController = {
  login: async (req, res) => {
    try {
      const schema = joi.object().keys({
        username: joi.string().alphanum().required(),
        password: joi.string().required(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      console.log('abc');
      const person = await db.User.findOne({ where: { username: value.username } });
      console.log('def');
      console.log('person', person)
      let role;
      let loggedInPerson;

      if (!person) {
        return response.validation(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.user') })
        );
      }
      
      role = 'user'; //This user means that his is not a factory but might be an admin or a user
      loggedInPerson = person;
      // if (loggedInPerson.status != StatusList[0]) { //If loggedInPerson was not active
      //   console.log('not active');
      //   return response.customError(
      //     res,
      //     res.t(person.status, { scope: 'auth' }),
      //     403
      //   );
      // };

      const isOk = await Helper.Compare(value.password, loggedInPerson.password);
      if (!isOk) return response.validation(res, res.t('auth.Wrong_User_Pass'));

      // if ((loggedInPerson.role === 'user' || loggedInPerson.role === 'admin') && loggedInPerson.expirationDate <= Date.now()) { //If loggedInPerson was not active
      //   console.log('not active');
      //   return response.customError(
      //     res,
      //     res.t('اکانت شما منقضی شده است. لطفا با پشتیبانی تماس بگیرید'),
      //     403
      //   );
      // };

      // Creates a token for an admin(meaning it's key will be the key used for admins).
      //~ LETS DISCUSS WHAT HAPPENS BELOW... FIRST AN ACCESS TOKEN WILL BE CREATED(USING USER TYPE AND USER ID), ALSO LASTLOGINAT WILL BE STORED AT USER -> THEN A REFRESH TOKEN WILL BE STORED IN REDIS .....
      //~ Notice that refreshToken is stored at redis 
      const { accessToken, refreshToken } = await AuthHandler.TokenGen(loggedInPerson, type = loggedInPerson.role);

      const auther = await rbac();

      //????????????????????????????? Now you should store token somewhere
      if (req.limiter) { //? Rate limiting.....
        req.limiter.delete(req.body.username);
        req.limiter.delete(req.ip);
      }

      //FIXME i have no idea
      loggedInPerson.lastIp = req.ip;
      await loggedInPerson.save();

      // Now get user permissions
      const permissions = await roleController._formatPermissions(
        await auther.GetEnforcer().getImplicitPermissionsForUser(loggedInPerson.id + '-user'),
        res.t
      );

      console.log('permissions', permissions);
      // Now get user roles
      const roles = await auther.GetEnforcer().getImplicitRolesForUser(loggedInPerson.id + '-user')
      console.log('roles', roles);
      res.setHeader('Authentication', accessToken);
      
      console.log('loggedInPerson', loggedInPerson);
      return response.success(res, {
        loggedInPerson,
        accessToken,
        refreshToken,
        permissions,
        roles,
      });
    } catch (err) {
      console.log(err);
      return response.customError(res, res.t('Server.Internall'), 500, err);
    }
  },

  logout: async (req, res) => {
    try{
      res.removeHeader('authentication');
    } catch (error) {
      return response.customError(res, res.t('Server.Internall'), 500, err);
    }
  }
};

module.exports = authController;
// THIS LINE IS ADDED ON SATURDAY 5TH OF NOVEMBER.....