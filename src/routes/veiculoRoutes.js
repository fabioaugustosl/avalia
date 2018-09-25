var express = require('express');

var veiculoModel = require('../models/veiculoModel');

var veiculoRouter = express.Router();

var veiculoController = require('../controller/veiculoController')(veiculoModel);


veiculoRouter.route('/')
		.post(function(req, res){
			veiculoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			veiculoController.listar(req, res);
		});


veiculoRouter.use('/:veiculoId', function(req, res, next){
	// esse é nosso middleware
	veiculoModel.findById(req.params.veiculoId, function(err, veiculo){
		if(err){
			res.status(500).send(err);
		} else if(veiculo) {
			req.veiculo = veiculo;
			next();
		} else {
			res.status(404).send('Veiculo não encontrado');
		}
	});
});


veiculoRouter.route('/:veiculoId')
		.get(function(req, res){
			res.json(req.veiculo);
		})
		.patch(function(req, res){
			veiculoController.atualizar(req, res);
		})
		.delete(function(req, res){
			veiculoController.remover(req, res);
		});
		

module.exports = veiculoRouter;
