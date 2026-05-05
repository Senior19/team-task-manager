const { User, Project } = require('../models');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
    res.json(users);
  } catch (err) {
    console.error('GetAllUsers Error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

const addMemberToProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findByPk(projectId);

    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can add members' });
    }

    await project.addUser(userId);
    res.json({ message: 'Member added successfully' });
  } catch (err) {
    console.error('AddMemberToProject Error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

module.exports = { getAllUsers, addMemberToProject };
