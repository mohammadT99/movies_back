const express = require("express");
const router = express.Router();
const movies = require("./movies");

const auth = require("./auth");
// const { validationToken } = require("../app/middleware/validateToken");
router.use("/auth", auth);
router.use("/movies", movies);
module.exports = router;
