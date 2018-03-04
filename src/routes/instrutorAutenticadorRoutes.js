var express = require('express');

var avaliadorModels = require('../models/avaliadorModels');

var avaliadorautRouter = express.Router();

var avaliadorController = require('../controller/AvaliadorController')(avaliadorModels);


avaliadorautRouter.route('/')
		.post(function(req, res){
			avaliadorController.autenticar(req, res);
		});
		

module.exports = avaliadorautRouter;
