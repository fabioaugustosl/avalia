var express = require('express');

var aulaModel = require('../models/aulaModel');

var aulaRouter = express.Router();

var aulaController = require('../controller/AulaController')(aulaModel);


aulaRouter.route('/')
		.post(function(req, res){
			console.log('chegou no route post de aula');
			console.log(req.body);
			aulaController.salvarNovo(req, res);
		})
		.get(function(req, res){
			aulaController.listar(req, res);
		});


aulaRouter.use('/:aulaId', function(req, res, next){
	if("finalizar" == req.params.aulaId){
		next();
	} else {
		// esse é nosso middleware
		aulaModel.findById(req.params.aulaId, function(err, aula){
			if(err){
				res.status(500).send(err);
			} else if(aula) {
				req.aula = aula;
				next();
			} else {
				res.status(404).send('Aula não encontrada');
			}
		});
	}
});


aulaRouter.route('/:aulaId')
		.get(function(req, res){
			res.json(req.aula);
		})
		.patch(function(req, res){
			aulaController.atualizar(req, res);
		})
		.delete(function(req, res){
			aulaController.remover(req, res);
		});
		
aulaRouter.route('/finalizar/:aulaId').get(function(req, res){
			aulaController.finalizar(req.params.aulaId, req.query.kmFinal, req.query.data, req, res);
		});

module.exports = aulaRouter;
