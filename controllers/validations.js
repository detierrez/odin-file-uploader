const { body, param, validationResult } = require("express-validator");
const prisma = require("../lib/prisma");

module.exports.validateSignup = [
  commonlyValidate("username")
    .trim()
    .custom(async (username) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user) {
        throw new Error("username already exists");
      }
    }),
  commonlyValidate("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  commonlyValidate("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("passwords must match"),
];

module.exports.validateLogin = [
  commonlyValidate("username"),
  commonlyValidate("password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
];

module.exports.validateId = [
  param("id").toInt().isInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next("ERROR"); // TODO: tune up error-catching logic
    next();
  },
];

function commonlyValidate(field) {
  return body(field)
    .trim()
    .exists({ values: "falsy" })
    .withMessage(`${field} is required`)
    .isLength({ max: 64 })
    .withMessage(`${field} must contain at most 64 characters`);
}
