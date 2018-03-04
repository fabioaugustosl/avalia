var express = require('express');

var avaliacaoModel = require('../models/avaliacaoModel');

var avaliacaoRouter = express.Router();

var avaliacaoController = require('../controller/AvaliacaoController')(avaliacaoModel);


avaliacaoRouter.route('/')
		.post(function(req, res){
			avaliacaoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			avaliacaoController.listar(req, res);
		});


avaliacaoRouter.use('/:avaliacaoId', function(req, res, next){
	// esse é nosso middleware
	avaliacaoModel.findById(req.params.avaliacaoId, function(err, avaliacao){
		if(err){
			res.status(500).send(err);
		} else if(avaliacao) {
			req.avaliacao = avaliacao;
			next();
		} else {
			res.status(404).send('Avaliação não encontrada');
		}
	});
});


avaliacaoRouter.route('/:avaliacaoId')
		.get(function(req, res){
			res.json(req.avaliacao);
		})
		.put(function(req, res){
			avaliacaoController.substituir(req, res);
		})
		.patch(function(req, res){
			avaliacaoController.atualizar(req, res);
		})
		.delete(function(req, res){
			avaliacaoController.remover(req, res);
		});
		

module.exports = avaliacaoRouter;
