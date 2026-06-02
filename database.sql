-- LMS Database Schema
-- Generated for Website-LMS-Frontend
-- Database: MySQL

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: Users
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `phone` VARCHAR(20),
  `address` TEXT,
  `role` ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
  `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  `avatar_url` VARCHAR(255),
  `student_id` VARCHAR(20) UNIQUE,
  `department` VARCHAR(100),
  `enrolled_year` YEAR,
  `last_active` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Courses
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `instructor_id` INT,
  `category` VARCHAR(100),
  `image_url` VARCHAR(255),
  `is_published` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Classes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `instructor_id` INT,
  `semester` VARCHAR(20),
  `year` YEAR,
  `max_students` INT DEFAULT 30,
  `image_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: ClassSchedules
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `class_schedules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT NOT NULL,
  `day_of_week` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `room` VARCHAR(50),
  `type` ENUM('THEORY', 'PRACTICE') DEFAULT 'THEORY',
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Enrollments
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `enrolled_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('ENROLLED', 'DROPPED', 'COMPLETED') DEFAULT 'ENROLLED',
  `final_grade` DECIMAL(5, 2),
  `attendance_count` INT DEFAULT 0,
  UNIQUE KEY `unique_enrollment` (`user_id`, `class_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Lessons
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lessons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT,
  `duration` VARCHAR(50),
  `type` ENUM('VIDEO', 'READING', 'QUIZ') NOT NULL DEFAULT 'READING',
  `video_url` VARCHAR(255),
  `order_index` INT DEFAULT 0,
  `is_locked` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: LessonFiles
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lesson_files` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lesson_id` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_size` VARCHAR(50),
  `file_url` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Assignments
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT NOT NULL,
  `lesson_id` INT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `due_date` DATETIME NOT NULL,
  `max_points` INT DEFAULT 100,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Submissions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assignment_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `content` TEXT,
  `file_url` VARCHAR(255),
  `file_name` VARCHAR(255),
  `file_size` VARCHAR(50),
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `grade` DECIMAL(5, 2),
  `feedback` TEXT,
  `status` ENUM('SUBMITTED', 'GRADED', 'LATE') DEFAULT 'SUBMITTED',
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Exams
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `exams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `duration_minutes` INT NOT NULL,
  `total_points` INT DEFAULT 100,
  `pass_percentage` INT DEFAULT 50,
  `show_results_immediately` BOOLEAN DEFAULT TRUE,
  `start_time` DATETIME,
  `end_time` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: ExamQuestions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `exam_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `exam_id` INT NOT NULL,
  `question_text` TEXT NOT NULL,
  `type` ENUM('MULTIPLE_CHOICE', 'TRUE_FALSE', 'ESSAY') NOT NULL,
  `points` INT DEFAULT 1,
  `order_index` INT DEFAULT 0,
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: QuestionOptions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `question_options` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question_id` INT NOT NULL,
  `option_text` TEXT NOT NULL,
  `is_correct` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`question_id`) REFERENCES `exam_questions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: ExamAttempts
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `exam_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `exam_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `start_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `end_time` DATETIME,
  `score` DECIMAL(5, 2),
  `status` ENUM('IN_PROGRESS', 'SUBMITTED', 'GRADED') DEFAULT 'IN_PROGRESS',
  FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Discussions
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `discussions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `author_id` INT NOT NULL,
  `course_id` INT,
  `category` VARCHAR(50),
  `is_pinned` BOOLEAN DEFAULT FALSE,
  `status` ENUM('ACTIVE', 'REPORTED', 'DELETED') DEFAULT 'ACTIVE',
  `views_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: DiscussionReplies
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `discussion_replies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `discussion_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`discussion_id`) REFERENCES `discussions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: ActivityLogs
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `action` VARCHAR(255) NOT NULL,
  `type` ENUM('USER', 'COURSE', 'ASSIGNMENT', 'SYSTEM') NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: StudentLessonProgress
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_lesson_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `lesson_id` INT NOT NULL,
  `is_completed` BOOLEAN DEFAULT FALSE,
  `completed_at` DATETIME,
  UNIQUE KEY `unique_progress` (`student_id`, `lesson_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: Notifications
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `type` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: UserSettings
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_settings` (
  `user_id` INT PRIMARY KEY,
  `email_notifications` BOOLEAN DEFAULT TRUE,
  `assignment_reminders` BOOLEAN DEFAULT TRUE,
  `grade_notifications` BOOLEAN DEFAULT TRUE,
  `course_updates` BOOLEAN DEFAULT TRUE,
  `class_announcements` BOOLEAN DEFAULT TRUE,
  `weekly_digest` BOOLEAN DEFAULT FALSE,
  `theme` ENUM('LIGHT', 'DARK', 'AUTO') DEFAULT 'LIGHT',
  `language` VARCHAR(10) DEFAULT 'vi',
  `date_format` VARCHAR(20) DEFAULT 'dd/mm/yyyy',
  `timezone` VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: SystemSettings
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_settings` (
  `setting_key` VARCHAR(50) PRIMARY KEY,
  `setting_value` TEXT,
  `description` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default system settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `description`) VALUES
('site_name', 'LMS Platform', 'Tên hệ thống'),
('site_description', 'Nền tảng học tập trực tuyến', 'Mô tả hệ thống'),
('admin_email', 'admin@lms.com', 'Email quản trị'),
('support_email', 'support@lms.com', 'Email hỗ trợ'),
('enable_registration', 'true', 'Cho phép đăng ký mới'),
('enable_email_verification', 'false', 'Yêu cầu xác thực email'),
('max_file_size_mb', '10', 'Kích thước file tối đa (MB)'),
('session_timeout_min', '30', 'Thời gian hết phiên (phút)');

-- --------------------------------------------------------
-- Indexes for performance
-- --------------------------------------------------------
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_course_instructor ON courses(instructor_id);
CREATE INDEX idx_class_course ON classes(course_id);
CREATE INDEX idx_class_instructor ON classes(instructor_id);
CREATE INDEX idx_schedule_class ON class_schedules(class_id);
CREATE INDEX idx_enrollment_user ON enrollments(user_id);
CREATE INDEX idx_enrollment_class ON enrollments(class_id);
CREATE INDEX idx_lesson_course ON lessons(course_id);
CREATE INDEX idx_assignment_class ON assignments(class_id);
CREATE INDEX idx_submission_assignment ON submissions(assignment_id);
CREATE INDEX idx_submission_student ON submissions(student_id);
CREATE INDEX idx_exam_class ON exams(class_id);
CREATE INDEX idx_discussion_author ON discussions(author_id);
CREATE INDEX idx_discussion_course ON discussions(course_id);
CREATE INDEX idx_reply_discussion ON discussion_replies(discussion_id);
CREATE INDEX idx_activity_user ON activity_logs(user_id);
