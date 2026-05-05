import { useState } from 'react';
import axios from 'axios';
import { CheckIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TaskCard = ({ task, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      await axios.patch(`/api/tasks/${task.id}`, { status });
      toast.success('Task updated!');
      onUpdate?.();
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.replace('-', ' ').toUpperCase()}
        </div>
        {isOverdue && (
          <div className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            Overdue
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
      {task.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          task.priority === 'high' ? 'bg-red-100 text-red-800' :
          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {task.priority.toUpperCase()}
        </span>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => updateStatus('todo')}
          disabled={updating || task.status === 'todo'}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Todo
        </button>
        <button
          onClick={() => updateStatus('in-progress')}
          disabled={updating || task.status === 'in-progress'}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          In Progress
        </button>
        <button
          onClick={() => updateStatus('done')}
          disabled={updating || task.status === 'done'}
          className="flex-1 py-2 px-4 bg-green-600 border border-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckIcon className="h-4 w-4 inline mr-1" />
          Done
        </button>
      </div>
    </div>
  );
};

export default TaskCard;