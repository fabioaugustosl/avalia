
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


	var finalizar = function(idAula, kmFinal, data, req, res){
		if(!data){
			data = moment().second(0).millisecond(0).format();
		}

		aulaModel.findById(idAula, function(err, aula){
			if(err){
				res.status(500).send(err);
			} else if(aula) {
				//aula = new aulaModel(aula);
				//console.log(aula);
				aula.kmFim = kmFinal;
				aula.dataFim = data;

				aula.save(function(err){
					if(err){
						res.status(500).send(err);
					} else {
						res.json(aula);
					}
				});

			} else {
				res.status(404).send('Aula não encontrada');
			}
		});
	};


	var listar = function(req, res){
		var query = {};
		console.log(moment().format()); 	


		if(req.query){
			query = req.query;
			if(query.data){
				query.data = moment(query.data, "DD/MM/YYYY").utc().format();
				console.log(query.data);
			}
			if(query.dataIni && query.dataFim){
				query.data = {
                    $gte: moment(query.dataIni, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).utc().format(),
                    $lte: moment(query.dataFim, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).utc().format()
                }
			} else if(query.dataIni && !query.dataFim){
				query.data = {
                    $gte: moment(query.dataIni, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).utc().format()
                }
			} else if(!query.dataIni && query.dataFim){
				query.data = {
                    $lte: moment(query.dataFim, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).utc().format()
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
					res.json(aulas);
				}
			});
	};


	var listarAulasAtivas = function(id_cfc, req, res){
		var query = [];
		//var dataAgora = moment().utc();

		console.log('AGORA: ',moment().format('MMMM Do YYYY, h:mm:ss a'));
		console.log('AGORA UTC: ',moment().utc().format('MMMM Do YYYY, h:mm:ss a'));
		console.log('AGORA INICIO AULA: ',moment().add(-50, "minutes").utc().format('MMMM Do YYYY, h:mm:ss a'));
		  	
		//var dataInicioAula =  dataAgora.add(-50, "minutes");

		query.push({data : { $gte: moment().add(-50, "minutes").utc().format(), $lt: moment().utc().format() }});
		query.push({cfc : id_cfc });
		
		var queryFinal = { $and: query };
		
		console.log(queryFinal);
		
		aulaModel.find(queryFinal)
			.exec( function(err, aulas){
				if(err){
					res.status(500).send(err);
				} else {
					res.json(aulas);
				}
			});
	};



	var listarAulasDoDiaPorInstrutor = function(id_cfc, req, res){
		var query = [];
		  	
		query.push({'data' : { $gt: moment().locale('pt-br').utc().startOf('day').toDate() }});
		query.push({cfc : id_cfc });
		
		var queryFinal = { $and: query };
		console.log(queryFinal);

		aulaModel.aggregate(
	    [	
			{
	            "$match": queryFinal 
			},        	
        	{ "$group": 
        		{
					"_id": {instrutor: "$instrutor"},
	            	"total": {$sum: 1}
				}	
			}
	    ],
	    function(err,result) {
	    	console.log(result);
	    	//res.status(201);
			res.send(result);
	    }
		);
	};


	var listarKmDoDiaPorInstrutor = function(id_cfc, req, res){
		var query = [];
		  	
		query.push({'data' : { $gt: moment().locale('pt-br').utc().startOf('day').toDate() }});
		query.push({cfc : id_cfc });
		query.push({ kmInicio: { $ne: null } });
		query.push({ kmFim: { $ne: null } });
		
		
		var queryFinal = { $and: query };
		console.log(queryFinal);

		aulaModel.aggregate(
	    [	
			{
	            "$match": queryFinal 
			},        	
        	{ "$group": 
        		{
					"_id": {instrutor: "$instrutor"}
					,
	            	"total": { $sum: { $subtract: [  "$kmFim", "$kmInicio"  ] }  } 
				}	
			}
	    ],
	    function(err,result) {
	    	console.log(result);
	    	//res.status(201);
			res.send(result);
	    }
		);
	};


	


	return {
		listar : listar,
		listarAulasAtivas : listarAulasAtivas,
		listarAulasDoDiaPorInstrutor : listarAulasDoDiaPorInstrutor,
		listarKmDoDiaPorInstrutor : listarKmDoDiaPorInstrutor,
		atualizar :atualizar,
		remover : remover,
		salvarNovo : salvarNovo,
		finalizar : finalizar
	};

};

module.exports = aulaController;