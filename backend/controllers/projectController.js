const { Project, User } = require('../models');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        { model: User, as: 'admin' },
        { 
          model: User, 
          through: { attributes: [] },
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.json(projects);
  } catch (err) {
    console.error('GetProjects Error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      adminId: req.user.id
    });
    res.status(201).json(project);
  } catch (err) {
    console.error('CreateProject Error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

const addMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can add members' });
    }
    
    await project.addUser(userId);
    res.json({ message: 'Member added' });
  } catch (err) {
    console.error('AddMember Error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.adminId !== req.user.id) {
      return res.status(403).json({ error: 'Only admin can remove members' });
    }
    
    await project.removeUser(userId);
    res.json({ message: 'Member removed' });
  } catch (err) {
    console.error('RemoveMember Error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

module.exports = { getProjects, createProject, addMember, removeMember };