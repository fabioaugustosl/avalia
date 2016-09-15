var express = require('express');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/db_avalia');
var alunoModel = require('../models/alunoModel');

var alunoRouter = express.Router();

alunoRouter.route('/')
		.get(function(req, res){
			var query = req.query;
			alunoModel.find(query, function(err, alunos){
				if(err){
					res.status(500).send(err);
 				} else {
					res.json(alunos);
				}
			});

		});

alunoRouter.route('/:alunoId')
		.get(function(req, res){
			alunoModel.findById(req.params.alunoId, function(err, aluno){
				if(err){
					res.status(500).send(err);
 				} else {
					res.json(aluno);
				}
			});
		});

module.exports = alunoRouter;
