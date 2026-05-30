CREATE TABLE students
(
    id         BIGSERIAL    PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    group_name VARCHAR(100)
);

CREATE TABLE courses
(
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    teacher     VARCHAR(255) NOT NULL
);

CREATE TABLE assignments
(
    id          BIGSERIAL    PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    due_date    DATE,
    course_id   BIGINT REFERENCES courses (id) ON DELETE CASCADE
);

CREATE TABLE grades
(
    id         BIGSERIAL PRIMARY KEY,
    value      INTEGER   NOT NULL,
    date       DATE      NOT NULL,
    student_id BIGINT REFERENCES students (id) ON DELETE CASCADE,
    course_id  BIGINT REFERENCES courses (id) ON DELETE CASCADE
);

