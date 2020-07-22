-------------------------------------------
-- Data to populate Database for testing --
-------------------------------------------
INSERT INTO team_member (first_name, last_name, email, member_password)
VALUES ('Alex', 'Dohm', 'alexdohm11@gmail.com', crypt('goalsfortoday10', gen_salt('bf')));
UPDATE team_member
SET verified = true
WHERE member_id = (SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com');

INSERT INTO team (team_name, date_created)
VALUES ('Team Red', '2020-07-09');
INSERT INTO member_of (member_id, team_id, approved, date_added) --this is the admin
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), true, '2020-07-09');
INSERT INTO manages (member_id, team_id)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'));

INSERT INTO team (team_name, date_created)
VALUES ('Team Blue', '2020-07-09');
INSERT INTO member_of (member_id, team_id, approved, date_added) --this is the admin
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Blue'), true, '2020-07-09');
INSERT INTO manages (member_id, team_id)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Blue'));

INSERT INTO team_member (first_name, last_name, email, member_password)
VALUES ('Leo', 'Haller', 'leohaller@gmail.com', crypt('password123', gen_salt('bf')));
UPDATE team_member
SET verified = true
WHERE member_id = (SELECT member_id from team_member WHERE email = 'leohaller@gmail.com');

INSERT INTO team_member (first_name, last_name, email, member_password)
VALUES ('Brian', 'Walker', 'bwalker@gmail.com', crypt('woof12345', gen_salt('bf')));
UPDATE team_member
SET verified = true
WHERE member_id = (SELECT member_id from team_member WHERE email = 'bwalker@gmail.com');

INSERT INTO team_member (first_name, last_name, email, member_password)
VALUES ('John', 'Smith', 'jsmith@gmail.com', crypt('password', gen_salt('bf')));
UPDATE team_member
SET verified = true
WHERE member_id = (SELECT member_id from team_member WHERE email = 'bwalker@gmail.com');

INSERT INTO member_of (member_id, team_id, date_added)
VALUES ((SELECT member_id from team_member WHERE email = 'leohaller@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), '2020-07-09');
INSERT INTO member_of (member_id, team_id, date_added)
VALUES ((SELECT member_id from team_member WHERE email = 'bwalker@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), '2020-07-09');
INSERT INTO member_of (member_id, team_id, date_added)
VALUES ((SELECT member_id from team_member WHERE email = 'jsmith@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), '2020-07-09');

INSERT INTO team (team_name, date_created)
VALUES ('Team Orange', '2020-07-09');
INSERT INTO member_of (member_id, team_id, approved, date_added) --this is the admin
VALUES ((SELECT member_id from team_member WHERE email = 'bwalker@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Orange'), true, '2020-07-09');
INSERT INTO manages (member_id, team_id)
VALUES ((SELECT member_id from team_member WHERE email = 'bwalker@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Orange'));

INSERT INTO member_of (member_id, team_id, date_added)
VALUES ((SELECT member_id from team_member WHERE email = 'leohaller@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Orange'), '2020-07-09');


UPDATE member_of
SET approved = true
WHERE member_id = 2
  AND team_id = 1;
UPDATE member_of
SET approved = true
WHERE member_id = 3
  AND team_id = 1;
UPDATE member_of
SET approved = true
WHERE member_id = 4
  AND team_id = 1;
UPDATE member_of
SET approved = true
WHERE member_id = 2
  AND team_id = 3;

--goal and comment
INSERT INTO goal (member_id, team_id, task_name, task_description, date_time)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 'Type', 'Finish Typing', '2020-07-09 19:10:25');
INSERT INTO comment (member_id, team_id, goal_id, team_page, date_time, message)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 1, false, '2020-07-09 20:10:25',
        'Some other comment');
UPDATE goal
SET status = true
WHERE goal_id = 1;
INSERT INTO comment (member_id, team_id, id_user_page, team_page, date_time, message)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 1, false, '2020-07-09 20:10:25', 'Here is a general comment');


INSERT INTO comment (member_id, team_id, team_page, date_time, message)
VALUES ((SELECT member_id from team_member WHERE email = 'leohaller@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), true, '2020-07-09 20:10:25', 'A comment from leo');
INSERT INTO comment (member_id, team_id, team_page, date_time, message)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), true, '2020-07-09 20:10:25', 'A comment from alex');
INSERT INTO comment (member_id, team_id, goal_id, team_page, date_time, message)
VALUES (1, 1, null, false, '2020-07-09 20:10:25', 'Today is the day!');
INSERT INTO comment (member_id, team_id, goal_id, team_page, date_time, message)
VALUES (1, 1, null, false, '2020-07-09 20:10:25', 'Here is another comment');

INSERT INTO goal (member_id, team_id, task_name, task_description, date_time)
VALUES ((SELECT member_id from team_member WHERE email = 'leohaller@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 'Read', 'Finish Reading', '2020-07-09 19:10:25');
INSERT INTO goal (member_id, team_id, task_name, task_description, date_time)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 'Cook', 'Finish Cooking', '2020-07-09 19:10:25');
INSERT INTO goal (member_id, team_id, task_name, task_description, date_time)
VALUES ((SELECT member_id from team_member WHERE email = 'alexdohm11@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 'Walk', 'Finish Walking', '2020-07-09 19:10:25');

UPDATE goal
SET status = true
WHERE goal_id = 4;

INSERT INTO goal (member_id, team_id, task_name, task_description, date_time)
VALUES ((SELECT member_id from team_member WHERE email = 'leohaller@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Orange'), 'Soccer', 'Play Soccer', '2020-07-09 19:10:25');

INSERT INTO goal (member_id, team_id, task_name, task_description, date_time)
VALUES ((SELECT member_id from team_member WHERE email = 'leohaller@gmail.com'),
        (SELECT team_id from team WHERE team_name = 'Team Red'), 'Sing', 'Finish Singing', '2020-07-10 19:10:25');

UPDATE team_member
SET active = false
WHERE member_id = 4;
UPDATE member_of
SET date_left = '2020-07-09'
WHERE member_id = 4
  AND team_id = 1;