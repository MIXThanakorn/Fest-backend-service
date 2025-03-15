const express = require("express");
const festController = require("../controllers/fest.controller");
const route = express.Router();

route.post('/', festController.uploadFest, festController.createFest);


module.exports = route;