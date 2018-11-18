
var moment = require('moment');

var FaltaModel = require('../models/faltaModel');
var CfcModel = require('../models/cfcModel');

var simuladoController = function(simuladoModel){

	var salvarNovo = function(req, res){
		console.log('chegou no controller de salvar simulado');
		var simulado = new simuladoModel(req.body);
		console.log(simulado);

		var msgObrigatorio = '';

		if(!req.body.cfc) {
			msgObrigatorio+= 'CFC é obrigatória.<br/>';
		}
		
		if(!req.body.aluno) {
			msgObrigatorio+= 'O Aluno é obrigatório.<br/>';
		}

		if(!req.body.avaliador) {
			msgObrigatorio+= 'O Instrutor é obrigatório.<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			
			if(!simulado.data){
				simulado.data = moment().second(0).millisecond(0).format();
			}

			simulado.save();
			res.status(201);
			res.send(simulado);	
		}

	};


	var remover = function(req, res){
		req.simulado.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('simulado removido.');
			}
		});
	};


	var atualizar = function(req, res){
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.simulado[p] = req.body[p];	
		}
		
		req.simulado.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.simulado);
			}
		});
	};


	var finalizar = function(idSimulado, data, req, res){
		console.log('chegou no finalizar simulado');

		if(!data){
			data = moment().second(0).millisecond(0).format();
		}

		simuladoModel.findById(idSimulado)
			.exec(function(err, simulado){
			if(err){
				res.status(500).send(err);
			} else if(simulado) {

				simulado.dataFim = data;
				simulado.pontos = 0;

				//console.log('simulado: ',simulado);

				if(simulado.faltas){
					// depois que recuperou o simulado, recupera a cfc pra somar os pontos das faltas
					CfcModel.findById(simulado.cfc)
						.exec(function(err, cfc){
							//console.log('cfc: ', cfc);
							
							for(var faltaSimulado of simulado.faltas) {
								for(var faltaObj of cfc.faltas) {
									if(faltaSimulado._id+'' == faltaObj._id+'' && faltaObj.tipo){
										if(faltaObj.tipo == 'E'){
											simulado.pontos = 1000;
											break;
										} else if(faltaObj.tipo == 'G'){
											simulado.pontos = simulado.pontos + 3;
											break;
										} else if(faltaObj.tipo == 'M'){
											simulado.pontos = simulado.pontos + 2;
											break;
										} else if(faltaObj.tipo == 'L'){
											simulado.pontos = simulado.pontos + 1;
											break;
										}
									} else {
										simulado.pontos = simulado.pontos + 1;
										break;
									}
								};
							};

							console.log(simulado);

							simulado.save(function(err){
								if(err){
									res.status(500).send(err);
								} else {
									res.json(simulado);
								}
							});
					});
				} else {
					console.log("não possui faltas, então vai salvar direto com 0 pontos");
					simulado.save(function(err){
						if(err){ res.status(500).send(err); } 
						else {
							res.json(simulado);
						}
					});
					
				}
			

			} else {
				res.status(404).send('simulado não encontrado');
			}
		});
	};


	var adicionarFalta = function(idSimulado, idFalta, req, res){
		console.log('Vai adicionar uma falta: ',idSimulado, idFalta);
		var falta = new FaltaModel();
		falta._id = idFalta;
		//FaltaModel.findById(idFalta, function(err, falta){
			//console.log('falta por id: ',falta);
			//if(!err && falta){
				console.log('vai recuperar o simulado e salvar a falta');
				simuladoModel.findById(idSimulado, function(err, simulado){
					console.log('chegou no callback do findById ',simulado);
					if(!err){
						simulado.faltas.push(falta);

						console.log('vai salvar a falta ', simulado);

						simulado.save(function(err){
								if(err){
									res.status(500).send(err);
								} else {
									res.status(201);
									res.send(simulado);	
								}
							});
						
					} else {
						res.status(404).send('falta não encontrado');
					}
				});				
				
			//} else {
			//	res.status(404).send('Falta não encontrada');
			//}
		//});
	
	};


	var listar = function(req, res){
		var query = [];
		
		if(req.query){
			if(req.query.cfc){
				query.push({cfc : req.query.cfc});
			}

			if(req.query.aluno){
				query.push({aluno : req.query.aluno});
			}

			if(req.query.avaliador){
				query.push({avaliador : req.query.avaliador});
			}

			console.log(query);
		}

		var queryFinal = {};
		if(query && query.length > 0){
			queryFinal = { $and: query };
		}
		
		simuladoModel.find(queryFinal)
			//.populate('faltas')
			.exec( function(err, simulados){
				if(err){
					res.status(500).send(err);
				} else {
					res.json(simulados);
				}
			});
	};



	return {
		listar : listar,
		atualizar :atualizar,
		remover : remover,
		salvarNovo : salvarNovo,
		finalizar : finalizar,
		adicionarFalta : adicionarFalta
	};

};

module.exports = simuladoController;