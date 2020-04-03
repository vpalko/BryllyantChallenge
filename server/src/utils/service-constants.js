module.exports = {
    NODE_ENV: "test",
    DB: "MONGO", // either "MONGO" or "POSTGRES"
    BAD_REQUEST: "BAD REQUEST",
    POSTGRES: {
        USER: "postgres",
        HOST: "host.docker.internal",
        DATABASE: "demo",
        PASSWORD: "123",
        PORT: 5432
    },
    MONGO: {
        USER: "mongoadmin",
        HOST: "mongo",
        DATABASE: "demo",
        PASSWORD: "123",
        PORT: 27017
    },
    AUTH: {
        APP_SECRET: "vpsecretkey",
        TOKEN_EXPIRES_IN: "600s"
    },
    USER: {
        EMAIL_ALREADY_EXISTS: "User with same email already exists",
        CREATED: "User successfully created",
        UPDATED: "User successfully updated",
        DELETED: "User successfully deleted",
        INVALID: "Invalid user",
        INVALID_CREDENTIALS: "Unable to login. Either email or password is incorrect",
        UNABLE_TO_FIND: "Unable to find user"
    },
    POLL: {
        CREATED: "Poll successfully created",
        UPDATED: "Poll successfully updated",
        DELETED: "Poll successfully deleted",
        INVALID: "Invalid poll id",
        INVALIDAUTHORID: "Invalid author id",
        UNABLE_TO_SEND_INVITATION: "Unable to send poll invitation",
        UNABLE_TO_FIND: "Unable to find poll"
    },
    POLL_REQUEST: {
        STATUS_UPDATED: "Status successfully updated",
    },
    QUESTION: {
        CREATED: "Question successfully created",
        UPDATED: "Question successfully updated",
        DELETED: "Question successfully deleted",
        INVALID: "Invalid question id",
        UNABLE_TO_FIND: "Unable to find user"
    },
    ANSWER: {
        SAVED: "User answers successfully saved",
        UNABLE_TO_SAVE: "Unable to save answers"
    }
  }
  