var express = require('express');

var exercicioModel = require('../models/exercicioModel');

var exercicioRouter = express.Router();

var exercicioController = require('../controller/ExercicioController')(exercicioModel);


exercicioRouter.route('/')
		.post(function(req, res){
			exercicioController.salvarNovo(req, res);
		})
		.get(function(req, res){
			exercicioController.listar(req, res);
		});


exercicioRouter.use('/:exercicioId', function(req, res, next){
	// esse é nosso middleware
	exercicioModel.findById(req.params.exercicioId, function(err, exercicio){
		if(err){
			res.status(500).send(err);
		} else if(exercicio) {
			req.exercicio = exercicio;
			next();
		} else {
			res.status(404).send('Exercicio não encontrado');
		}
	});
});


exercicioRouter.route('/:exercicioId')
		.get(function(req, res){
			res.json(req.aluno);
		})
		.patch(function(req, res){
			exercicioController.atualizar(req, res);
		})
		.delete(function(req, res){
			exercicioController.remover(req, res);
		});
		

module.exports = exercicioRouter;
