// var assert = require('assert');
// describe('Array', function () {
//   describe('#indexOf()', function () {
//     it('should return -1 when the value is not present', function () {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });




const assert = require('assert');
const request = require('supertest');
const app = require('../index');

describe('Authentication System', () => {
  let token; // To store the session token for authenticated requests

  // Test user registration
  describe('User Registration', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/user/register')
        .send({
          email: 'test@example.com',
          password: 'Password123',
          name: 'Test User'
        });

        assert.strictEqual(response.status, 200);
        assert.strictEqual(typeof response.body, 'string');
        token = response.body.token;

    //   assert.strictEqual(response.body.token, "your_generated_token");
    });
  });

  // Test user login
  describe('User Login', () => {
    it('should log in a registered user', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      assert.strictEqual(response.status, 200);

      // Store the token for subsequent authenticated requests
      token = response.body.token;
    });
  });

  // Test user logout
  describe('User Logout', () => {
    it('should log out a user', async () => {
      const response = await request(app)
        .post('/user/logout')
        .set('Authorization', token);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.message, 'Logout successful');
    });
  });

  // Test session management
  describe('Session Management', () => {
    it('should handle session expiration', async () => {
      const response = await request(app)
        .get('/user/secret')
        .set('Authorization', token);

      assert.strictEqual(response.status, 401);
      assert.strictEqual(response.body.message, 'Session expired. Please log in again');
    });
  });

  // Test error scenarios
  describe('Error Scenarios', () => {
    it('should handle invalid credentials', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'incorrect_password'
        });

      assert.strictEqual(response.status, 401);
      assert.strictEqual(response.body.message, 'Invalid credentials');
    });
  });
});