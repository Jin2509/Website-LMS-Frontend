import { useState } from 'react';

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export function useSemesterFilter(initialSemester?: string) {
  const [selectedSemester, setSelectedSemester] = useState<string>(
    initialSemester || 'all'
  );

  const filterBySemester = <T extends { semesterId?: string }>(
    items: T[]
  ): T[] => {
    if (selectedSemester === 'all') return items;
    return items.filter(item => item.semesterId === selectedSemester);
  };

  return {
    selectedSemester,
    setSelectedSemester,
    filterBySemester
  };
}
