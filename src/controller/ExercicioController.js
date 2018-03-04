var exercicioController = function(exercicioModel){


	var salvarNovo = function(req, res){
		var exercicio = new exercicioModel(req.body);

		var msgObrigatorio = '';
		if(!exercicio.nome){
			msgObrigatorio+= 'Nome é obrigatório.<br/>';
		}
		if(!exercicio.cfc){
			msgObrigatorio+= 'Email é obrigatório.<br/>';
		}

		if(!exercicio.categoria){
			msgObrigatorio+= 'Categoria é obrigatório.<br/>';
		}

		if(exercicio.categoria != 'A' && exercicio.categoria != 'B' && exercicio.categoria != 'C' 
			&& exercicio.categoria != 'D' && exercicio.categoria != 'E' ){
			msgObrigatorio+= 'Categoria deve ser A, B, C, D ou E.<br/>';
		}


		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {

			exercicio.save();
			res.status(201);
			res.send(exercicio);	
		}
	};

	
	var remover = function(req, res){
		console.log("remover exercico");
		req.exercicio.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('exercicio removido.');
			}
		});
	};

	
	var atualizar = function(req, res){
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.exercicio[p] = req.body[p];	
		}
		
		req.exercicio.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.exercicio);
			}
		});
	};

	var listar = function(req, res){
		var query = {};
		if(req.query){
			query = req.query;
		}
		exercicioModel.find(query, function(err, exercicios){
			if(err){
				res.status(500).send(err);
			} else {

				var returnexercicios = [];
				exercicios.forEach(function(element, index, array){
					var exercicioObj = element.toJSON();
					exercicioObj.links = {};
					exercicioObj.links.self = 'http://'+req.headers.host + '/api/exercicios/v1/' + exercicioObj._id;
					returnexercicios.push(exercicioObj);
				});

				res.json(returnexercicios);
			}
		});
	};

	return {
		atualizar : atualizar,
		remover : remover,
		listar : listar,
		salvarNovo : salvarNovo
	};

};

module.exports = exercicioController;