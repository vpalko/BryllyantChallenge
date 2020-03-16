# SERVER

# database setup
```

DROP TABLE bryllyant.answers;
DROP TABLE bryllyant.questions;
DROP TABLE bryllyant.poll;
DROP TABLE bryllyant.userprofile;


CREATE TABLE bryllyant.userprofile(
   id             SERIAL PRIMARY KEY,
   email          VARCHAR(125) NOT NULL,
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

CREATE TABLE bryllyant.questions(
   id             SERIAL PRIMARY KEY,
   pollid         INTEGER NOT NULL REFERENCES bryllyant.poll (id),
   question       VARCHAR(500) NOT NULL
);

CREATE TABLE bryllyant.answers(
   id             SERIAL PRIMARY KEY,
   pollid         INTEGER NOT NULL REFERENCES bryllyant.poll (id),
   questionid     INTEGER NOT NULL REFERENCES bryllyant.questions (id),
   userid         INTEGER NOT NULL REFERENCES bryllyant.userprofile (id),
   answer         BOOLEAN NOT NULL
);
```
