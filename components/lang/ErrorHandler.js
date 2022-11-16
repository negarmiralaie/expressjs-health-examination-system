const { Model } = require('sequelize/types');

module.exports = function messages(errors) {
  if (!errors) {
    return;
  }
  if (!_.isArray(errors)) {
    return;
  }
  if (errors.length < 1) {
    return;
  }

  for (let error of errors) {
    switch (error.type) {
      case 'any.required':
        error.message = `${error.context.label} اجباری است`;
        break;
      case 'number.base':
        error.message = `${error.context.label} باید عدد باشد`;
        break;
      case 'string.email':
        error.message = `${error.context.label} نا معتبر است`;
        break;
      case 'string.alphanum':
        error.message = `${error.context.label} باید حروف اینگلیسی باشد`;
        break;
      case 'any.empty':
        error.message = `${error.context.label} نمی تواند خالی باشد`;
        break;
      case 'any.allowOnly':
        error.message = `${error.context.label} باید یکی از مقادیر ${_.join(
          error.context.valids,
          ', '
        )} باشد`;
        break;
      case 'date.base':
        error.message = `${error.context.label} نا معتبر است`;
        break;
      case 'number.min':
        error.message = `${error.context.label} نمی تواند کمتر از ${error.context.limit} باشد`;
        break;
      case 'number.max':
        error.message = `${error.context.label} نمی تواند بیشتر از ${error.context.limit} باشد`;
        break;
      case 'any.only':
        error.message = `${error.context.label} فقط میتواند از مجوعه ${error.context.valid} باشد`;
        break;
      case 'override':
        error.message = `${error.context}`;
        break;
      case 'date.min':
        error.message = `تاریخ پایان باید بزرگتر مساوی ${error.context.limit} باشد`;
        break;
      case 'date.max':
        error.message = `تاریخ پایان باید حداکثر برار با ${error.context.limit} باشد`;
        break;
      case 'string.regex.base':
        error.message = ` ${error.context.label} وارد شده نا معتبر است `;
        break;
    }
  }

  return errors;
};
