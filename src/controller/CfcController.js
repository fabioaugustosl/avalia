var cfcController = function(cfcModel){

	var salvarNovo = function(req, res){
		
		console.log('chegou API salvar cfc');

		var cfc = new cfcModel(req.body);
		console.log(cfc);

		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, idCategoria, idUnidade
		if(!req.body.nome) {
			msgObrigatorio+= 'Nome é obrigatório.<br/>';
		}
		if(!req.body.email) {
			msgObrigatorio+= 'Email é obrigatório.<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			cfc.dataCriacao = new Date();

			//Criar Exercicios Padrões
			var c1 = { categoria : 'B',  nome : 'Ré' };
			var c2 = { categoria : 'B',  nome : 'Controle Embreagem Frente' };
			var c3 = { categoria : 'B',  nome : 'Controle Embreagem Ré' };
			var c4 = { categoria : 'B',  nome : 'Baliza' };
			var c5 = { categoria : 'B',  nome : 'Conversão' };
			
			//Criar Faltas Padrões
			var f1 = { categoria : 'B',  nome : 'Interromper o funcionamento do motor' };
			var f2 = { categoria : 'B',  nome : 'Ligar motor com automóvel engrenado' };

			cfc.exercicios = [c1,c2,c3,c4,c5];
			cfc.faltas = [f1,f2];
			
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
		cfc.endereco = req.body.endereco;
		cfc.cidade = req.body.cidade;
		cfc.estado = req.body.estado;
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
		cfcModel
		.find(query)
			.populate('exercicios')
			.exec(function(err, cfcs){
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


	var autenticar = function(req, res){
		console.log("chegou no autenticar");
		//var email = req.body.email;
		//var senha = req.body.senha;

		//console.log(email, senha);
		var query = [];

		query.push({email : req.body.email});
		query.push({senha :  req.body.senha});
		
		var queryFinal = { $and: query };
		console.log(queryFinal);
		cfcModel.find(queryFinal).exec(function(err, cfc){
			if(err){
				res.status(500).send(err);
			} else {
				console.log(cfc);
				if(!cfc && cfc.length <= 0) {
					res.status(404).send('Login inválido');
				} else {
					res.status(201);
					res.send(cfc);	
				}
			}
		});
	};


	return {
		substituir : substituir,
		atualizar : atualizar,
		listar : listar,
		remover : remover,
		salvarNovo : salvarNovo,
		autenticar : autenticar
	};

};

module.exports = cfcController;