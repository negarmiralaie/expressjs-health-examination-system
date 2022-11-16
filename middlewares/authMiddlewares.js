const AuthHandler = require('../components/auth/handler');
const { StatusList } = require('../components/enums');
const response = require('../components/responseHandler');

const authMiddleware = {
  user: async (req, res, next) => {
    // 'user' is used to create token and token is stored in headers...
    if (
      req.headers &&
      req.headers.authentication
    ) {
      try {
        const { user } = await AuthHandler.UserVerify( //Verifies the token stored in headers, gets back user which is used to create token
          req.headers.authentication
        );

        console.log('user', user)

        // If user is not active.....
        if (user.status != StatusList[0]) {
          return response.customError(
            res,
            res.t(user.status, { scope: 'auth' }),
            403
          );
        }

        // Now store user data in req
        req.user = user;
        console.log('req.user', req.user)
        next();
      } catch (error) {
        req.user = undefined;
        console.log('djsfworwrw')
        return response.customError(res, res.t('401', { scope: 'auth' }), 401);
      }
    } else {
      req.user = undefined;
      console.log('djsaaeeeeee')
      return response.customError(res, res.t('401', { scope: 'auth' }), 401);
    }
  },
};

module.exports = authMiddleware;
