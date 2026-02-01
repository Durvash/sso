const Joi = require('joi');

/**
 * Supports validation for req.body, req.params, and req.query
 */
const validate = (schema) => (req, res, next) => {
  
  // 1. Identify which parts of the request to validate (body, params, query)
  const keys = Object.keys(schema);

  for (const key of keys) {
    if (!['body', 'query', 'params'].includes(key)) continue;
    
    // 2. Validate the specific part of the request
    // Use req[key] || {} to prevent validating against undefined
    const { error, value } = schema[key].validate(req[key] || {}, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) {
      // 3. Format error messages nicely
      const errorMessage = error.details
        .map((details) => details.message.replace(/\"/g, ''))
        .join(', ');

      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }

    // 4. Important: Replace req[key] with the validated/sanitized value
    // This applies Joi transformations like .lowercase(), .trim(), or .default()
    req[key] = value;
  }

  return next();
};

module.exports = validate;
