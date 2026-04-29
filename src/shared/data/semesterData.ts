export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  academicYear: string;
}

export const semesters: Semester[] = [
  {
    id: 'sem-2025-1',
    name: 'Học kỳ 1',
    startDate: '2025-09-01',
    endDate: '2026-01-15',
    status: 'completed',
    academicYear: '2025-2026',
  },
  {
    id: 'sem-2025-2',
    name: 'Học kỳ 2',
    startDate: '2026-01-20',
    endDate: '2026-05-30',
    status: 'active',
    academicYear: '2025-2026',
  },
  {
    id: 'sem-2026-1',
    name: 'Học kỳ 1',
    startDate: '2026-09-01',
    endDate: '2027-01-15',
    status: 'upcoming',
    academicYear: '2026-2027',
  },
];

export function getCurrentSemester(): Semester {
  return semesters.find(s => s.status === 'active') || semesters[0];
}

export function getSemesterById(id: string): Semester | undefined {
  return semesters.find(s => s.id === id);
}

export function getSemesterDisplayName(semester: Semester): string {
  return `${semester.name} - ${semester.academicYear}`;
}

// Save selected semester to localStorage
export function saveSelectedSemester(semesterId: string): void {
  localStorage.setItem('admin_selected_semester', semesterId);
}

// Get selected semester from localStorage
export function getSelectedSemester(): Semester {
  const savedId = localStorage.getItem('admin_selected_semester');
  if (savedId) {
    const semester = getSemesterById(savedId);
    if (semester) return semester;
  }
  return getCurrentSemester();
}
