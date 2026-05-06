import { useState, useMemo } from 'react';

export interface SearchOptions<T> {
  keys: (keyof T)[];
  caseSensitive?: boolean;
}

export function useSearch<T>(items: T[], options: SearchOptions<T>) {
  const { keys, caseSensitive = false } = options;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const term = caseSensitive ? searchTerm : searchTerm.toLowerCase();

    return items.filter(item => {
      return keys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          const searchValue = caseSensitive ? value : value.toLowerCase();
          return searchValue.includes(term);
        }
        if (typeof value === 'number') {
          return value.toString().includes(term);
        }
        return false;
      });
    });
  }, [items, searchTerm, keys, caseSensitive]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    hasResults: filteredItems.length > 0
  };
}
