var express = require('express');

var alunoModel = require('../models/alunoModel');

var alunoRouter = express.Router();

var alunosController = require('../controller/alunosController')(alunoModel);

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
			
			req.aluno.nome = req.body.nome;
			req.aluno.email = req.body.email;
			req.aluno.celular = req.body.celular;

			req.aluno.save(function(err){
				if(err){
					res.status(500).send(err);
				} else {
					res.json(req.aluno);
				}
			});
		})
		.patch(function(req, res){
			if(req.body._id){
				delete req.body._id;
			}

			for(var p in req.body){
				req.aluno[p] = req.body[p];	
			}
			
			req.aluno.save(function(err){
				if(err){
					res.status(500).send(err);
				} else {
					res.json(req.aluno);
				}
			});
	
		})
		.delete(function(req, res){
			req.aluno.remove(function(err){
				if(err){
					res.status(500).send(err);
				} else {
					res.status(204).send('Aluno removido.');
				}
			});
	
		});
		

module.exports = alunoRouter;
