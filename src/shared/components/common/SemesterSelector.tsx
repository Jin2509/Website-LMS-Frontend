import React from 'react';
import { Label } from '../ui/label';

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface SemesterSelectorProps {
  semesters: Semester[];
  selectedSemester: string;
  onSemesterChange: (semesterId: string) => void;
  label?: string;
  showAll?: boolean;
}

export function SemesterSelector({
  semesters,
  selectedSemester,
  onSemesterChange,
  label = 'Kỳ học',
  showAll = true
}: SemesterSelectorProps) {
  return (
    <div>
      {label && <Label className="mb-2 block">{label}</Label>}
      <select
        value={selectedSemester}
        onChange={(e) => onSemesterChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        {showAll && <option value="all">Tất cả kỳ học</option>}
        {semesters?.map((semester) => (
          <option key={semester.id} value={semester.id}>
            {semester.name}
            {semester.isActive && ' (Đang học)'}
          </option>
        ))}
      </select>
    </div>
  );
}
