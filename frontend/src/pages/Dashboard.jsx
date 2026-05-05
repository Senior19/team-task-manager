import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import ProjectCard from '../components/ProjectCard';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState({ stats: {}, tasks: [], projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        axios.get('/api/tasks/dashboard'),
        axios.get('/api/projects')
      ]);
      setData({
        stats: tasksRes.data.stats,
        tasks: tasksRes.data.tasks,
        projects: projectsRes.data
      });
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-pulse">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* ✅ COMPLETE STATS - All Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-900">{data.stats.total || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{data.stats.completed || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Overdue</h3>
          <p className="text-3xl font-bold text-red-600">{data.stats.overdue || 0}</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
          <p className="text-3xl font-bold text-blue-600">{data.projects.length}</p>
        </div>
      </div>

      {/* Recent Tasks */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recent Tasks</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;