import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/24/outline';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Projects = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/projects', newProject);
      toast.success('Project created!');
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Projects</h1>

        {isAdmin ? (
          <form onSubmit={handleCreateProject} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Website Redesign"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Project overview..."
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !newProject.name}
              className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? 'Creating...' : (<><PlusIcon className="h-5 w-5 mr-2" />Create Project</>)}
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-6">Projects you are a member of:</p>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {isAdmin ? 'No projects yet. Create one above.' : 'You have not been added to any projects yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
