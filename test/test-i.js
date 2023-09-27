const assert = require("assert");
const request = require("supertest");
const app = require("../index");


describe("Integration testing",() => {
    let token; // To store the session token for authenticated requests
    const email = "test" + Math.floor(Math.random() * 1000) + "@example.com"; // random email generated
    describe("Authentication System", () => {

        // Test user registration
        describe("User Registration", async () => {
            it("Should give error for not having email while creating user",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    password: 'Pwd123',
                    name: 'Test User'
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'email missing');
                token = response.body.token;
            })
            it("Should give error for not having valid email format",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    email: "test@example",
                    password: 'Pwd123',
                    name: 'Test User'
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'Invalid email');
                token = response.body.token;
            })
            it("should give error for not having password while creating user",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    email: email,
                    name: 'Test User'
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'password missing');
                token = response.body.token;
            })
            it("should give error for password less than 8 charactor",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    email: email,
                    password: 'Pwd123',
                    name: 'Test User'
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'Password should have a minimum length of 8 characters');
                token = response.body.token;
            })
            it("pwd should contain at least one uppercase letter, one lowercase letter, and one digit.",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    email: email,
                    password: 'dskfllwd123',
                    name: 'Test User'
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'Password should contain at least one uppercase letter, one lowercase letter, and one digit');
                token = response.body.token;
            })
            it("should register a new user", async function () {
                const response = await request(app)
                    .post("/user/register")
                    .send({
                        email: email,
                        password: "Password123",
                        name: "Test User",
                    });
                assert.strictEqual(response.status, 200);
                assert.strictEqual(typeof response.body.token, "string");
                token = response.body.token;
            });
            it("should not create duplicate user",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    email: email,
                    password: 'Password123',
                    name: 'Test User'
                })
                assert.strictEqual(response.status, 409);
                assert.strictEqual(response.body.message, 'User already exists');
                token = response.body.token;
            })
        
        
        });

        // Test user login
        describe('User Login', () => {
            it("Should give error for not having email while logging in user",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    password: 'Pwd123',
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'email missing');
                token = response.body.token;
            })
            it("Should give error for not having valid email format",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    email: "test@example",
                    password: 'Pwd123',
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'Invalid email');
                token = response.body.token;
            })
            it("should give error for not having password while logging in user",async function(){
                const response = await request(app)
                .post('/user/register')
                .send({
                    email: email,
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'password missing');
                token = response.body.token;
            })
            it("should give error for password less than 8 charactor",async function(){
                const response = await request(app)
                .post('/user/login')
                .send({
                    email: email,
                    password: 'Pwd123',
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'Password should have a minimum length of 8 characters');
                token = response.body.token;
            })
            it("pwd should contain at least one uppercase letter, one lowercase letter, and one digit",async function(){
                const response = await request(app)
                .post('/user/login')
                .send({
                    email: email,
                    password: 'dskfllwd123',
                })
                assert.strictEqual(response.status, 400);
                assert.strictEqual(response.body.message, 'Password should contain at least one uppercase letter, one lowercase letter, and one digit');
                token = response.body.token;
            })
            it("should not login for wrong password",async function(){
                const response = await request(app)
                .post('/user/login')
                .send({
                    email: email,
                    password: 'PassWord123',
                })
                assert.strictEqual(response.status, 401);
                assert.strictEqual(response.body.message, 'Invalid credentials');
                token = response.body.token;
            })
            it("should login user for correct email and password", async function () {
                const response = await request(app)
                    .post("/user/login")
                    .send({
                        email: email,
                        password: "Password123",
                    });
                assert.strictEqual( response.body.message, "Logged in");
                assert.strictEqual(response.status, 200);
                assert.strictEqual(typeof response.body.token, "string");
                token = response.body.token;
            });
            it("user should be able to login in multiple times", async function () {
                const response = await request(app)
                    .post("/user/login")
                    .send({
                        email: email,
                        password: "Password123",
                    });
                assert.strictEqual( response.body.message, "Logged in");
                assert.strictEqual(response.status, 200);
                assert.strictEqual(typeof response.body.token, "string");
                token = response.body.token;
            });
        });

        // Test session management
        describe('Session Management', () => {
            it('should refresh token', async () => {
                const response = await request(app)
                    .post('/user/token-refresh')
                    .send({
                        oldToken: token
                    });
                    assert.strictEqual(response.body.message, 'Token refreshed');
                assert.strictEqual(response.status, 200);
                token = response.body.token;
            });


            it('should be able to access /secret with token', async () => {
                const response = await request(app)
                    .get('/user/secret')
                    .set('Authorization', token);
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.body.route, '/secret');
            });

            it('should log out user and delete session', async () => {
                const response = await request(app)
                .post('/user/logout')
                .set('Authorization', token);
        
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.body.message, 'Logout successful');
            });

            it('should handle session expiration', async () => {
                const response = await request(app)
                    .get('/user/secret')
                    .set('Authorization', token);

                assert.strictEqual(response.status, 401);
                assert.strictEqual(response.body.message, 'Token expired, please login again');
            });
        });

    });


})