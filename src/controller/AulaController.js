
var moment = require('moment');
var aulaController = function(aulaModel){

	var salvarNovo = function(req, res){
		console.log('chegou no controller da aula');
		var aula = new aulaModel(req.body);
		console.log(aula);

		var msgObrigatorio = '';

		if(!req.body.cfc) {
			msgObrigatorio+= 'CFC é obrigatória.<br/>';
		}
		
		if(!req.body.aluno) {
			msgObrigatorio+= 'O Aluno é obrigatório.<br/>';
		}

		if(!req.body.instrutor) {
			msgObrigatorio+= 'O Instrutor é obrigatório.<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			
			if(!aula.data){
				aula.data = moment().second(0).millisecond(0).format();
			}
			if(!aula.periodo){
				aula.periodo = 'MANHA';
			}
			 
			aula.save();
			res.status(201);
			res.send(aula);	
		}

	};


	var remover = function(req, res){
		req.aula.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Aula removida.');
			}
		});
	};


	var atualizar = function(req, res){
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.aula[p] = req.body[p];	
		}
		
		req.aula.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.aula);
			}
		});
	};


	var listar = function(req, res){
		var query = {};
		console.log(moment().format()); 	


		if(req.query){
			query = req.query;
			if(query.data){
				query.data = moment(query.data, "DD/MM/YYYY").format();
				console.log(query.data);
			}
			if(query.dataIni && query.dataFim){
				query.data = {
                    $gte: moment(query.dataIni, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).format(),
                    $lte: moment(query.dataFim, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).format()
                }
			} else if(query.dataIni && !query.dataFim){
				query.data = {
                    $gte: moment(query.dataIni, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).format()
                }
			} else if(!query.dataIni && query.dataFim){
				query.data = {
                    $lte: moment(query.dataFim, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).format()
                }
			}
			delete query.dataFim;
			delete query.dataIni;

			console.log(query);
		}
		
		aulaModel.find(query)
			.exec( function(err, aulas){
				if(err){
					res.status(500).send(err);
				} else {

				/*	var returnAvaliacoes = [];
					aulas.forEach(function(element, index, array){
						var aulaObj = element.toJSON();
						aulaObj.links = {};
						aulaObj.links.self = 'http://'+req.headers.host + '/api/aula/v1/' + aulaObj._id;
						returnAvaliacoes.push(aulaObj);
					});*/

					res.json(aulas);
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

module.exports = aulaController;