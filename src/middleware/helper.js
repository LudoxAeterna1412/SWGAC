class Handler {
  constructor() {
    this.asyncHandler = this.asyncHandler.bind(this);
  }

  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
  
}

module.exports = Handler;