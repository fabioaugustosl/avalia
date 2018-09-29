var express = require('express');

var aulaModel = require('../models/aulaModel');

var dashCfcRoutes = express.Router();

var aulaController = require('../controller/AulaController')(aulaModel);


dashCfcRoutes.route('/listarAulasDoDiaPorInstrutor/:cfc')
		.get(function(req, res){
			aulaController.listarAulasDoDiaPorInstrutor(req.params.cfc, req, res);
		});

dashCfcRoutes.route('/listarKmDoDiaPorInstrutor/:cfc')
		.get(function(req, res){
			aulaController.listarKmDoDiaPorInstrutor(req.params.cfc, req, res);
		});
		

dashCfcRoutes.route('/listarAulasAtivas/:cfc')
		.get(function(req, res){
			aulaController.listarAulasAtivas(req.params.cfc, req, res);
		});





module.exports = dashCfcRoutes;
