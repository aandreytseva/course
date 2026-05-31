INSERT INTO students (first_name, last_name, email, group_name)
VALUES ('Anastasia', 'Andreiteva', 'anastasia.andreiteva@example.com', 'IAFR-2302'),
       ('Alexandr',  'Galeta',     'alex.galeta@example.com',          'IAFR-2302'),
       ('Maria',     'Ceban',      'maria.ceban@example.com',          'IAFR-2301'),
       ('Ion',       'Rusu',       'ion.rusu@example.com',             'IAFR-2301'),
       ('Elena',     'Moraru',     'elena.moraru@example.com',         'IA-2303'),
       ('Dmitri',    'Lupan',      'dmitri.lupan@example.com',         'IA-2303');

INSERT INTO courses (name, description, teacher)
VALUES ('Java Backend',                  'Spring Boot and REST API development',               'Dr. Ionescu'),
       ('Databases',                     'SQL, PostgreSQL and relational design',               'Dr. Petrov'),
       ('Algorithms & Data Structures',  'Sorting, searching, graphs, dynamic programming',    'Dr. Popescu'),
       ('Web Technologies',              'HTML, CSS, JavaScript, REST APIs',                   'Prof. Galben');

INSERT INTO assignments (title, description, due_date, course_id)
VALUES ('REST API Homework',     'Create CRUD endpoints for students',           '2026-06-10', 1),
       ('SQL Practice',          'Write SELECT queries with JOINs',              '2026-06-15', 2),
       ('Lab #1 — Sorting',      'Implement bubble sort and merge sort',         '2026-06-18', 3),
       ('Lab #2 — Graphs',       'BFS and DFS traversal on adjacency list',      '2026-06-25', 3),
       ('Project — Frontend',    'Build a UI for the student management app',    '2026-07-01', 4);

INSERT INTO grades (value, date, student_id, course_id)
VALUES (10, '2026-05-30', 1, 1),
       (9,  '2026-05-30', 2, 1),
       (8,  '2026-05-30', 3, 2),
       (7,  '2026-05-28', 4, 2),
       (9,  '2026-05-28', 1, 3),
       (6,  '2026-05-28', 5, 3),
       (10, '2026-05-29', 3, 3),
       (8,  '2026-05-29', 6, 4),
       (9,  '2026-05-29', 2, 4),
       (5,  '2026-05-27', 4, 1);