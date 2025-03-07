const { body, validationResult } = require('express-validator');

const validateNewMessage = [    
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('Content must be between 1 and 500 characters.')
    .customSanitizer((value) => {
        return value.replace(/[<>"]/g, (match) => {
            switch (match) {
              case '<': return '&lt;';
              case '>': return '&gt;';
              case '"': return '&quot;';
              default: return match;
            }
        });
    }),

  body('timestamp')
    .isString().withMessage('Timestamp must be a valid string.'),

  body('sender_id')
    .isInt().withMessage('Sender ID must be an integer.'),

  body('recipient_id')
    .isInt().withMessage('Recipient ID must be an integer.'),

  body('conversation_id')
    .isInt().withMessage('Conversation ID must be an integer.'),

  (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("RETURN ERROR VALIDATION");
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("PASSING VALIDATION");

    next();
  },
];

module.exports = validateNewMessage;
