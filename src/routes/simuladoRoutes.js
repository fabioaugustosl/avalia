var express = require('express');

var simuladoModel = require('../models/simuladoModel');

var simuladoRouter = express.Router();

var simuladoController = require('../controller/SimuladoController')(simuladoModel);


simuladoRouter.route('/')
		.post(function(req, res){
			simuladoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			simuladoController.listar(req, res);
		});


simuladoRouter.use('/:simuladoId', function(req, res, next){
	if("finalizar" == req.params.simuladoId || "adicionarFalta" == req.params.simuladoId){
		next();
	} else {
		// esse é nosso middleware
		simuladoModel.findById(req.params.simuladoId, function(err, simulado){
			if(err){
				res.status(500).send(err);
			} else if(simulado) {
				req.simulado = simulado;
				next();
			} else {
				res.status(404).send('simulado não encontrada');
			}
		});
	}
});


simuladoRouter.route('/:simuladoId')
		.get(function(req, res){
			res.json(req.simulado);
		})
		.patch(function(req, res){
			simuladoController.atualizar(req, res);
		})
		.delete(function(req, res){
			simuladoController.remover(req, res);
		});

		
simuladoRouter.route('/finalizar/:simuladoId').get(function(req, res){
			simuladoController.finalizar(req.params.simuladoId, req.query.data, req, res);
		});

simuladoRouter.route('/adicionarFalta/:simuladoId/:faltaId').get(function(req, res){
			simuladoController.adicionarFalta(req.params.simuladoId, req.params.faltaId, req, res);
		});


module.exports = simuladoRouter;
