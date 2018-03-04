var express = require('express');

var alunoModel = require('../models/alunoModel');

var alunoRouter = express.Router();

var alunosController = require('../controller/AlunosController')(alunoModel);


alunoRouter.route('/')
		.post(function(req, res){
			alunosController.salvarNovo(req, res);
		})
		.get(function(req, res){
			alunosController.listar(req, res);
		});


alunoRouter.use('/:alunoId', function(req, res, next){
	// esse é nosso middleware
	alunoModel.findById(req.params.alunoId, function(err, aluno){
		if(err){
			res.status(500).send(err);
		} else if(aluno) {
			req.aluno = aluno;
			next();
		} else {
			res.status(404).send('Aluno não encontrado');
		}
	});
});


alunoRouter.route('/:alunoId')
		.get(function(req, res){
			res.json(req.aluno);
		})
		.put(function(req, res){
			alunosController.substituir(req, res);
		})
		.patch(function(req, res){
			alunosController.atualizar(req, res);
		})
		.delete(function(req, res){
			alunosController.remover(req, res);
		});
		

module.exports = alunoRouter;
