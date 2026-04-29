export const courseMockData = (courseId: string | undefined) => ({
  id: courseId,
  title: 'Lập trình Web với React',
  instructor: 'Nguyễn Văn A',
  description: 'Học cách xây dựng ứng dụng web hiện đại với React, từ cơ bản đến nâng cao.',
  category: 'Lập trình',
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
  progress: 45,
  totalLessons: 12,
  completedLessons: 5,
});

export const lessonsMockData = [
  {
    id: 'lesson-1',
    title: 'Giới thiệu về React',
    duration: '15 phút',
    completed: true,
    locked: false,
    type: 'reading' as const,
    assignmentId: 'assignment-1',
    content: `
      <h2>Chào mừng đến với khóa học React!</h2>
      <p>React là một thư viện JavaScript mạnh mẽ được phát triển bởi Facebook, giúp xây dựng giao diện người dùng tương tác và hiện đại.</p>
      
      <h3>Tại sao nên học React?</h3>
      <ul>
        <li><strong>Component-Based:</strong> Xây dựng UI từ các component độc lập, có thể tái sử dụng</li>
        <li><strong>Virtual DOM:</strong> Cải thiện hiệu suất rendering</li>
        <li><strong>Declarative:</strong> Code dễ đọc và dễ debug hơn</li>
        <li><strong>Large Community:</strong> Cộng đồng lớn với nhiều thư viện hỗ trợ</li>
      </ul>

      <h3>Bạn sẽ học được gì?</h3>
      <p>Trong khóa học này, bạn sẽ học cách:</p>
      <ol>
        <li>Tạo component React</li>
        <li>Quản lý state và props</li>
        <li>Xử lý events</li>
        <li>Làm việc với hooks (useState, useEffect, ...)</li>
        <li>Routing với React Router</li>
        <li>Tích hợp API</li>
        <li>Xây dựng ứng dụng thực tế</li>
      </ol>

      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>💡 Lưu ý:</strong> Để học tốt khóa học này, bạn nên có kiến thức cơ bản về HTML, CSS và JavaScript.</p>
      </div>
    `,
    files: [
      { name: 'React-Introduction.pdf', size: '2.5 MB', url: '#' },
      { name: 'Setup-Guide.pdf', size: '1.2 MB', url: '#' },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Cài đặt môi trường',
    duration: '20 phút',
    completed: true,
    locked: false,
    type: 'video' as const,
    assignmentId: 'assignment-2',
    content: `
      <h2>Cài đặt môi trường phát triển React</h2>
      <p>Trong bài học này, chúng ta sẽ cài đặt các công cụ cần thiết để bắt đầu phát triển với React.</p>
      
      <h3>Các công cụ cần thiết:</h3>
      <ul>
        <li><strong>Node.js & npm:</strong> Để chạy JavaScript và quản lý packages</li>
        <li><strong>Code Editor:</strong> VS Code (khuyến nghị)</li>
        <li><strong>Create React App:</strong> Tool để tạo project React nhanh chóng</li>
      </ul>

      <h3>Các bước cài đặt:</h3>
      <ol>
        <li>Tải và cài đặt Node.js từ <a href="https://nodejs.org" target="_blank">nodejs.org</a></li>
        <li>Mở terminal và chạy: <code>node --version</code> để kiểm tra</li>
        <li>Cài đặt Create React App: <code>npx create-react-app my-app</code></li>
        <li>Di chuyển vào thư mục: <code>cd my-app</code></li>
        <li>Chạy ứng dụng: <code>npm start</code></li>
      </ol>

      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>⚠️ Chú ý:</strong> Video hướng dẫn chi tiết sẽ được thêm vào ở phần trên.</p>
      </div>
    `,
    files: [
      { name: 'Installation-Commands.txt', size: '500 KB', url: '#' },
    ],
    videoUrl: 'optional',
  },
  {
    id: 'lesson-3',
    title: 'JSX và Components',
    duration: '25 phút',
    completed: true,
    locked: false,
    type: 'reading' as const,
    assignmentId: 'assignment-3',
    content: `
      <h2>JSX và Components trong React</h2>
      <p>JSX là cú pháp mở rộng của JavaScript, cho phép bạn viết HTML trong JavaScript.</p>
      
      <h3>Ví dụ về JSX:</h3>
      <pre style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto;">
const element = &lt;h1&gt;Hello, world!&lt;/h1&gt;;

function Welcome(props) {
  return &lt;h1&gt;Xin chào, {props.name}&lt;/h1&gt;;
}
      </pre>

      <h3>Tạo Component:</h3>
      <p>Component là khối xây dựng cơ bản của React. Có 2 loại component:</p>
      <ul>
        <li><strong>Function Component:</strong> Component đơn giản, dễ viết</li>
        <li><strong>Class Component:</strong> Component phức tạp hơn (ít dùng)</li>
      </ul>

      <pre style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto;">
// Function Component
function Greeting({ name }) {
  return (
    &lt;div&gt;
      &lt;h1&gt;Xin chào {name}!&lt;/h1&gt;
      &lt;p&gt;Chào mừng đến với React&lt;/p&gt;
    &lt;/div&gt;
  );
}

// Sử dụng component
&lt;Greeting name="Nguyễn Văn A" /&gt;
      </pre>
    `,
    files: [
      { name: 'JSX-Examples.zip', size: '800 KB', url: '#' },
    ],
  },
  {
    id: 'lesson-4',
    title: 'State và Props',
    duration: '30 phút',
    completed: true,
    locked: false,
    type: 'reading' as const,
    assignmentId: 'assignment-4',
    content: `
      <h2>State và Props</h2>
      <p>State và Props là hai khái niệm quan trọng để quản lý dữ liệu trong React.</p>
      
      <h3>Props (Properties):</h3>
      <p>Props là dữ liệu được truyền từ component cha xuống component con.</p>
      
      <h3>State:</h3>
      <p>State là dữ liệu nội bộ của component, có thể thay đổi theo thời gian.</p>

      <pre style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto;">
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;Bạn đã click {count} lần&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Tăng
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
      </pre>
    `,
  },
  {
    id: 'lesson-5',
    title: 'Event Handling',
    duration: '18 phút',
    completed: true,
    locked: false,
    type: 'reading' as const,
  },
  {
    id: 'lesson-6',
    title: 'Conditional Rendering',
    duration: '22 phút',
    completed: false,
    locked: false,
    type: 'video' as const,
    assignmentId: 'assignment-5',
  },
  {
    id: 'lesson-7',
    title: 'Lists và Keys',
    duration: '20 phút',
    completed: false,
    locked: false,
    type: 'reading' as const,
  },
  {
    id: 'lesson-8',
    title: 'Forms trong React',
    duration: '28 phút',
    completed: false,
    locked: false,
    type: 'reading' as const,
  },
  {
    id: 'lesson-9',
    title: 'Hooks: useEffect',
    duration: '35 phút',
    completed: false,
    locked: true,
    type: 'video' as const,
  },
  {
    id: 'lesson-10',
    title: 'Custom Hooks',
    duration: '30 phút',
    completed: false,
    locked: true,
    type: 'reading' as const,
  },
  {
    id: 'lesson-11',
    title: 'React Router',
    duration: '40 phút',
    completed: false,
    locked: true,
    type: 'video' as const,
  },
  {
    id: 'lesson-12',
    title: 'Dự án thực hành',
    duration: '60 phút',
    completed: false,
    locked: true,
    type: 'quiz' as const,
  },
];
