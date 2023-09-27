## Getting Started

> This app contains API secrets and passwords that have been hidden deliberately, so the app cannot be run with its features on your local machine. However, feel free to clone this repository if necessary.

### Clone or download this repository

```sh
git clone [https://github.com/abhaybhatia01/AllCamp.git](https://github.com/abhaybhatia01/mongoAuth.git)
```

### Install dependencies

```sh
npm install
```

### start the server 

```sh
npm run start
```
![image](https://github.com/abhaybhatia01/mongoAuth/assets/85993083/4d6f37a0-0d34-4b97-9bd1-aae61610a42c)


API Documentation:

1. Register User:
   - Endpoint: POST /register
   - Description: Creates a new user account.
   - Request Body:
     - email: string (required) - User's email address.
     - password: string (required) - User's password.
     - name: string (optional) - User's name.
   - Response:
     - 200 OK: User registration successful. Returns the session token.
     - 400 Bad Request: Invalid input values. Returns an error message.
     - 409 Conflict: User already exists. Returns an error message.
     - 500 Internal Server Error: An unexpected error occurred.

2. Log In User:
   - Endpoint: POST /login
   - Description: Authenticates a user and creates a session.
   - Request Body:
     - email: string (required) - User's email address.
     - password: string (required) - User's password.
   - Response:
     - 200 OK: User login successful. Returns the session token.
     - 400 Bad Request: Invalid input values. Returns an error message.
     - 401 Unauthorized: Invalid credentials. Returns an error message.
     - 500 Internal Server Error: An unexpected error occurred.

3. Token Refresh:
   - Endpoint: POST /token-refresh
   - Description: Refreshes an expired session token.
   - Request Body:
     - oldToken: string (required) - Expired session token.
   - Response:
     - 200 OK: Token refreshed successfully. Returns the new session token.
     - 401 Unauthorized: No refresh token provided or invalid refresh token. Returns an error message.
     - 500 Internal Server Error: An unexpected error occurred.

4. Log Out User:
   - Endpoint: POST /logout
   - Description: Logs out a user by deleting the session.
   - Request Headers:
     - Authorization: string (required) - Session token.
   - Response:
     - 200 OK: Logout successful. Returns a success message.
     - 500 Internal Server Error: An unexpected error occurred.

5. Protected Route:
   - Endpoint: GET /secret
   - Description: Accesses a protected route that requires authentication.
   - Request Headers:
     - Authorization: string (required) - Session token.
   - Response:
     - 200 OK: Access granted. Returns a success message and user email.
     - 401 Unauthorized: Invalid or expired session token. Returns an error message.
     - 500 Internal Server Error: An unexpected error occurred.

Authentication Flow:
1. Register a new user by sending a POST request to /register with the required information (email and password). If successful, you will receive a session token.
2. Log in with an existing user by sending a POST request to /login with the email and password. If successful, you will receive a session token.
3. To access protected routes, include the session token in the Authorization header of the request.
4. To refresh an expired session token, send a POST request to /token-refresh with the oldToken (expired session token). If successful, you will receive a new session token.
5. To log out, send a POST request to /logout with the session token in the Authorization header. You will receive a success message.
6. Access the protected route /secret by sending a GET request with the session token in the Authorization header. If successful, you will receive a success message and user email.

Note: Make sure to handle errors and error responses appropriately in your application.

![image](https://github.com/abhaybhatia01/mongoAuth/assets/85993083/89b80fdd-d08f-430a-a198-25558b05fcf3)

![image](https://github.com/abhaybhatia01/mongoAuth/assets/85993083/fdcd3566-6b4f-4580-b535-5beb791a5c90)


The tests validate the following aspects mentioned in the API documentation: 
 
1. User Registration: 
   - Test cases check for missing email, invalid email format, missing password, password length, and password complexity requirements. 
   - The test case for registering a new user verifies the successful registration and the response containing the session token. 
   - The test case for duplicate user registration checks for the expected response status code and error message. 
 
2. User Login: 
   - Test cases check for missing email, invalid email format, missing password, password length, and password complexity requirements. 
   - The test case for successful user login verifies the response status code, success message, and the presence of the session token. 
   - The test case for incorrect password checks for the expected response status code and error message. 
   - The test case for multiple logins with the same credentials validates that the user can log in multiple times. 
 
3. Session Management: 
   - The test case for token refresh verifies the successful token refresh and the response containing the new token. 
   - The test case for accessing the protected route with a valid token validates the expected response status code and the route information. 
   - The test case for logging out checks for the successful logout and the response message. 
   - The test case for session expiration validates the expected response status code and error message when trying to access the protected route with an expired token. 
 
Overall, the tests provide good coverage of the API endpoints and their expected behavior based on the API documentation.
