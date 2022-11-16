const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { Helper } = require('../../../components/helper');
const { t } = require('localizify');
const { Op } = require('sequelize');
const Sequelize = require('sequelize')
const { StatusList } = require('../../../components/enums');
const uploadFileController = require('./fileUploadController')

const base = db.Settings;
const settingsController = {
  // list: async (req, res) => { //^ Gets list of factories
  //   try {
  //     const Schema = joi.object().keys({
  //       page: joi.number(),
  //       limit: joi.number(),
  //       filter: joi
  //         .object()
  //         .keys({
  //           where: joi
  //           .object()
  //           .keys({
  //             abbrvCode: joi.string(),
  //             name: joi.string(),
  //             mobile: joi.string(),
  //             status: joi.string(),
  //           })
  //           .default({}),
  //           order: joi
  //             .object()
  //             .keys({
  //               by: joi.string().default('createdAt'),
  //               sort: joi.string().only().allow('asc', 'desc').default('desc'),
  //             })
  //             .default({ by: 'createdAt', sort: 'desc' }),
  //         })
  //         .default({ order: { by: 'createdAt', sort: 'desc' } }),
  //     });

  //     const { error, value } = Schema.validate(req.query, { abortEarly: true });
  //     if (error) return response.validation(res, error);

  //     let where = {};
  //     if (value.filter.where) {
  //       where = {
  //         ...value.filter.where,
  //       };
  //       if (where.abbrvCode) where.abbrvCode = where.abbrvCode;
  //       if (where.name) where.name = where.name;
  //       if (where.mobile) where.mobile = where.mobile;
  //       if (where.status) where.status = where.status;
  //     }

  //     const factories = await Helper.paginate(
  //       base,
  //       value.page,
  //       {
  //         order: [[value.filter.order.by, value.filter.order.sort]],
  //         where,
  //       },
  //       value.limit
  //     );

  //     return response.success(res, factories, res.t('CRUD.Success'));
  //   } catch (error) {
  //     return response.catchError(res, error);
  //   }
  // },

  create: async (req, res) => {
    try {
      const schema = joi.object().keys({ 
        factoryName: joi.string(),
        panelUsername: joi.string(),
        panelPassword: joi.string(),
        message: joi.string(),
      });

      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) return response.validation(res, error);

      const files = req.files;
      console.log('files', files)
      // if (files) {
      //   const filesArray = await uploadFileController.multipleFileUpload(files);
      //   // Now store these files in case db
      //   for (const file of filesArray) {
      //     console.log('file', file)
      //     // const caseFile = await caseBase.create({
      //       // factory_id,
      //       // title: file.fileName,
      //       // fileUrl: process.env.SERVER_ADDR + file.filePath,
      //     // });
      //   }
      // }

      // Bc of our upload middleware, now we have access to req.files
      // const files = req.files;
      // console.log('files', files)
      // if (files) {
      //   const filesArray = await uploadFileController.multipleFileUpload(files);
      //   // console.log('filesArray', filesArray);
      //   // value.logoUrl = process.env.SERVER_ADDR + filesArray[0].filePath;
      //   // console.log('filesArray[0]', filesArray[0])
      //   // value.loginPhotoUrl = process.env.SERVER_ADDR + filesArray[1].filePath;
      // }

      const existingSetting = await base.findAll();
      console.log('existingSetting', existingSetting)
      let setting;
      if (existingSetting.length > 0) {
        await existingSetting[0].update(value);
      } else {
        setting = await base.create(value);
      }

      return response.success(res, setting, res.t('CRUD.Create'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },
  get: async (req, res) => {
    try {
      const setting = await base.findAll();

      if (!setting) {
        return response.customError(
          res,
          res.t('CRUD.Not_Found', { name: res.t('joi.field.setting') }),
          404
        );
      }

      return response.success(res, setting, res.t('CRUD.Success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // update: async (req, res) => {
  //   try {
  //     const schema = joi.object().keys({
  //       factoryName: joi.string(),
  //       panelUsername: joi.string(),
  //       panelPassword: joi.string(),
  //       message: joi.string(),
  //     });
  //     const { error, value } = schema.validate(req.body, { abortEarly: true });
  //     if (error) return response.validation(res, error);



  //     const setting = await base.findAll();
  //     console.log('setting', setting)
  //     if (setting.length > 0) {
  //       await setting[0].update(value);
  //     } else {
  //       setting = await base.create(value);
  //     }



  //     if (setting.length <= 0) {
  //       return response.customError(
  //         res,
  //         res.t('CRUD.Not_Found', { name: res.t('joi.field.setting') }),
  //         404
  //       );
  //     }

  //     const files = req.files;
  //     if (files) {
  //       const filesArray = await uploadFileController.multipleFileUpload(files);
  //       value.logoUrl = process.env.SERVER_ADDR + filesArray[0].path;
  //       value.loginPhotoUrl = process.env.SERVER_ADDR + filesArray[1].path;
  //     }
  //     await setting[0].update(value);
  //     // await setting[0].update(value);

  //     return response.success(res, setting, res.t('CRUD.Update'));
  //   } catch (error) {
  //     return response.catchError(res, error);
  //   }
  // },

  // delete: async (req, res) => {
  //   try {
  //     const schema = joi.object().keys({
  //       id: joi.string,
  //     });
  //     const { error, value } = schema.validate(req.password, {
  //       abortEarly: true,
  //     });
  //     if (error)return response.validation(res, error);

  //     const factory = await base.findByPk(req.params.id);
  //     if (!factory) {
  //       return response.customError(
  //         res,
  //         res.t('CRUD.Not_Found', {
  //           name: res.t('factory', { scope: 'joi.field.factory' }),
  //         }),
  //         404
  //       );
  //     }
  //     const result = await db.Case.destroy({where: { factory_id: factory.id }})
  //     // await factory.removeCases(factory.id);
  //     await factory.destroy();
  //     return response.success(res, factory, res.t('CRUD.Deleted'));
  //   } catch (error) {
  //     return response.catchError(res, error);
  //   }
  // },

  // get: async (req, res) => {
  //   try {
  //     const Schema = joi.object().keys({
  //       id: joi.number().required(),
  //     });
  
  //     const { error, value } = Schema.validate(req.params, {
  //       abortEarly: true,
  //     });

  //     if (error) return response.validation(res, error);

  //     const factories = await base.findByPk(value.id, {});

  //     if (!factories) {
  //       return response.customError(
  //         res,
  //         res.t('CRUD.Not_Found', {
  //           name: res.t('factory', { scope: 'joi.field.factory' }),
  //         }),
  //         404
  //       );
  //     }

  //     return response.success(res, factories, res.t('CRUD.Success'));
  //   } catch (error) {
  //     return response.catchError(res, error);
  //   }
  // },

  // update: async (req, res) => {
  //   try {
  //     // let auther = await rbac();
  //     // let rawRoles = await auther.GetEnforcer().getAllSubjects();

  //     const schema = joi.object().keys({
  //       abbrvCode: joi.string(),
  //       name: joi.string(),
  //       mobile: joi.string(),
  //       status: joi.string(),
  //       username: joi.string(),
  //       password: joi.string(),
  //     });

  //     const { error, value } = schema.validate(req.body, { abortEarly: true });
  //     if (error) return response.validation(res, error);

  //     const { id } = req.params;
  //     let factory = await base.findByPk(id);

  //     console.log('factory', factory)

  //     if (factory) {
  //       return response.validation(
  //         res,
  //         res.t('User.Username_Or_Email_Already_Exist'),
  //         'username'
  //       );
  //     }

  //     // const file = req.file;

  //     // if (file) {
  //     //   value.path = file.path
  //     //     .split('public')[1]
  //     //     .replace('\\', '/')
  //     //     .replace('\\', '/');
  //     //   value.photoUrl = process.env.SERVER_ADDR + value.path;
  //     // }

  //     factory = await base.findByPk(req.params.id);
  //     if (!factory) {
  //       return response.customError(
  //         res,
  //         res.t('CRUD.Not_Found', {
  //           name: res.t('factory', { scope: 'joi.field' }),
  //         }),
  //         404
  //       );
  //     }

  //     // if (value.role && factory.role != value.role) {
  //     //   console.log({ role: factory.role });
  //     //   await auther.GetEnforcer().deleteRoleForUser(user.id + '', user.role);
  //     //   const add = await auther
  //     //     .GetEnforcer()
  //     //     .addRoleForUser(user.id + '', value.role);
  //     //   console.log({ add });
  //     // }

  //     if (value.password) {
  //       value.password = await Helper.Hash(value.password);
  //     }

  //     //save to db
  //     await factory.update(value);
  //     return response.success(res, factory, res.t('CRUD.Update'));
  //   } catch (error) {
  //     return response.catchError(res, error);
  //   }
  // },
};

module.exports = settingsController;






// const joi = require('joi');
// const db = require('../../../db/models');
// const response = require('../../../components/responseHandler');
// const { Helper } = require('../../../components/helper');
// const { redis } = require('../../../components/redis');

// const base = db.Settings;
// const settingsController = {


//   create: async (req, res) => {
//     try {
//       console.log(333333333333)
//       const schema = joi.object().keys({ 
//         factoryName: joi.string(),
//         // logoUrl: joi.string(),
//         // loginPhotoUrl: joi.string(),
//         // username: joi.string(),
//         // password: joi.string(),
//       });
//       const {factoryName} = req.body;
//       console.log('factoryName', factoryName)
//       // const schema = joi.object().keys({
//       //   factoryName: joi.string(),
//       //   logoUrl: joi.string(),
//       //   loginPhotoUrl: joi.string(),
//       //   panelUsername: joi.string(),
//       //   panelPassword: joi.string(),
//       //   message: joi.string(),
//       // });

//       const { error, value } = schema.validate(req.body, { abortEarly: true });
//       if (error) return response.validation(res, error);
//       console.log('value.factoryName', value.factoryName);
//       console.log('req.body.factoryName', req.body.factoryName)
      // const logoUrl = req.logoUrl;
      // if (logoUrl) {
      //   const logoUrlInfo = await uploadFileController.singleFileUpload(logoUrl);
      //   value.logoUrl =  process.env.SERVER_ADDR + logoUrlInfo.filePath;
      // }

      // const loginPhotoUrl = req.loginPhotoUrl;
      // console.log('loginPhotoUrl', loginPhotoUrl)
      // if (loginPhotoUrl) {
      //   const loginPhotoUrlInfo = await uploadFileController.singleFileUpload(loginPhotoUrl);
      //   value.loginPhotoUrl =  process.env.SERVER_ADDR + loginPhotoUrlInfo.filePath;
      // }

      // const logoUrl = req.files.logoUrl[0];
      // if (logoUrl) {
      //   const logoUrlInfo = await uploadFileController.singleFileUpload(logoUrl);
      //   value.logoUrl =  process.env.SERVER_ADDR + logoUrlInfo.filePath;
      // }

//       // let setting = await base.create(value);

//       //Create redis version
//       // let redisSettings = await redis.Get('TebkarSettings');
//       // redisSettings[setting.name] = setting.content;
//       // await redis.Set('TebkarSettings', redisSettings);

//       // return response.success(res, setting, res.t('CRUD.Create'));
//     } catch (error) {
//       return response.catchError(res, error);
//     }
//   },
// };

// module.exports = settingsController;


