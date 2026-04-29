import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Trophy, Download, BarChart3 } from 'lucide-react';

interface StudentResult {
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: string;
  duration: number;
  attempt: number;
}

interface ExamResultsTableProps {
  results: StudentResult[];
  totalPoints: number;
}

export function ExamResultsTable({ results, totalPoints }: ExamResultsTableProps) {
  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-600">Xuất sắc</Badge>;
    if (percentage >= 70) return <Badge className="bg-blue-600">Khá</Badge>;
    if (percentage >= 50) return <Badge className="bg-yellow-600">Trung bình</Badge>;
    return <Badge className="bg-red-600">Yếu</Badge>;
  };

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0, passRate: 0 };

    const scores = results.map(r => r.percentage);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passRate = (results.filter(r => r.percentage >= 50).length / results.length) * 100;

    return { average, highest, lowest, passRate };
  };

  const stats = calculateStats();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Kết quả sinh viên ({results.length})
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Điểm TB</p>
            <p className="text-2xl font-bold text-blue-600">{stats.average.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Cao nhất</p>
            <p className="text-2xl font-bold text-green-600">{stats.highest.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Thấp nhất</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.lowest.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Tỷ lệ đậu</p>
            <p className="text-2xl font-bold text-purple-600">{stats.passRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Results table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">STT</th>
                <th className="text-left p-3 font-semibold text-gray-700">Sinh viên</th>
                <th className="text-center p-3 font-semibold text-gray-700">Điểm</th>
                <th className="text-center p-3 font-semibold text-gray-700">Xếp loại</th>
                <th className="text-center p-3 font-semibold text-gray-700">Thời gian</th>
                <th className="text-center p-3 font-semibold text-gray-700">Lần thi</th>
                <th className="text-center p-3 font-semibold text-gray-700">Nộp lúc</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={result.studentId}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">
                    {index < 3 && (
                      <Trophy
                        className={`w-5 h-5 inline mr-2 ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          'text-orange-600'
                        }`}
                      />
                    )}
                    {index + 1}
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-gray-900">{result.studentName}</p>
                      <p className="text-sm text-gray-500">{result.studentEmail}</p>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {result.score}/{totalPoints}
                      </p>
                      <p className="text-sm text-gray-500">{result.percentage.toFixed(1)}%</p>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {getScoreBadge(result.percentage)}
                  </td>
                  <td className="p-3 text-center text-gray-700">
                    {result.duration} phút
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="outline">Lần {result.attempt}</Badge>
                  </td>
                  <td className="p-3 text-center text-sm text-gray-600">
                    {new Date(result.submittedAt).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có sinh viên nào nộp bài</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
