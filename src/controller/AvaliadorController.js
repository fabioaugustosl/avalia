var avaliadorController = function(avaliadorModel){

	

	var salvarNovo = function(req, res){
		var avaliador = new avaliadorModel(req.body);

		var msgObrigatorio = '';
		if(!avaliador.nome){
			msgObrigatorio += 'Nome obrigatório.<br/>';
		} 
		if(!avaliador.cfc){
			msgObrigatorio += 'CFC obrigatório.<br/>';
		} 

		
		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
		
			avaliador.save();
		
			res.status(201);
			res.send(avaliador);	
		}
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


	var autenticar = function(req, res){
		console.log("chegou no autenticar avaliador");
		//var email = req.body.email;
		//var senha = req.body.senha;

		//console.log(email, senha);
		var query = [];

		query.push({email : req.body.email});
		query.push({senha :  req.body.senha});
		
		var queryFinal = { $and: query };
		console.log(queryFinal);
		avaliadorModel.find(queryFinal).exec(function(err, instrutor){
			if(err){
				res.status(500).send(err);
			} else {
				console.log(instrutor);
				if(!instrutor && instrutor.length <= 0) {
					res.status(404).send();
				} else {
					res.status(201);
					res.send(instrutor);	
				}
			}
		});
	};


	return {
		autenticar: autenticar,
		substituir : substituir,
		atualizar : atualizar,
		remover : remover,
		listar : listar,
		salvarNovo : salvarNovo
	};

};

module.exports = avaliadorController;