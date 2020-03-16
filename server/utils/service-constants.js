module.exports = {
    NODE_ENV: "test",
    BAD_REQUEST: "BAD REQUEST",
    POSTGRES: {
        USER: "postgres",
        HOST: "127.0.0.1",
        DATABASE: "demo",
        PASSWORD: "123",
        PORT: 5432,
    },
    AUTH: {
        APP_SECRET: "vpsecretkey",
        TOKEN_EXPIRES_IN: "600s"
    },
    USER: {
        ALREADY_EXISTS: "User already exists",
        CREATED: "User successfully created",
        UPDATED: "User successfully updated",
        INVALID: "Invalid user",
        INVALID_CREDENTIALS: "Unable to login. Either email or password is incorrect"
    },
    POLL: {
        CREATED: "Poll successfully created",
        INVALID: "Invalid poll id",
        INVALIDAUTHORID: "Invalid author id"
    }
  }
  