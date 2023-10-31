const router = require("express").Router();
// const userValidation = require("../../lib/validations").user;
const userHandler = require("./userHandler");

router.get("/:id", (req, res) => {
    userHandler(req, res);
});

module.exports = exports = router;
