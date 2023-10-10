const {check} = require('express-validator')
const validateSignup = [
    check('name').notEmpty().withMessage('Name is required'),
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ];

module.exports = validateSignup  