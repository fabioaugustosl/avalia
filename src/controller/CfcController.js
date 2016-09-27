var cfcController = function(cfcModel){

	var salvarNovo = function(req, res){
		
		var cfc = new cfcModel(req.body);
		if(!req.body.nome) {
			res.status(400);
			res.send('Nome obrigatório');
		} else {
			cfc.dataCriacao = new Date();
			
			cfc.save();
			res.status(201);
			res.send(cfc);	
		}

	};

	var substituir = function(req, res){
		var cfc = req.cfc; // new cfcModel(req.body);

		cfc.nome = req.body.nome;
		cfc.email = req.body.email;
		cfc.telefone = req.body.telefone;
		cfc.cidade = req.body.cidade;
		cfc.dataCriacao = req.body.dataCriacao;

		//req.aluno.telefone = req.body.telefone;

		req.cfc.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.cfc);
			}
		});
	};

	var atualizar = function(req, res){
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.cfc[p] = req.body[p];	
		}
		
		req.cfc.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.cfc);
			}
		});
	};

	var remover = function(req, res){
		req.cfc.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('CFC removida.');
			}
		});
	
	};

	var listar = function(req, res){
		var query = {};
		if(req.query){
			query = req.query;
		}
		cfcModel.find(query, function(err, cfcs){
			if(err){
				res.status(500).send(err);
			} else {

				var returnCfcs = [];
				cfcs.forEach(function(element, index, array){
					var cfcObj = element.toJSON();
					cfcObj.links = {};
					cfcObj.links.self = 'http://'+req.headers.host + '/api/cfc/v1/' + cfcObj._id;
					returnCfcs.push(cfcObj);
				});

				res.json(returnCfcs);
			}
		});
	};

	return {
		substituir : substituir,
		atualizar : atualizar,
		listar : listar,
		remover : remover,
		salvarNovo : salvarNovo
	};

};

module.exports = cfcController;