DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS team_member CASCADE;
DROP TABLE IF EXISTS member_of CASCADE;
DROP TABLE IF EXISTS manages CASCADE;
DROP TABLE IF EXISTS goal CASCADE;
DROP TABLE IF EXISTS comment CASCADE;

CREATE TABLE team
(
    team_id      serial PRIMARY KEY,
    team_name    VARCHAR(30) UNIQUE NOT NULL UNIQUE,
    evening_time TIME               NOT NULL DEFAULT '15:00',
    time_zone    VARCHAR(50)        NOT NULL DEFAULT 'America/New_York',
    date_created date               NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE team_member
(
    member_id       serial PRIMARY KEY,
    first_name      VARCHAR(255) NOT NULL,
    last_name       VARCHAR(255) NOT NULL,
    user_name       VARCHAR(30),
    avatar          bytea,
    time_zone       VARCHAR(50)  NOT NULL DEFAULT 'America/New_York',
    email           text         NOT NULL UNIQUE,
    member_password text         NOT NULL, -- pgcrypto
    morning_time    TIME         NOT NULL DEFAULT '08:00',
    evening_time    TIME         NOT NULL DEFAULT '15:00',
    active          bool         NOT NULL DEFAULT TRUE,
    verified        bool         NOT NULL DEFAULT FALSE
);

CREATE TABLE member_of
(
    member_id  int4 REFERENCES team_member (member_id),
    team_id    int4 REFERENCES team (team_id) ON DELETE CASCADE,
    approved   bool NOT NULL DEFAULT FALSE,
    date_left  date,
    date_added date,
    PRIMARY KEY (member_id, team_id)
);

CREATE TABLE manages
(
    member_id int4 REFERENCES team_member (member_id),
    team_id   int4 REFERENCES team (team_id) ON DELETE CASCADE,
    PRIMARY KEY (member_id, team_id)
);

CREATE TABLE goal
(
    goal_id          serial PRIMARY KEY,
    member_id        int4        NOT NULL REFERENCES team_member (member_id),
    team_id          int4        NOT NULL REFERENCES team (team_id) ON DELETE CASCADE,
    task_name        VARCHAR(50) NOT NULL,
    task_description text        NOT NULL,
    date_time        timestamptz NOT NULL,
    status           bool        NOT NULL DEFAULT FALSE
);


CREATE TABLE comment
(
    comment_id   serial PRIMARY KEY,
    member_id    int4        NOT NULL REFERENCES team_member (member_id),
    id_user_page int4 REFERENCES team_member (member_id),
    team_id      int4        NOT NULL REFERENCES team (team_id) ON DELETE CASCADE,
    goal_id      int4 REFERENCES goal (goal_id) ON DELETE CASCADE,
    team_page    bool        NOT NULL,
    date_time    timestamptz NOT NULL,
    message      text        NOT NULL
--     PRIMARY KEY (comment_id, member_id, team_id, goal_id)
);

---------------------
-- CREATE COMMANDS --
---------------------

-- user creates first profile
INSERT INTO team_member (first_name, last_name, email, member_password)
VALUES ('Alex', 'Dohm', 'alexdohm11@gmail.com', crypt('goalsfortoday10', gen_salt('bf')));

-- user creates team
INSERT INTO team (team_name, date_created)
VALUES ('Team Red', '2020-07-09');
INSERT INTO member_of (member_id, team_id, approved, date_added) --this is the admin
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), true, '2020-07-09');
INSERT INTO manages (member_id, team_id)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'));

-- user creates goal
INSERT INTO goal (member_id, team_id, task_name, task_description, date_time)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 'Type', 'Finish Typing', '2020-07-09 19:10:25');

-- user creates comment
INSERT INTO comment (member_id, team_id, goal_id, team_page, date_time, message)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 1, false, '2020-07-09 20:10:25', 'Today is the day!');

