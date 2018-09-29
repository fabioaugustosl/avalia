

var veiculoController = function(veiculoModel){

	var salvarNovo = function(req, res){
		console.log('chegou no controller da veiculo');
		var veiculo = new veiculoModel(req.body);
		console.log(veiculo);

		var msgObrigatorio = '';

		if(!req.body.cfc) {
			msgObrigatorio+= 'CFC é obrigatória.<br/>';
		}

		if(!req.body.placa) {
			msgObrigatorio+= 'A placa é obrigatória.<br/>';
		}

		
		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			
			if(!veiculo.tipo){
				veiculo.tipo = 'carro';
			}
			 
			veiculo.save();
			res.status(201);
			res.send(veiculo);	
		}
	};


	var remover = function(req, res){
		req.veiculo.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('veiculo removido.');
			}
		});
	};


	var atualizar = function(req, res){
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.veiculo[p] = req.body[p];	
		}
		
		req.veiculo.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.veiculo);
			}
		});
	};


	var listar = function(req, res){
		var query = [];

		if(req.query){
			if(req.query.cfc){
				query.push({cfc : req.query.cfc});
			}

			if(req.query.ano){
				query.push({ano : req.query.ano});
			}

			if(req.query.anoModelo){
				query.push({anoModelo : req.query.anoModelo});
			}

			if(req.query.placa){
				query.push({placa : RegExp(req.query.placa, "i") });
			}

			if(req.query.nome){
				query.push({nome : RegExp(req.query.nome, "i") });
			}

			if(req.query.marca){
				query.push({marca : RegExp(req.query.marca, "i") });
			}
		}

		var queryFinal = {};
		if(query && query.length > 0){
			queryFinal = { $and: query };
		}
		
		veiculoModel.find(queryFinal)
		.populate('instrutorResponsavel')
		.exec( function(err, veiculos){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(veiculos);
			}
		});
	};

	return {
		listar : listar,
		atualizar :atualizar,
		remover : remover,
		salvarNovo : salvarNovo
	};

};

module.exports = veiculoController;