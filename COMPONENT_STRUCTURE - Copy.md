# Component Structure Guide

## 📁 Folder Structure

```
/src/app/
├── components/
│   ├── shared/                         # 🌍 Global Reusable Components
│   │   ├── StatCard.tsx               # Statistics display card
│   │   ├── CourseCard.tsx             # Course information card
│   │   ├── AssignmentCard.tsx         # Assignment display card
│   │   └── PageHeader.tsx             # Page header with gradient title
│   ├── ui/                            # 🎨 UI Primitives (shadcn/ui)
│   └── Layout.tsx                     # Main layout wrapper
│
├── pages/
│   ├── CoursePage/                    # 📚 Course Detail Page
│   │   ├── components/
│   │   │   ├── CourseHeader.tsx       # Course metadata header
│   │   │   ├── LessonSidebar.tsx      # Lessons navigation sidebar
│   │   │   ├── LessonContent.tsx      # Main lesson content display
│   │   │   ├── LessonNavigation.tsx   # Prev/Next lesson buttons
│   │   │   └── CourseAssignmentsList.tsx # Course assignments list
│   │   ├── data/
│   │   │   └── mockData.ts            # Mock course & lesson data
│   │   └── CoursePage.tsx             # Main page component (130 lines)
│   │
│   ├── Login.tsx
│   ├── StudentDashboard.tsx
│   ├── TeacherDashboard.tsx
│   └── ... (other pages)
│
└── lib/
    └── data.ts                        # Global mock data
```

---

## 🎯 Component Usage Guide

### 1. StatCard
**Location**: `/src/app/components/shared/StatCard.tsx`  
**Use Case**: Display statistics (numbers, metrics, counts)

```tsx
import { StatCard } from '@/components/shared/StatCard';
import { Users } from 'lucide-react';

<StatCard
  title="Total Students"
  value={150}
  icon={Users}
  iconColor="text-blue-600"
  iconBgColor="bg-blue-100"
/>
```

---

### 2. CourseCard
**Location**: `/src/app/components/shared/CourseCard.tsx`  
**Use Case**: Display course information in a grid or list

```tsx
import { CourseCard } from '@/components/shared/CourseCard';

<CourseCard
  course={courseData}
  onClick={() => navigate(`/courses/${courseData.id}`)}
/>
```

**Props**: Requires course object with id, title, description, instructor, progress, totalLessons, completedLessons, image, category

---

### 3. AssignmentCard
**Location**: `/src/app/components/shared/AssignmentCard.tsx`  
**Use Case**: Display assignment with due date and status

```tsx
import { AssignmentCard } from '@/components/shared/AssignmentCard';

<AssignmentCard
  assignment={assignmentData}
  onView={() => navigate(`/assignments/${assignmentData.id}`)}
  showCourse={true}  // Optional: show course name
/>
```

**Features**: Automatically calculates urgency, shows overdue warnings

---

### 4. PageHeader
**Location**: `/src/app/components/shared/PageHeader.tsx`  
**Use Case**: Consistent page headers across all pages

```tsx
import { PageHeader } from '@/components/shared/PageHeader';

<PageHeader
  title="Bảng điều khiển"
  description="Quản lý khóa học và học sinh"
  gradient="from-blue-600 via-indigo-600 to-purple-600"
  actions={<Button>Tạo mới</Button>}  // Optional
/>
```

---

## 📋 Quick Reference

### When to Create a New Component

✅ **DO extract** when:
- JSX block is >30 lines
- Code is reused 2+ times
- Component has its own logic/state
- Represents a distinct UI concept

❌ **DON'T extract** when:
- JSX is <20 lines and simple
- Tightly coupled to parent
- Would make code harder to read

---

### Component Naming Convention

- **Page components**: `PageName.tsx` (e.g., `CoursePage.tsx`)
- **Shared components**: `ComponentPurpose.tsx` (e.g., `StatCard.tsx`)
- **Page-specific components**: `FeatureDescription.tsx` (e.g., `LessonSidebar.tsx`)

---

### Import Paths

```tsx
// Shared components
import { StatCard } from '@/components/shared/StatCard';
import { CourseCard } from '@/components/shared/CourseCard';

// Page-specific components (relative import)
import { CourseHeader } from './components/CourseHeader';

// UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

---

## 🚀 Benefits of Current Structure

1. **Modularity**: Each component has a single, clear purpose
2. **Reusability**: Shared components used across 4+ pages
3. **Maintainability**: 80% reduction in main page file size
4. **Type Safety**: All components fully typed with TypeScript
5. **Testability**: Small components are easier to test

---

## 📊 Refactoring Results

### CoursePage Refactoring
- **Before**: 669 lines (monolithic)
- **After**: 130 lines (modular)
- **Reduction**: 80%
- **Components created**: 6

### Code Reuse
- **StatCard**: Used in 5+ pages
- **CourseCard**: Used in 4 pages
- **AssignmentCard**: Used in 3 pages
- **PageHeader**: Used in all pages

---

## 🔧 Development Workflow

### Adding a New Page

1. Create page folder: `/src/app/pages/NewPage/`
2. Create main component: `NewPage.tsx`
3. If needed, create: `components/`, `data/`, `hooks/`
4. Extract large JSX blocks (>30 lines) to page-specific components
5. Reuse shared components where possible

### Creating a Shared Component

1. Check if component will be used in 2+ pages
2. Create in `/src/app/components/shared/`
3. Define TypeScript interface for props
4. Make component generic and configurable
5. Update this documentation

---

## 📝 TypeScript Best Practices

```tsx
// ✅ Good: Explicit interface
interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  // ...
}

// ❌ Bad: Implicit any
export function CourseCard({ course, onClick }) {
  // ...
}
```

---

**Last Updated**: March 25, 2026  
**Maintained By**: Development Team
