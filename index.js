const errorHelpers = require('node-errors-helpers');

const createErrorClass = errorHelpers.createErrorClass;

const clear = name => name.replace(/\W/g, '');

const types = {
  object: (obj, name, params = {}, baseClass = Error) => {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      const ErrorClass = createErrorClass(
        `${clear(name)}Incorrect`,
        `${name} param has incorrect type. Should be object`,
        baseClass
      );
      throw new ErrorClass(obj);
    }
  },

  notEmpty: (obj, name, params = {}, baseClass = Error) => {
    if (!obj) {
      const ErrorClass = createErrorClass(
        `${clear(name)}Missing`,
        `${name} param is missing. Please provide this param.`,
        baseClass
      );
      throw new ErrorClass(obj);
    }
  },

  string: (obj, name, params = {}, baseClass = Error) => {
    if (Object.prototype.toString.call(obj) !== '[object String]') {
      const ErrorClass = createErrorClass(
        `${clear(name)}Incorrect`,
        `${name} param has incorrect type. Should be string`,
        baseClass
      );
      throw new ErrorClass(obj);
    }

    if (params.minLength) {
      if (obj.length <= params.minLength) {
        const ErrorClass = createErrorClass(
          `${clear(name)}Incorrect`,
          `${name} param should have minimal length = ${params.minLength}.`,
          baseClass
        );
        throw new ErrorClass(obj);
      }
    }

    if (params.length) {
      if (obj.length !== params.length) {
        const ErrorClass = createErrorClass(
          `${clear(name)}Incorrect`,
          `${name} param should have length = ${params.length}.`,
          baseClass
        );
        throw new ErrorClass(obj);
      }
    }
  },

  default: () => {},
}

const validate = (validateRules, baseError = Error) => {
  validateRules.forEach(rule => {
    const validators = rule.validators || [];

    if (rule.custom) {
      custom(rule.param, rule.name, {}, baseError);
      return;
    }

    validators.forEach(validator => {
      const v = types[validator.type] || types.default;
      v(rule.param, rule.name, validator, baseError);
    });
  });
};

module.exports = validate;
