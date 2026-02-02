const Joi = require('joi');

// Reusable parts to keep code DRY
const email = Joi.string().email().lowercase().required().messages({
  'string.email': 'Please enter a valid email address',
  'string.empty': 'Email cannot be empty',
  'any.required': 'Email is required',
});

const password = Joi.string().min(8).max(128).required();

const otp = Joi.string()
  .length(6)
  .pattern(/^[0-9]+$/)
  .required()
  .messages({
    'string.length': 'OTP must be exactly 6 digits',
    'string.pattern.base': 'OTP must only contain numbers',
  });

// Auth schema
const schemas = {
  // SIGNUP
  signupSchema: {
    body: Joi.object({
      full_name: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
          'string.pattern.base':
            'Full name should only contain letters and spaces.',
          'string.empty': 'Full name is required.',
          'string.min': 'Full name must be at least 3 characters long.',
          'string.max': 'Full name must be upto 50 characters long.',
          'any.required': 'Full name is required.',
        }),
      email: email,
      password: password,
    }),
  },

  // LOGIN
  loginSchema: {
    body: Joi.object({
      email: email,
      password: password,
    }),
  },

  // SEND OTP (For Forgot Password or Verification)
  sendOtpSchema: {
    body: Joi.object({
      email: email,
      reason: Joi.string()
        .valid('signup', 'forgot_password', 'login')
        .required(),
    }),
  },

  // VERIFY OTP
  verifyOtpSchema: {
    body: Joi.object({
      email: email,
      otp: otp,
    }),
  },

  // FORGOT PASSWORD (Resetting after OTP verification)
  forgotPasswordSchema: {
    body: Joi.object({
      email: email,
      otp: otp,
      new_password: password,
    }),
  },
};

module.exports = schemas;
