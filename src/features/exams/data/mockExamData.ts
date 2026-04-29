import { ExamData } from '../types';

export const mockExam: ExamData = {
  id: '1',
  title: 'Kiểm tra giữa kỳ - React Fundamentals',
  description: 'Đánh giá kiến thức cơ bản về React',
  duration: 60,
  totalPoints: 100,
  showResults: true,
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'React Hook nào được sử dụng để quản lý state trong functional component?',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctAnswer: 1,
      points: 5,
      order: 1,
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Virtual DOM trong React là gì?',
      options: [
        'Một bản sao của DOM thật được lưu trong bộ nhớ',
        'Một thư viện để tạo DOM',
        'Một phương thức để xóa DOM',
        'Một cách để style DOM'
      ],
      correctAnswer: 0,
      points: 5,
      order: 2,
    },
    {
      id: 'q3',
      type: 'true-false',
      question: 'Props trong React có thể được thay đổi bởi component con.',
      correctAnswer: 'false',
      points: 5,
      order: 3,
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'useEffect hook được sử dụng để làm gì?',
      options: [
        'Quản lý state',
        'Xử lý side effects',
        'Tạo context',
        'Render component'
      ],
      correctAnswer: 1,
      points: 5,
      order: 4,
    },
    {
      id: 'q5',
      type: 'essay',
      question: 'Giải thích sự khác biệt giữa controlled và uncontrolled components trong React. Cho ví dụ cụ thể.',
      points: 10,
      order: 5,
    },
    {
      id: 'q6',
      type: 'multiple-choice',
      question: 'JSX là gì?',
      options: [
        'Một ngôn ngữ lập trình mới',
        'Một extension syntax cho JavaScript',
        'Một thư viện CSS',
        'Một framework'
      ],
      correctAnswer: 1,
      points: 5,
      order: 6,
    },
    {
      id: 'q7',
      type: 'true-false',
      question: 'React components phải bắt đầu bằng chữ cái viết hoa.',
      correctAnswer: 'true',
      points: 5,
      order: 7,
    },
    {
      id: 'q8',
      type: 'multiple-choice',
      question: 'Làm thế nào để truyền dữ liệu từ component cha sang component con?',
      options: [
        'Sử dụng state',
        'Sử dụng props',
        'Sử dụng context',
        'Sử dụng refs'
      ],
      correctAnswer: 1,
      points: 5,
      order: 8,
    },
    {
      id: 'q9',
      type: 'essay',
      question: 'Viết một custom hook để fetch data từ API. Giải thích cách sử dụng và các edge cases cần xử lý.',
      points: 15,
      order: 9,
    },
    {
      id: 'q10',
      type: 'true-false',
      question: 'useEffect chạy sau mỗi lần render.',
      correctAnswer: 'true',
      points: 5,
      order: 10,
    },
  ],
};
