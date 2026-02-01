const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('./auth.model');

const auth = {
  signup,
  login
}

async function signup(req, res) {
  try {
    const { fullname, email, password } = req.body;

    // Check email aleady exist or not
    const [user, userError] = await authModel.finduserByEmail(email);
    if (userError) {
      throw new Error(userError);
    }

    if (user.length > 0) {
      throw new Error('Email already exist!');
    }

    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user data to signup
    const [newUser, newUserError] = await authModel.insertUser({
      ...req.body,
      password: hashedPassword,
    });
    if (newUserError) {
      throw new Error(newUserError);
    }

    res.status(200).json({
      success: true,
      message: 'Signup Successfully.',
      data: newUser,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Singup failed, please try again!',
      stack: e.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check email aleady exist or not
    const [user, userError] = await authModel.finduserByEmail(email);
    if (userError) {
      throw new Error(userError);
    }

    if (user.length === 0) {
      throw new Error('Invalid email or password!');
    }
    
    res.status(200).json({
      success: true,
      data: [],
      token: null
    })

  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Login failed, please try again!',
      stack: e.message,
    });
  }
}

module.exports = auth;
