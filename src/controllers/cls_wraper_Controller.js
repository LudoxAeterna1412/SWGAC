//controlador general, funciona como empaquetado
class Controller {
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static wrapMethods(instance) {
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
    for (const name of propertyNames) {
      if (typeof instance[name] === 'function' && name !== 'constructor') {
        instance[name] = Controller.asyncHandler(instance[name]);
      }
    }
  }

  constructor() {
    Controller.wrapMethods(this);
  }
}

module.exports = Controller;