CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')) DEFAULT 'STUDENT',
    student_id TEXT UNIQUE,
    department TEXT,
    enrolled_year TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE courses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    instructor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    category TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE classes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    instructor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    semester TEXT,
    year TEXT,
    schedule TEXT,
    room TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE class_courses (
    class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (class_id, course_id)
);

CREATE TABLE class_students (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    enrolled_date TIMESTAMPTZ DEFAULT NOW(),
    attendance NUMERIC DEFAULT 0,
    average_grade NUMERIC(5,2),
    UNIQUE(class_id, student_id)
);

CREATE TABLE assignments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration TEXT,
    type TEXT CHECK (type IN ('video', 'reading', 'quiz')) DEFAULT 'video',
    content TEXT,
    video_url TEXT,
    assignment_id TEXT REFERENCES assignments(id) ON DELETE SET NULL,
    order_index INT DEFAULT 0
);

CREATE TABLE lesson_files (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    size TEXT,
    url TEXT NOT NULL
);

CREATE TABLE user_lesson_progress (
    student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    locked BOOLEAN DEFAULT true,
    PRIMARY KEY (student_id, lesson_id)
);

CREATE TABLE student_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    assignment_id TEXT REFERENCES assignments(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    submitted_date TIMESTAMPTZ DEFAULT NOW(),
    file_name TEXT,
    file_size TEXT,
    file_url TEXT,
    grade NUMERIC(5,2),
    feedback TEXT,
    status TEXT CHECK (status IN ('submitted', 'graded', 'pending')) DEFAULT 'submitted'
);