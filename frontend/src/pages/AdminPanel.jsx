import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '', ProjectId: '' });
  const [addMember, setAddMember] = useState({ projectId: '', userId: '' });
  const [taskLoading, setTaskLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users');
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch {
      toast.error('Failed to load projects');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskLoading(true);
    try {
      await axios.post('/api/tasks', newTask);
      toast.success('Task created and assigned!');
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '', ProjectId: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create task');
    } finally {
      setTaskLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberLoading(true);
    try {
      await axios.post('/api/projects/members/add', {
        projectId: parseInt(addMember.projectId),
        userId: parseInt(addMember.userId)
      });
      toast.success('Member added to project!');
      setAddMember({ projectId: '', userId: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add member');
    } finally {
      setMemberLoading(false);
    }
  };

  const tabClass = (tab) =>
    `px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
      activeTab === tab
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">Admin Only</span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-8">
        <button className={tabClass('users')} onClick={() => setActiveTab('users')}>Users</button>
        <button className={tabClass('assign')} onClick={() => setActiveTab('assign')}>Assign Task</button>
        <button className={tabClass('members')} onClick={() => setActiveTab('members')}>Manage Members</button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">All Users ({users.length})</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Task Tab */}
      {activeTab === 'assign' && (
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Create & Assign Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Fix login bug"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Task details..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                value={newTask.assignedTo}
                onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a user...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={newTask.ProjectId}
                onChange={e => setNewTask({ ...newTask, ProjectId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={taskLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {taskLoading ? 'Creating...' : 'Create & Assign Task'}
            </button>
          </form>
        </div>
      )}

      {/* Manage Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Add Member to Project</h2>
          <form onSubmit={handleAddMember} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={addMember.projectId}
                onChange={e => setAddMember({ ...addMember, projectId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User to Add</label>
              <select
                value={addMember.userId}
                onChange={e => setAddMember({ ...addMember, userId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a user...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={memberLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {memberLoading ? 'Adding...' : 'Add Member'}
            </button>
          </form>

          {/* Current project members */}
          {addMember.projectId && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Current Members of "{projects.find(p => p.id === parseInt(addMember.projectId))?.name}"
              </h3>
              <div className="space-y-2">
                {(projects.find(p => p.id === parseInt(addMember.projectId))?.Users || []).map(u => (
                  <div key={u.id} className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-800">{u.name}</span>
                    <span className="text-xs text-gray-500">{u.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
