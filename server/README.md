# SERVER

# database setup
1. Create 'demo' table
2. Create 'bryllyant' schema in 'demo' table
3. Run script below to create/recreate tables
```

DROP TABLE IF EXISTS bryllyant.answers;
DROP TABLE IF EXISTS bryllyant.pollrequests;
DROP TABLE IF EXISTS bryllyant.questions;
DROP TABLE IF EXISTS bryllyant.poll;
DROP TABLE IF EXISTS bryllyant.userprofile;


CREATE TABLE bryllyant.userprofile(
   id             CHAR(36) NOT NULL,
   email          VARCHAR(125) PRIMARY KEY,
   pwd            TEXT NOT NULL,
   phone          VARCHAR(10) NOT NULL,
   firstname      VARCHAR(125) NOT NULL,
   lastname       VARCHAR(125) NOT NULL,
   isadmin        BOOLEAN NOT NULL DEFAULT false,
   UNIQUE(id)
);

INSERT INTO bryllyant.userprofile (id, email, phone, firstname, lastname, isadmin, pwd) VALUES ('xxxxxxxx-yyyy-zzzz-wwww-abcdefghijkl', 'admin@example.com', '9195551234', 'Admin', 'Bryllyant', true, '$2b$10$FLOIG06GwRC91ftk2EZRi.hSCSfFaLEI08.Ohi2YQBjhsAiXfgVWC');
INSERT INTO bryllyant.userprofile (id, email, phone, firstname, lastname, isadmin, pwd) VALUES ('xxxxxxxx-yyyy-zzzz-wwww-zyxwvutsrqpo', 'john@example.com', '2155551234', 'John', 'Smith', false, '$2b$10$FLOIG06GwRC91ftk2EZRi.hSCSfFaLEI08.Ohi2YQBjhsAiXfgVWC');

CREATE TABLE bryllyant.poll(
   id             SERIAL PRIMARY KEY,
   name           VARCHAR(225) NOT NULL,
   description    TEXT,
   authorid       CHAR(36) NOT NULL REFERENCES bryllyant.userprofile (id)
);

CREATE TABLE bryllyant.pollrequests(
   pollid         INTEGER NOT NULL REFERENCES bryllyant.poll (id),
   requestid      CHAR(36) NOT NULL,
   requestorid    CHAR(36) NOT NULL REFERENCES bryllyant.userprofile (id),
   userid         CHAR(36) NOT NULL REFERENCES bryllyant.userprofile (id),
   status         INTEGER NOT NULL,
   PRIMARY KEY    (pollid, requestid, userid)
);

CREATE TABLE bryllyant.questions(
   id             SERIAL PRIMARY KEY,
   pollid         INTEGER NOT NULL REFERENCES bryllyant.poll (id),
   question       VARCHAR(500) NOT NULL
);

CREATE TABLE bryllyant.answers(
   id             SERIAL PRIMARY KEY,
   pollid         INTEGER NOT NULL REFERENCES bryllyant.poll (id),
   questionid     INTEGER NOT NULL REFERENCES bryllyant.questions (id),
   userid         CHAR(36) NOT NULL REFERENCES bryllyant.userprofile (id),
   answer         BOOLEAN NOT NULL
);
```
