const { User } = require('../models');

const findByEmail = async (email) => User.findOne({ where: { email } });

const createUser = async ({ name, email, password }) =>
  User.create({ name, email, password });

const findById = async (id) =>
  User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });

module.exports = {
  findByEmail,
  createUser,
  findById
};
