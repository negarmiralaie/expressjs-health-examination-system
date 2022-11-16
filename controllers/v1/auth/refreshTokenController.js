const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { StatusList } = require('../enums');
const db = require('../../db/models');
const { exRedis } = require('../redis');
const { number } = require('joi');

class refreshTokenHandler {
  static redis = new exRedis(
    'refreshToken',
    process.env.REFRESH_TOKEN_EXPIRE_AFTER
  );
  static userKey =
    'User RefreshToken' +
    (process.env.USER_APP_KEY || 'authenticator.generateSecret()') +
    'Lorem User real';
  static driverKey =
    'Driver RefreshToken' +
    (process.env.ADMIN_APP_KEY || 'secret') +
    'Lorem Driver';

  static async RefreshTokenVerification(token) {
    try {
      let decodedToken = jwt.decode(token);
      let refreshToken = await refreshTokenHandler.redis.Get(
        decodedToken._type + '/' + decodedToken.sub
      );

      if (token === refreshToken) {
        return { id: decodedToken.sub, type: decodedToken._type };
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  static async GenerateRefreshToken(user, type = 'user') {
    let token = jwt.sign({ _type: type }, this.driverKey, {
      subject: user.id + '',
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRE_AFTER),
    });
    let ok = await refreshTokenHandler.redis.Replace(
      type + '/' + user.id,
      token
    );
    return token;
  }
}

module.exports = refreshTokenHandler;
