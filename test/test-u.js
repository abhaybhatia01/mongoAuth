const jwt = require('jsonwebtoken');
const Session = require("../models/Session");
const secret = process.env.SECRET || "not-a-good-secret-key";
const assert = require('assert');
const sinon = require('sinon');

const { authenticate } = require('../middlewares');
const {
  generateToken,
  refreshToken,
  verifyEmail,
  VerifyPassword,
} = require('../helpers');


describe("Unit testing",() => {
  describe('authenticate middleware', () => {
    let req, res, next  ;
    let code = 0
    let data ={}
    beforeEach(() => {
      req = {
        headers: {},
      };
      res = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.responseData = data;
        },
      };
      next = sinon.spy();
    });
  
    afterEach(() => {
      req = null;
      res = null;
      next = null;
    });
  
    it('should return 401 if no token is provided', async () => {
      await authenticate(req, res, next);
  
      assert.strictEqual(res.statusCode, 401);
      assert.deepStrictEqual(res.responseData, { message: 'No token provided' });
      assert.strictEqual(next.called, false);
    });
  
    it('should return 401 if token is invalid', async () => {
      req.headers.authorization = 'invalid-token';
  
      await authenticate(req, res, next);
  
      assert.strictEqual(res.statusCode, 401);
      assert.deepStrictEqual(res.responseData, { message: 'Invalid token' });
      assert.strictEqual(next.called, false);
    });
  
    it('should return 401 if token is expired', async () => {
      req.headers.authorization = 'valid-token';
      jwt.verify = function() {
        return true;
      };
      Session.findOne = async function() {
        return null;
      };
  
      await authenticate(req, res, next);
  
      assert.strictEqual(res.statusCode, 401);
      assert.deepStrictEqual(res.responseData, { message: 'Token expired, please login again' });
      assert.strictEqual(next.called, false);
    });
  
    it('should set sessionData in req and call next if token is valid', async () => {
      req.headers.authorization = 'valid-token';
      jwt.verify = function() {
        return true;
      };
      Session.findOne = async function() {
        return { token: 'valid-token' };
      };
  
      await authenticate(req, res, next);
  
      assert.deepStrictEqual(req.sessionData, { token: 'valid-token' });
      assert.strictEqual(next.called, true);
      assert.strictEqual(res.statusCode, undefined);
      assert.strictEqual(res.responseData, undefined);
    });
  
  });


  describe("Helper functions",()=>{
      
    describe('generateToken', () => {
      it('should generate a token with valid payload', () => {
        const payload = { userId: 123 };
        const token = generateToken(payload);
        assert.strictEqual(typeof token, 'string');
      });
    });

    describe('refreshToken', function() {
      const secret = 'secret-key';
      const oldToken = jwt.sign({ userId: 'user123' }, secret, { expiresIn: '1h' });
    
      it('should return an object with isValid=false if no token is provided', async function() {
        const result = await refreshToken();
        assert.strictEqual(result.isValid, false);
      });
  

      it('should return an object with isValid=true and a new token if the token is valid', async function() {
        const result = await refreshToken(oldToken);
        assert.strictEqual(result.isValid, true);
        assert.ok(result.token);
      });

      it('should return an object with a message indicating that a new token was generated', async function() {
        const result = await refreshToken(oldToken);
        assert.strictEqual(result.message, 'new token generated');
      });
    });

    describe('verifyEmail', () => {
      it('should return isValid true if email is valid', () => {
        const email = 'test@example.com';
        const result = verifyEmail(email);
        assert.strictEqual(result.isValid, true);
      });

      it('should return isValid false and message "email missing" if email is not provided', () => {
        const result = verifyEmail();
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.message, 'email missing');
      });

      it('should return isValid false and message "Invalid email" if email is invalid', () => {
        const email = 'invalid-email';
        const result = verifyEmail(email);
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.message, 'Invalid email');
      });
    });

    describe('VerifyPassword', () => {
      it('should return isValid true if password is valid', () => {
        const password = 'Abcdefg1';
        const result = VerifyPassword(password);
        assert.strictEqual(result.isValid, true);
      });

      it('should return isValid false and message "password missing" if password is not provided', () => {
        const result = VerifyPassword();
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.message, 'password missing');
      });

      it('should return isValid false and message "Password should have a minimum length of 8 characters" if password length is less than 8', () => {
        const password = 'Abc1';
        const result = VerifyPassword(password);
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.message, 'Password should have a minimum length of 8 characters');
      });

      it('should return isValid false and message "Password should contain at least one uppercase letter, one lowercase letter, and one digit" if password is not strong enough', () => {
        const password = 'abcdefgh';
        const result = VerifyPassword(password);
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.message, 'Password should contain at least one uppercase letter, one lowercase letter, and one digit');
      });
    });

  })
})