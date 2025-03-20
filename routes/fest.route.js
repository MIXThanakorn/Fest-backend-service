const express = require("express");
const festController = require("../controllers/fest.controller");
const route = express.Router();

route.post('/', festController.uploadFest, festController.createFest);

route.get('/:userId', festController.getAllFestbyuser); 
route.get('/only/:festId', festController.getOnlyFest); 

route.put('/:festId', festController.uploadFest, festController.updateFest);

route.delete('/:festId', festController.deleteFest);


module.exports = route;