-- user requests to join team
INSERT INTO member_of (member_id, team_id, date_added)
VALUES ((SELECT member_id from team_member WHERE email = 'leohaller@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), '2020-07-09');

-- admin invites user / adds user to group
INSERT INTO member_of (member_id, team_id, approved, date_added)
VALUES ((SELECT member_id from team_member WHERE email = 'leohaller@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), true, '2020-07-09');

-- admin changes member role from member to admin
INSERT INTO manages (member_id, team_id)
VALUES (3, 1);

-- user creates comment on team page
INSERT INTO comment (member_id, team_id, team_page, date_time, message)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), true, '2020-07-09 20:10:25', 'Today is the day!');

-- user creates comment on user page
INSERT INTO comment (member_id, team_id, id_user_page, team_page, date_time, message)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 1, false, '2020-07-09 20:10:25', 'Today is the day!');
---------------------
-- UPDATE COMMANDS --
---------------------

-- admin accepts user into team [checked]
UPDATE member_of
SET approved = true
WHERE member_id = 2
  AND team_id = 1;

-- user update username [ NEED : username, user id] [checked]
UPDATE team_member
SET user_name = 'user123'
WHERE member_id = 1;

-- user update time zone [NEED : time zone, member_id] [checked]
UPDATE team_member
SET time_zone = 'America/Los_Angeles'
WHERE member_id = 1;

-- user update avatar [NEED: avatar in bytea format, member_id]
-- https://www.postgresql.org/docs/7.4/jdbc-binary-data.html
-- UPDATE team_member
-- SET avatar = binarystream,
-- WHERE member_id = 1;

-- user update morning time for emails [NEED : time, member_id] [checked]
UPDATE team_member
SET morning_time = '07:30'
WHERE member_id = 1;

-- user update evening time for emails [NEED: time, member_id] [checked]
UPDATE team_member
SET evening_time = '15:30'
WHERE member_id = 1;

-- user clicks on link in verification email [need member_id] [checked]
UPDATE team_member
SET verified = true
WHERE member_id = 2;

-- user edits goal [ need updated name & description ]
UPDATE goal
SET task_name        = 'task 2',
    task_description = 'Do something'
WHERE goal_id = 1;

-- check goal complete
UPDATE goal
SET status = true
WHERE goal_id = 1;

-- admin approves member request for team
UPDATE member_of
SET approved = true
WHERE member_id = 3
  AND team_id = 1;

-- admin sets afternoon email time
UPDATE team
SET evening_time = '17:00'
WHERE team_id = 1;

-- admin sets team time zone
UPDATE team
SET time_zone = 'America/Los_Angeles'
WHERE team_id = 1;

-- admin removes user from group
UPDATE member_of
SET date_left = '2020-07-10'
WHERE member_id = 1
  AND team_id = 1;

---------------------
-- DELETE COMMANDS --
---------------------

---------
-- user deletes personal account [ member_id, team_id, date ] --
---------
-- query that shows teams for which there are greater than 1 members, and the
-- user is the sole admin for. if a result is returned, then user cant delete
-- their account until they take care of the teams for which they are an admin for and other members are a part of
SELECT n1.team_name
FROM (SELECT t.team_name, count(*) AS totalRows
      FROM team AS t
               INNER JOIN member_of AS mo ON mo.team_id = t.team_id
      WHERE mo.approved = true
      GROUP BY t.team_name
      HAVING count(*) > 1) AS n1
         INNER JOIN (SELECT q1.team_name
                     FROM (SELECT t.team_name, count(*) AS totalRows
                           FROM team AS t
                                    INNER JOIN manages m ON m.team_id = t.team_id
                           GROUP BY t.team_name
                           HAVING count(*) = 1) AS q1
                              INNER JOIN (SELECT t.team_name
                                          FROM team AS t
                                                   INNER JOIN manages m ON m.team_id = t.team_id
                                          WHERE member_id = 3) AS q2
                                         ON (q2.team_name = q1.team_name)) AS n2
                    ON n1.team_name = n2.team_name;
UPDATE team_member
SET active = false
WHERE member_id = 1;
UPDATE member_of
SET date_left = '2020-07-09'
WHERE member_id = 1
  AND team_id = 1;

-- teams that only have one admin, which user is admin for [ NOT NEEDED FOR CODE, PART OF ABOVE ]
SELECT q1.team_name
FROM (SELECT t.team_name, count(*) AS totalRows
      FROM team AS t
               INNER JOIN manages m ON m.team_id = t.team_id
      GROUP BY t.team_name
      HAVING count(*) = 1) AS q1
         INNER JOIN (SELECT t.team_name
                     FROM team AS t
                              INNER JOIN manages m ON m.team_id = t.team_id
                     WHERE member_id = 1) AS q2
                    ON (q2.team_name = q1.team_name);

-- user cancels request to join team
DELETE
FROM member_of
WHERE member_id = 1 && team_id = 1;

-- delete goal
DELETE
FROM goal
WHERE goal_id = 1;

-- existing admin changes member role from admin to member
-- 1. check that there are more than 1 admins in the team
SELECT count(*)
FROM manages
WHERE team_id = 1;

-- 2. change role
DELETE
FROM manages
WHERE member_id = 1
  AND team_id = 1;

-- admin deletes team
DELETE
FROM team
WHERE team_id = 1;

-------------------
-- READ COMMANDS --
-------------------
SELECT member_id, email
FROM team_member
WHERE member_password = crypt('goalsfortoday10', member_password)
  AND email = 'alexdohm11@gmail.com';

SELECT *
FROM team_member;
------- Settings Page -------
-- current username, time zone, avatar, morning email, evening email [ need user email ]
SELECT member_id, time_zone, avatar, morning_time, evening_time
FROM team_member
WHERE email = 'alexdohm11@gmail.com';

-- list of all teams user is a part of [ need user email or id ]
SELECT t.team_id, t.team_name
FROM team as t
         INNER JOIN member_of AS mo ON mo.team_id = t.team_id
         INNER JOIN team_member as tm on tm.member_id = mo.member_id
WHERE tm.email = 'alexdohm11@gmail.com'
  AND mo.approved = TRUE
  AND mo.date_left IS NULL;

-- list of all teams in the database
SELECT team_id, team_name
from team
ORDER BY team_name ASC;

-- list of teams that user has requested to join [ need user email]
SELECT t.team_id, t.team_name
FROM team as t
         INNER JOIN member_of AS mo ON mo.team_id = t.team_id
         INNER JOIN team_member as tm on tm.member_id = mo.member_id
WHERE mo.approved = false
  AND tm.email = 'leohaller@gmail.com';


------- Side Page -------
-- members in team [ need team name or team id ]
SELECT tm.member_id, tm.first_name, tm.last_name, tm.user_name
FROM team_member AS tm
         INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
         INNER JOIN team AS t ON t.team_id = mo.team_id
WHERE t.team_name = 'Team Red';

-- bool whether member is admin of team [ need team name, user email ]
SELECT EXISTS(SELECT 1
              FROM manages
              WHERE member_id = (SELECT member_id FROM team_member WHERE email = 'alexdohm11@gmail.com')
                AND team_id = (SELECT team_id FROM team WHERE team_name = 'Team Red'));

------- Home Page -------
--list of goals for user [ need member_id, team_id and date]
SELECT goal_id, task_name, task_description
FROM goal
WHERE DATE(date_time) = '2020-07-09'
  AND member_id = 1
  AND team_id = 1;

-- list of comments for specific goal [ goal_id ]
SELECT c.comment_id, c.date_time::time, c.message, tm.first_name, tm.last_name, tm.avatar
FROM team_member AS tm
         INNER JOIN goal AS g ON g.member_id = tm.member_id
         INNER JOIN comment as c on c.comment_id = g.member_id
WHERE g.goal_id = 1;

-- list of comments for user for the day [day, member_id, team_id]
SELECT c.comment_id, c.date_time::time, c.message, tm.first_name, tm.last_name, tm.avatar
FROM team_member AS tm
         INNER JOIN comment as c on c.member_id = tm.member_id
WHERE c.goal_id IS NULL
  AND DATE(c.date_time) = '2020-07-09'
  AND c.member_id = 1
  AND c.team_id = 1
  AND c.team_page = false;

-- first day data started (if we want to style the calendar at all)
SELECT date_created
FROM team
WHERE team_id = 1;


------- Admin Page -------
-- list of existing members in team and their status
SELECT tm.member_id, tm.first_name, tm.last_name
FROM team_member AS tm
         INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
         INNER JOIN team AS t ON t.team_id = mo.team_id
WHERE t.team_name = 'Team Red';

-- bool value, whether member is an admin or not of the team
SELECT EXISTS(SELECT 1
              FROM team_member AS tm
                       INNER JOIN manages AS m ON m.member_id = tm.member_id
              WHERE m.member_id = 1
                AND m.team_id = 1);

-- get time zone and afternoon email time for team
SELECT time_zone, evening_time
FROM team
WHERE team_id = 1;

-- see if email exists in database when admin invites user
SELECT EXISTS(SELECT 1 FROM team_member WHERE email = 'alexdohm11@gmail.com');

------- Stats Page -------

-- number of finished goals per user in a given team [ need team and date ]
SELECT u1.first_name, u1.last_name, u2.totalGoals, u2.finishedGoals
FROM (SELECT tm.member_id, tm.first_name, tm.last_name, tm.user_name
      FROM team_member AS tm
               INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
      WHERE mo.team_id = 1
        AND approved = true
        AND (date_left IS NULL OR date_left > '2020-07-09')) AS u1
         LEFT OUTER JOIN (SELECT member_id,
                                 count(*)                                       as totalGoals,
                                 sum(case when status = true then 1 else 0 end) as finishedGoals
                          FROM goal
                          WHERE team_id = 1
                            AND DATE(date_time) = '2020-07-09'
                          GROUP BY member_id) as u2
                         ON u1.member_id = u2.member_id;

-- number of completed and uncompleted goals for team over given time period
SELECT DATE(date_time)                                as goalDate,
       count(*)                                       as totalGoals,
       sum(case when status = true then 1 else 0 end) as finishedGoals
FROM goal
WHERE team_id = 1
  AND DATE(date_time) >= '2020-05-09'
  AND DATE(date_time) < '2020-10-10'
GROUP BY member_id, DATE(date_time);

-- lists users on team who finished their goals at certain date
SELECT u1.first_name, u1.last_name, u1.date_left, u2.goalDate, u2.totalGoals, u2.finishedGoals
FROM (SELECT tm.member_id, tm.first_name, tm.last_name, tm.user_name, mo.date_left
      FROM team_member AS tm
               INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
      WHERE mo.team_id = 1
        AND approved = true
        AND (date_left IS NULL OR date_left >= '2020-05-09')) AS u1
         LEFT OUTER JOIN (SELECT member_id,
                                 DATE(date_time)                                as goalDate,
                                 count(*)                                       as totalGoals,
                                 sum(case when status = true then 1 else 0 end) as finishedGoals
                          FROM goal
                          WHERE team_id = 1
                            AND DATE(date_time) >= '2020-05-09'
                            AND DATE(date_time) < '2020-10-10'
                          GROUP BY member_id, DATE(date_time)) as u2
                         ON u1.member_id = u2.member_id;

SELECT DATE(date_time)                                as goalDate,
       count(*)                                       as totalGoals,
       sum(case when status = true then 1 else 0 end) as finishedGoals
FROM goal
WHERE team_id = 1
  AND DATE(date_time) >= '2020-05-09'
  AND DATE(date_time) < '2020-10-10'
GROUP BY member_id, DATE(date_time);


-- list of comments for team for the day
SELECT c.comment_id, c.date_time::time, c.message, tm.first_name, tm.last_name, tm.avatar
FROM team_member AS tm
         INNER JOIN comment as c on c.member_id = tm.member_id
WHERE c.goal_id IS NULL
  AND DATE(c.date_time) = '2020-07-09'
  AND c.team_id = 1
  AND c.team_page = true;

-- get team information for daily emails
SELECT first_name, last_name, email, morning_time, evening_time
FROM team_member
WHERE active = true;

-- get general comments for a user
SELECT c.comment_id, c.date_time, c.message, tm.first_name, tm.last_name, tm.avatar
FROM team_member AS tm
         INNER JOIN comment as c on c.member_id = tm.member_id
WHERE c.goal_id IS NULL
  AND c.team_id = 1
  AND c.id_user_page = 1;

SELECT * from comment;