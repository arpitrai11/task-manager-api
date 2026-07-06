const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const userRepository = require('../repositories/userRepository');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createJwt = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'task-secret', {
    expiresIn: '7d'
  });

const registerUser = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('User already exists.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({ name, email, password: hashedPassword });
  const token = createJwt(user);

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401;
    throw error;
  }

  const token = createJwt(user);
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

const googleLoginUser = async ({ idToken }) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  const email = payload.email;
  const name = payload.name || payload.email.split('@')[0];

  let user = await userRepository.findByEmail(email);
  if (!user) {
    user = await userRepository.createUser({
      name,
      email,
      password: await bcrypt.hash(`${email}-${process.env.JWT_SECRET}`, 10)
    });
  }

  const token = createJwt(user);
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

module.exports = { registerUser, loginUser, googleLoginUser };