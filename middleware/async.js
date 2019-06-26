
// asyncMiddleware function takes route handler as param, returns standard express route handler
// try catch - try calls the route handler that was passed as param
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    }
    catch(ex) {
      next(ex);
    }
  }  
}