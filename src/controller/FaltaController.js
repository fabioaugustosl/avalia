var faltaController = function(faltaModel){


	var salvarNovo = function(req, res){
		var falta = new faltaModel(req.body);

		var msgObrigatorio = '';
		if(!falta.nome){
			msgObrigatorio+= 'Nome é obrigatório.<br/>';
		}
		if(!falta.cfc){
			msgObrigatorio+= 'Email é obrigatório.<br/>';
		}

		if(!falta.categoria){
			msgObrigatorio+= 'Categoria é obrigatório.<br/>';
		}

		if(!falta.tipo){
			msgObrigatorio+= 'Tipo é obrigatório.<br/>';
		}

		if(falta.categoria != 'A' && falta.categoria != 'B' && falta.categoria != 'C' 
			&& falta.categoria != 'D' && falta.categoria != 'E' ){
			msgObrigatorio+= 'Categoria deve ser A, B, C, D ou E.<br/>';
		}

		if(falta.tipo != 'E' && falta.tipo != 'G' && falta.tipo != 'M' && falta.tipo != 'L'  ){
			msgObrigatorio+= 'Tipo deve ser E (Eliminatoria), G (Grave), M (Média), L (Leve).<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			falta.save();
			res.status(201);
			res.send(falta);	
		}
	};

	
	var remover = function(req, res){
		console.log("remover falta");
		req.falta.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('falta removido.');
			}
		});
	};

	
	var atualizar = function(req, res){
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.falta[p] = req.body[p];	
		}
		
		req.falta.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.falta);
			}
		});
	};

	var listar = function(req, res){
		var query = {};
		if(req.query){
			query = req.query;
		}
		faltaModel.find(query, function(err, faltas){
			if(err){
				res.status(500).send(err);
			} else {

				var returnfaltas = [];
				faltas.forEach(function(element, index, array){
					var faltaObj = element.toJSON();
					faltaObj.links = {};
					faltaObj.links.self = 'http://'+req.headers.host + '/api/falta/v1/' + faltaObj._id;
					returnfaltas.push(faltaObj);
				});

				res.json(returnfaltas);
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

module.exports = faltaController;