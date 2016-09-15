var express = require('express');
var usuRouter = express.Router();

usuRouter.route('/')
		.get(function(req, res){
			res.render('teste');
		});

usuRouter.route('/usu')
		.get(function(req, res){
			res.render('usuario');
		});

module.exports = usuRouter;
