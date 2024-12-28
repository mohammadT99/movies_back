const express = require("express");
const ScrapController = require("../app/controller/scrap/ScrapController");

const { GetMoviesController } = require("../app/controller/scrap/PostMovies");

const router = express.Router();

// router.get("/give", ScrapController);
router.post("/give", GetMoviesController);

module.exports = router;
