const Joi = require('joi');

// Auth schema
const schemas = {
  // Company
  companySchema: {
    body: Joi.object({
      company_name: Joi.string()
        .min(3)
        .max(100)
        .pattern(/^[a-zA-Z\s]+$/)
        .required()
        .messages({
          'string.pattern.base':
            'Company name should only contain letters and spaces.',
          'string.empty': 'Company name is required.',
          'string.min': 'Company name must be at least 3 characters long.',
          'string.max': 'Company name must be upto 100 characters long.',
          'any.required': 'Company name is required.',
        }),
    }),
  },
};

module.exports = schemas;
