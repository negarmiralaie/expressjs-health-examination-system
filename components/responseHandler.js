// ? //////////////////////////////// I do not know, I guess Completed.. ////////////////////////////////////////////////////
const _ = require('lodash');

class ResponseHandler {
  static customError(res, message, code, data, root = false) {
    if (root) {
      return res.status(code).json({
        message,
        ...data,
      });
    } else {
      return res.status(code).json({
        message,
        data,
      });
    }
  }

  static success(res, data, message) {
    return res.status(200).json({
      message,
      data,
    });
  }

  static validation(res, errors, field = 'all') {
    //todo add fieldname in
    if (_.isString(errors)) {
      return res.status(400).json({
        field,
        message: errors,
      });
    }
    let e = errors.details[0] || errors;
    if (e.type && e.context) {
      // console.log(e);
      let name =
        e.type.includes('array') || typeof e.context.key != 'string'
          ? e.context.label
          : e.context.key;
      name =
        e.path.length > 2 && typeof e.path[e.path.length - 1] == 'string'
          ? e.path[e.path.length - 1]
          : name;
      return res.status(400).json({
        message: res.t(e.type, {
          scope: 'joi',
          name: res.t(name, { scope: 'joi.field' }),
          valids: e.context.valids,
          limit: e.context.limit,
        }),
        code: e.code,
        field: e.path.toString(),
      });
    } else {
      return res.status(400).json({
        message: e.message,
        code: e.code,
        field: e.path.toString(),
      });
    }

    // return res.status(400).json(data.map((e) => {
    //     if (e.type && e.context) {
    //         // console.log(e);
    //         let name = e.type.includes("array") ? e.context.label : e.context.key
    //         name = e.path.length > 2 ? e.path[e.path.length - 2] : name
    //         return {
    //             message: res.t(e.type, { scope: "joi", name: res.t(name, { scope: "joi.field" }), valids: e.context.valids, limit: e.context.limit }),
    //             code: e.code,
    //             field: e.path.toString()
    //         }
    //     }
    //     return {
    //         message: e.message,
    //         code: e.code,
    //         field: e.path.toString()
    //     }
    // }))
  }

  static catchError(res, err) {
    console.log('********************************');
    console.log(err);
    console.log('********************************');

    ResponseHandler.customError(
      res,
      res.t('Internall', { scope: 'Server' }),
      500,
      { err }
    );
    throw err;
  }
}

module.exports = ResponseHandler;
