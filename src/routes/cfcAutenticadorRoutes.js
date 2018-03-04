var express = require('express');

var cfcModel = require('../models/cfcModel');

var cfcAutRouter = express.Router();

var cfcController = require('../controller/CfcController')(cfcModel);


cfcAutRouter.route('/')
		.post(function(req, res){
			cfcController.autenticar(req, res);
		});
		

module.exports = cfcAutRouter;
