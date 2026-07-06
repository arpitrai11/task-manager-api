const { registerUser, loginUser, googleLoginUser } = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const result = await registerUser({ name, email, password });
    res.status(201).json({
      message: 'User registered successfully',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const result = await loginUser({ email, password });
    res.status(200).json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Google idToken is required.' });
    }

    const result = await googleLoginUser({ idToken });
    res.status(200).json({
      message: 'Google login successful',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, googleLogin };
