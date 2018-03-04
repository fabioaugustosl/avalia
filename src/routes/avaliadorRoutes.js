var express = require('express');

var avaliadorModel = require('../models/avaliadorModel');

var avaliadorRouter = express.Router();

var avaliadorController = require('../controller/AvaliadorController')(avaliadorModel);


avaliadorRouter.route('/')
		.post(function(req, res){
			avaliadorController.salvarNovo(req, res);
		})
		.get(function(req, res){
			avaliadorController.listar(req, res);
		});


avaliadorRouter.use('/:avaliadorId', function(req, res, next){
	// esse é nosso middleware
	avaliadorModel.findById(req.params.avaliadorId, function(err, avaliador){
		if(err){
			res.status(500).send(err);
		} else if(avaliador) {
			req.avaliador = avaliador;
			next();
		} else {
			res.status(404).send('Avaliador não encontrado');
		}
	});
});


avaliadorRouter.route('/:avaliadorId')
		.get(function(req, res){
			res.json(req.avaliador);
		})
		.put(function(req, res){
			avaliadorController.substituir(req, res);
		})
		.patch(function(req, res){
			avaliadorController.atualizar(req, res);
		})
		.delete(function(req, res){
			avaliadorController.remover(req, res);
		});
		

module.exports = avaliadorRouter;
