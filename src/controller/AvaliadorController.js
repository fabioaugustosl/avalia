var avaliadorController = function(avaliadorModel){

	var validarObrigatoriedade = function(avaliador, res){
		if(!avaliador.nome){
			res.status(400);
			res.send('Nome obrigatório');
		} 
	};

	var salvarNovo = function(req, res){
		var avaliador = new avaliadorModel(req.body);

		validarObrigatoriedade(avaliador, res);
		
		avaliador.save();
		
		res.status(201);
		res.send(avaliador);	
	};
	
	var remover = function(req, res){
		req.avaliador.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Avaliador removido.');
			}
		});
	};

	var substituir = function(req, res){
		req.avaliador.nome = req.body.nome;
		req.avaliador.login = req.body.login;
		req.avaliador.email = req.body.email;
		req.avaliador.celular = req.body.celular;
		req.avaliador.idCfc = req.body.idCfc;

		req.avaliador.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.avaliador);
			}
		});
	};

	var atualizar = function(req, res){
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.avaliador[p] = req.body[p];	
		}
		
		req.avaliador.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.avaliador);
			}
		});
	};

	var listar = function(req, res){
		var query = {};
		if(req.query){
			query = req.query;
		}
		avaliadorModel.find(query, function(err, avaliadores){
			if(err){
				res.status(500).send(err);
			} else {

				var returnAvaliadores = [];
				avaliadores.forEach(function(element, index, array){
					var avaliadorObj = element.toJSON();
					avaliadorObj.links = {};
					avaliadorObj.links.self = 'http://'+req.headers.host + '/api/avalidor/v1/' + avaliadorObj._id;
					returnAvaliadores.push(avaliadorObj);
				});

				res.json(returnAvaliadores);
			}
		});
	};

	return {
		substituir : substituir,
		atualizar : atualizar,
		remover : remover,
		listar : listar,
		salvarNovo : salvarNovo
	};

};

module.exports = avaliadorController;