import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export function useSort<T>(items: T[], initialSort?: SortConfig<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialSort || null
  );

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;

    const sorted = [...items].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const getSortDirection = (key: keyof T): SortDirection | null => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction;
  };

  return {
    sortedItems,
    sortConfig,
    requestSort,
    getSortDirection
  };
}
