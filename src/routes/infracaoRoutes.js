var express = require('express');

var infracaoModel = require('../models/infracaoModel');

var infracaoRouter = express.Router();

var infracaoController = require('../controller/InfracaoController')(infracaoModel);


infracaoRouter.route('/')
		.post(function(req, res){
			infracaoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			infracaoController.listar(req, res);
		});


infracaoRouter.use('/:infracaoId', function(req, res, next){
	// esse é nosso middleware
	infracaoModel.findById(req.params.infracaoId, function(err, infracao){
		if(err){
			res.status(500).send(err);
		} else if(infracao) {
			req.infracao = infracao;
			next();
		} else {
			res.status(404).send('Infração não encontrada');
		}
	});
});


infracaoRouter.route('/:infracaoId')
		.get(function(req, res){
			res.json(req.infracao);
		})
		.delete(function(req, res){
			infracaoController.remover(req, res);
		});
		

module.exports = infracaoRouter;
