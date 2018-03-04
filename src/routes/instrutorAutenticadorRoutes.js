var express = require('express');

var avaliadorModel = require('../models/avaliadorModel');

var avaliadorautRouter = express.Router();

var avaliadorController = require('../controller/AvaliadorController')(avaliadorModel);


avaliadorautRouter.route('/')
		.post(function(req, res){
			avaliadorController.autenticar(req, res);
		});
		

module.exports = avaliadorautRouter;
