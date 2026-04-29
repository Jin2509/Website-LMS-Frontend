import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Search, Mail, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  grade: number;
  lastActive: string;
  status: 'active' | 'at-risk' | 'excelling';
}

const students: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.j@student.edu',
    course: 'Web Development Fundamentals',
    progress: 85,
    grade: 92,
    lastActive: '2 hours ago',
    status: 'excelling',
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma.w@student.edu',
    course: 'Introduction to Computer Science',
    progress: 45,
    grade: 68,
    lastActive: '1 day ago',
    status: 'at-risk',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@student.edu',
    course: 'Web Development Fundamentals',
    progress: 72,
    grade: 85,
    lastActive: '5 hours ago',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah.d@student.edu',
    course: 'Introduction to Computer Science',
    progress: 90,
    grade: 94,
    lastActive: '1 hour ago',
    status: 'excelling',
  },
  {
    id: '5',
    name: 'James Miller',
    email: 'james.m@student.edu',
    course: 'Web Development Fundamentals',
    progress: 38,
    grade: 62,
    lastActive: '3 days ago',
    status: 'at-risk',
  },
  {
    id: '6',
    name: 'Olivia Garcia',
    email: 'olivia.g@student.edu',
    course: 'Introduction to Computer Science',
    progress: 78,
    grade: 88,
    lastActive: '4 hours ago',
    status: 'active',
  },
];

export default function TeacherStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'excelling':
        return <Badge variant="default" className="bg-green-500">Excelling</Badge>;
      case 'at-risk':
        return <Badge variant="destructive">At Risk</Badge>;
      default:
        return <Badge variant="secondary">Active</Badge>;
    }
  };

  const getPerformanceIcon = (grade: number) => {
    if (grade >= 90) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (grade >= 70) return <Minus className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const excellingCount = students.filter(s => s.status === 'excelling').length;
  const atRiskCount = students.filter(s => s.status === 'at-risk').length;
  const averageGrade = students.reduce((acc, s) => acc + s.grade, 0) / students.length;

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Monitor and manage student performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-2">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{students.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-2">Excelling</p>
              <p className="text-3xl font-bold text-green-600">{excellingCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-2">At Risk</p>
              <p className="text-3xl font-bold text-red-600">{atRiskCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-2">Avg. Grade</p>
              <p className="text-3xl font-bold text-indigo-600">{averageGrade.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="Web Development Fundamentals">Web Development</SelectItem>
                  <SelectItem value="Introduction to Computer Science">Computer Science</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="excelling">Excelling</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>Detailed view of all enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{student.course}</p>
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPerformanceIcon(student.grade)}
                        <span className="font-semibold text-gray-900">{student.grade}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(student.status)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{student.lastActive}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No students found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}