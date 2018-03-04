var express = require('express');

var cfcModel = require('../models/cfcModel');

var cfcRouter = express.Router();

var cfcController = require('../controller/CfcController')(cfcModel);


cfcRouter.route('/')
		.post(function(req, res){
			cfcController.salvarNovo(req, res);
		})
		.get(function(req, res){
			cfcController.listar(req, res);
		});


cfcRouter.use('/:cfcId', function(req, res, next){
	// esse é nosso middleware
	cfcModel.findById(req.params.cfcId, function(err, cfc){
		if(err){
			res.status(500).send(err);
		} else if(cfc) {
			req.cfc = cfc;
			next();
		} else {
			res.status(404).send('CFC não encontrado');
		}
	});
});


cfcRouter.route('/:cfcId')
		.get(function(req, res){
			res.json(req.cfc);
		})
		.patch(function(req, res){
			cfcController.atualizar(req, res);
		})
		.delete(function(req, res){
			cfcController.remover(req, res);
		});
		

module.exports = cfcRouter;
