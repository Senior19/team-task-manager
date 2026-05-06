const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const isRemote = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: isRemote ? { require: true, rejectUnauthorized: false } : false
  },
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
});

// MODELS
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'member'), defaultValue: 'member' }
});

const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  adminId: { type: DataTypes.INTEGER, allowNull: false }
});

const Task = sequelize.define('Task', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  status: { 
    type: DataTypes.ENUM('todo', 'in-progress', 'done'), 
    defaultValue: 'todo' 
  },
  dueDate: DataTypes.DATE,
  priority: { 
    type: DataTypes.ENUM('low', 'medium', 'high'), 
    defaultValue: 'medium' 
  },
  assignedTo: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: { model: 'Users', key: 'id' }
  }
});

// RELATIONSHIPS - ALL REQUIREMENTS
User.hasMany(Project, { foreignKey: 'adminId' });
Project.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

Project.belongsToMany(User, { through: 'ProjectMembers', foreignKey: 'projectId' });
User.belongsToMany(Project, { through: 'ProjectMembers', foreignKey: 'userId' });

Project.hasMany(Task);
Task.belongsTo(Project);

Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
User.hasMany(Task, { foreignKey: 'assignedTo' });

module.exports = { sequelize, User, Project, Task };