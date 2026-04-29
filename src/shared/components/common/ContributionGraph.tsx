import { useMemo } from 'react';

interface ContributionGraphProps {
  data: { date: string; count: number }[];
}

export function ContributionGraph({ data }: ContributionGraphProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // 52 weeks

    const result: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dataPoint = data.find(d => d.date === dateStr);
      const count = dataPoint ? dataPoint.count : 0;

      currentWeek.push({ date: dateStr, count });

      if (date.getDay() === 6 || i === 364) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    return result;
  }, [data]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 4) return 'bg-green-400';
    if (count <= 6) return 'bg-green-600';
    return 'bg-green-800';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Mon', 'Wed', 'Fri'];

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex gap-1">
          <div className="flex flex-col justify-around text-xs text-gray-500 pr-2 pt-6">
            {days.map((day) => (
              <div key={day} className="h-3">{day}</div>
            ))}
          </div>
          <div>
            <div className="flex gap-1 mb-1 text-xs text-gray-500 h-5">
              {months.map((month, i) => (
                <div key={i} style={{ width: `${(365 / 12) * 3}px` }}>
                  {month}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
                  {Array(7).fill(0).map((_, dayIndex) => {
                    const day = week[dayIndex];
                    return (
                      <div
                        key={`day-${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm ${day ? getColor(day.count) : 'bg-gray-100'}`}
                        title={day ? `${day.date}: ${day.count} activities` : ''}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-800" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}