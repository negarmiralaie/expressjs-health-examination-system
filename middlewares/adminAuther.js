const { rbac, AuthHandler } = require('../components/auth');
const { admin } = require('./authMiddlewares');

module.exports = (act, obj) => {
  return async (req, res, next) => {
    try {
      let auther = await rbac();
      let user = req.user;
      if (!user) { //If user was not already stored in req(meaning previous middleware was not called) -> do exactly like what we did in previous middleware to check token and store user in req
        const header = req.headers;
        if ( req.headers && req.headers.authentication ){
          console.log('zzzzzzzzzzzzz')
          const a = ( await AuthHandler.UserVerify(req.headers.authentication) );
          console.log('a', a)
          user = a.user
          console.log('user', user)
        }
      }
console.log(7777)
      if (!user) {
        console.log('Do not have enough permissions')
        return res.sendStatus(401);
      }

      act = act == null ? verbs[req.method] : act; // The operation that the user wants to perform
      obj = obj || req.path.split('/')[1]; //The resurce that the user wants to access
      console.log('act', act)
      console.log('obj', obj)
      // I guess this one checks to see if user is permitted to do his desired operations
      let hasPermission = await auther.GetEnforcer().enforce(user.role, obj, act);
      console.log({ user, obj, act, hasPermission });

      if (hasPermission) {
        req.user = user;
        console.log(5555)
        next();
        console.log(444)
        return;
      }
      return res.sendStatus(403);
    } catch (error) {
      console.log(1211111111111111114)
      return res.sendStatus(401);
    }
  };
};

let verbs = {
  GET: 'read',
  POST: 'create',
  PUT: 'update',
  DELETE: 'delete',
};
