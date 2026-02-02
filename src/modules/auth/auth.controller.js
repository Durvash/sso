const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('./auth.model');

const auth = {
  signup,
  login,
};

async function signup(req, res) {
  try {
    const { email, password } = req.body;

    // Check email aleady exist or not
    const [user, userError] = await authModel.finduserByEmail(email);
    if (userError) {
      throw new Error(userError);
    }

    if (user.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exist!',
      });
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

    // Get user detail by email
    const [user, userError] = await authModel.finduserByEmail(email);
    if (userError) {
      throw new Error(userError);
    }

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare Hashed Password
    const isMatch = await bcrypt.compare(password, user[0]?.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Get User detail to store in session
    const [userData, userDataError] = await authModel.getUserById(user[0]?.id);
    if (userDataError) {
      throw new Error(userDataError);
    }

    const loginData = Array.isArray(userData) ? userData[0] : userData;

    // Remove password before sending user data
    delete loginData?.password_hash;

    // Generate JWT token
    const token = jwt.sign(loginData, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({
      success: true,
      message: 'Loggin successful.',
      data: loginData,
      token: token,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Login failed, please try again!',
      stack: e.message,
    });
  }
}

module.exports = auth;
