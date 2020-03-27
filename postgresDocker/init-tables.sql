\connect demo;
DROP TABLE IF EXISTS bryllyant.answers;
DROP TABLE IF EXISTS bryllyant.pollrequestsstatus;
DROP TABLE IF EXISTS bryllyant.pollrequests;
DROP TABLE IF EXISTS bryllyant.questions;
DROP TABLE IF EXISTS bryllyant.poll;
DROP TABLE IF EXISTS bryllyant.userprofile;


CREATE TABLE bryllyant.userprofile(
   id             SERIAL PRIMARY KEY,
   email          VARCHAR(125),
   pwd            TEXT NOT NULL,
   phone          VARCHAR(10) NOT NULL,
   firstname      VARCHAR(125) NOT NULL,
   lastname       VARCHAR(125) NOT NULL,
   isadmin        BOOLEAN NOT NULL DEFAULT false,
   UNIQUE(email)
);

INSERT INTO bryllyant.userprofile (email, phone, firstname, lastname, isadmin, pwd) VALUES ('admin@example.com', '9195551234', 'Admin', 'Bryllyant', true, '$2b$10$FLOIG06GwRC91ftk2EZRi.hSCSfFaLEI08.Ohi2YQBjhsAiXfgVWC');
INSERT INTO bryllyant.userprofile (email, phone, firstname, lastname, isadmin, pwd) VALUES ('john@example.com', '2155551234', 'John', 'Smith', false, '$2b$10$FLOIG06GwRC91ftk2EZRi.hSCSfFaLEI08.Ohi2YQBjhsAiXfgVWC');

CREATE TABLE bryllyant.poll(
   id             SERIAL PRIMARY KEY,
   name           VARCHAR(225) NOT NULL,
   description    TEXT,
   authorid       INTEGER NOT NULL REFERENCES bryllyant.userprofile (id)
);

INSERT INTO bryllyant.poll (name, description, authorid) VALUES ('poll one', 'test poll one', 1);
INSERT INTO bryllyant.poll (name, description, authorid) VALUES ('poll two', 'test poll two', 1);

CREATE TABLE bryllyant.pollrequests(
   id             SERIAL PRIMARY KEY,
   pollid         INTEGER NOT NULL REFERENCES bryllyant.poll (id),
   sentby         INTEGER NOT NULL REFERENCES bryllyant.userprofile (id),
   senton         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bryllyant.pollrequestsstatus(
   id             INTEGER NOT NULL REFERENCES bryllyant.pollrequests (id),
   userid         INTEGER NOT NULL REFERENCES bryllyant.userprofile (id),
   status         INTEGER NOT NULL DEFAULT 0,
   updatedon      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY    (id, userid)
);

CREATE TABLE bryllyant.questions(
   id             SERIAL PRIMARY KEY,
   pollid         INTEGER NOT NULL REFERENCES bryllyant.poll (id),
   question       VARCHAR(500) NOT NULL
);

INSERT INTO bryllyant.questions (pollid, question) VALUES (1, 'question one');
INSERT INTO bryllyant.questions (pollid, question) VALUES (1, 'question two');
INSERT INTO bryllyant.questions (pollid, question) VALUES (2, 'Are you OK?');

CREATE TABLE bryllyant.answers(
   pollid         INTEGER NOT NULL REFERENCES bryllyant.poll (id),
   requestid      INTEGER NOT NULL REFERENCES bryllyant.pollrequests (id),
   questionid     INTEGER NOT NULL REFERENCES bryllyant.questions (id),
   userid         INTEGER NOT NULL REFERENCES bryllyant.userprofile (id),
   answer         BOOLEAN NOT NULL,
   PRIMARY KEY    (pollid, requestid, userid, questionid)
);