// CSV utilities - no external dependencies, pure JavaScript solution

export function exportToCSV(
  data: Record<string, any>[],
  filename: string
) {
  try {
    if (data.length === 0) {
      throw new Error('No data to export');
    }

    // Get headers from first row
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.map(h => `"${h}"`).join(','));
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        // Escape quotes and wrap in quotes
        const escaped = String(value ?? '').replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(row.join(','));
    });

    // Create blob and download
    const csvContent = csvRows.join('\n');
    const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.xlsx', '.csv');
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
}

export function readCSVFile(file: File): Promise<any[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => {
          // Simple CSV parser - handles quoted fields
          const matches = row.match(/("(?:[^"]|"")*"|[^,]*)/g);
          return matches ? matches.map(field => {
            // Remove quotes and unescape doubled quotes
            return field.replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
          }) : [];
        });
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function createCSVTemplate(
  data: any[][],
  filename: string
) {
  try {
    const csvRows = data.map(row => 
      row.map(cell => {
        const escaped = String(cell ?? '').replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    );

    const csvContent = csvRows.join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.xlsx', '.csv');
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error creating CSV template:', error);
    throw error;
  }
}
