var express = require('express');

var avaliacaoModel = require('../models/avaliacaoModel');

var avaliacaoRouter = express.Router();

var avaliacaoController = require('../controller/AvaliacaoController')(avaliacaoModel);


avaliacaoRouter.route('/listarMediaNotasPorExercicio/:cfc/:aluno')
		.get(function(req, res){
			avaliacaoController.listarMediaNotasPorExercicio(req.params.aluno, req.params.cfc, req, res);
		});


avaliacaoRouter.route('/listarMediaNotasPorAula/:cfc/:aluno')
		.get(function(req, res){
			avaliacaoController.listarMediaNotasPorAula(req.params.aluno, req.params.cfc, req, res);
		});



module.exports = avaliacaoRouter;
