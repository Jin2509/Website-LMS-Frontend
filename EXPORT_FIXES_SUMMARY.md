# Tóm tắt Sửa lỗi Export Components

## Lỗi đã sửa

### 1. Missing index.ts in figma folder
- ✅ Created `/src/shared/components/figma/index.ts`
- Export: `ImageWithFallback`

### 2. Fixed incorrect default exports

All component index.ts files were incorrectly using `export { default as X }` when components use named exports `export function X`.

#### Fixed files:
- ✅ `layout/index.ts` - Changed from `default as Layout` to `Layout`
- ✅ `forms/index.ts` - Changed from `default as FileUploadButton` to `FileUploadButton`
- ✅ `cards/index.ts` - Changed all three exports:
  - `StatCard`
  - `CourseCard`
  - `AssignmentCard`
- ✅ `common/index.ts` - Changed all five exports:
  - `PageHeader`
  - `SemesterSelector`
  - `ErrorBoundary`
  - `ConsoleWarningFilter`
  - `ContributionGraph`

## Root Cause

Components were using **named exports**:
```typescript
export function Layout({ children }) { ... }
export function FileUploadButton({ ... }) { ... }
```

But index.ts files were trying to import as **default exports**:
```typescript
// ❌ Wrong
export { default as Layout } from './Layout';

// ✅ Correct
export { Layout } from './Layout';
```

## Verification

✅ All index.ts files now correctly match their component export types
✅ No missing index.ts files in shared/components
✅ Application builds without export errors
