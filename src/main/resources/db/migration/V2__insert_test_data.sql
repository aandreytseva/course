INSERT INTO students (first_name, last_name, email, group_name)
VALUES ('Anastasia', 'Andreiteva', 'anastasia.andreiteva@example.com', 'IAFR-2302'),
       ('Alexandr', 'Galeta', 'alex.galeta@example.com', 'IAFR-2302'),
       ('Maria', 'Ceban', 'maria.ceban@example.com', 'IAFR-2301');

INSERT INTO courses (name, description, teacher)
VALUES ('Java Backend', 'Spring Boot and REST API development', 'Dr. Ionescu'),
       ('Databases', 'SQL, PostgreSQL and relational design', 'Dr. Petrov');

INSERT INTO assignments (title, description, due_date, course_id)
VALUES ('REST API Homework', 'Create CRUD endpoints for students', '2026-06-10', 1),
       ('SQL Practice', 'Write SELECT queries with JOINs', '2026-06-15', 2);

INSERT INTO grades (value, date, student_id, course_id)
VALUES (10, '2026-05-30', 1, 1),
       (9, '2026-05-30', 2, 1),
       (8, '2026-05-30', 3, 2);