const { Op } = require('sequelize');
const { Task, Project, User } = require('../models');

const getDashboardTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const [total, completed, overdue, tasks] = await Promise.all([
      Task.count({ where: { assignedTo: userId } }),
      Task.count({ where: { assignedTo: userId, status: 'done' } }),
      Task.count({
        where: {
          assignedTo: userId,
          status: { [Op.ne]: 'done' },
          dueDate: { [Op.lt]: new Date() }
        }
      }),
      Task.findAll({
        where: { assignedTo: userId },
        include: [{ model: Project }, { model: User, as: 'assignee' }],
        order: [['createdAt', 'DESC']],
        limit: 10
      })
    ]);

    res.json({ stats: { total, completed, overdue }, tasks });
  } catch (error) {
    console.error('getDashboardTasks error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      assignedTo: req.body.assignedTo
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('createTask error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: Project }]
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.Project.adminId !== req.user.id && task.assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    console.error('updateTask error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

module.exports = { getDashboardTasks, createTask, updateTask };
