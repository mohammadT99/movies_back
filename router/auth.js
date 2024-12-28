const express = require("express");
const {
  LoginController,
  RegisterController,
} = require("../app/controller/auth/authController");

const Router = express.Router();

Router.get("/", (req, res) => {
  return res.send("hi");
});
Router.post("/register", RegisterController);
Router.post("/login", LoginController);

module.exports = Router;
