import React from 'react';
import { Card } from "../components/shadcn/card";
import { Progress } from "../components/shadcn/progress";
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - will be replaced with real data from API
  const enrolledCourses = [
    { id: 1, title: 'React Fundamentals', progress: 75, instructor: 'John Doe' },
    { id: 2, title: 'Node.js Advanced', progress: 30, instructor: 'Jane Smith' },
    { id: 3, title: 'MongoDB Mastery', progress: 50, instructor: 'Mike Johnson' },
  ];

  const upcomingAssignments = [
    { id: 1, title: 'React Project', dueDate: '2024-03-20', course: 'React Fundamentals' },
    { id: 2, title: 'API Design', dueDate: '2024-03-25', course: 'Node.js Advanced' },
  ];

  const recentActivities = [
    { id: 1, type: 'completion', course: 'HTML & CSS Basics', date: '2024-03-15' },
    { id: 2, type: 'assignment', course: 'React Fundamentals', date: '2024-03-14' },
  ];

  return (
    <div className="min-h-screen dark:bg-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{`Welcome back, ${user?.name || 'Student'}!`}</h1>
          <p className="text-zinc-400">Continue your learning journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-semibold mb-2">Courses Enrolled</h3>
            <p className="text-3xl font-bold">{enrolledCourses.length}</p>
          </Card>
          <Card className="p-6 dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-semibold mb-2">Hours Spent</h3>
            <p className="text-3xl font-bold">24</p>
          </Card>
          <Card className="p-6 dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-semibold mb-2">Assignments Due</h3>
            <p className="text-3xl font-bold">{upcomingAssignments.length}</p>
          </Card>
        </div>

        {/* Course Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-4">Course Progress</h2>
            <div className="space-y-4">
              {enrolledCourses.map(course => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{course.title}</h3>
                    <span className="text-zinc-400">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="p-6 dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-4">Upcoming Assignments</h2>
            <div className="space-y-4">
              {upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-zinc-400 text-sm">{assignment.course}</p>
                  </div>
                  <span className="text-zinc-400">{assignment.dueDate}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 dark:bg-zinc-900 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                <div>
                  <p className="font-medium">
                    {activity.type === 'completion' ? 'Completed' : 'Submitted'} - {activity.course}
                  </p>
                  <p className="text-zinc-400 text-sm">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
