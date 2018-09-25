
var moment = require('moment');
var avaliacaoController = function(avaliacaoModel){

	var salvarNovo = function(req, res){
		
		var avaliacao = new avaliacaoModel(req.body);
		
		console.log('body :',req.body);
		var aluno = req.body.aluno;
		var exercicio = req.body.exercicio;

		console.log('aluno: ',aluno);

		if(!req.body.aluno) {
			res.status(400);
			res.send('Aluno é obrigatório');
		} else if(!req.body.nota) {
			res.status(400);
			res.send('Nota obrigatório');
		} else if(!req.body.exercicio) {
			res.status(400);
			res.send('Exercicio obrigatório');
		} else {

			avaliacao.data = moment().second(0).millisecond(0).format();
			if(!avaliacao.loginAluno) {
				avaliacao.loginAluno = req.body.aluno.login;
			}
			if(!avaliacao.cfc) {
				avaliacao.cfc = req.body.aluno.cfc._id;
			}

			avaliacao.save();
			res.status(201);
			console.log('avaliação após salvar', avaliacao);
			// seta pra retornar.. eh um teste
			console.log('aluno: ',aluno);
			avaliacao.aluno = aluno;
			avaliacao.exercicio= exercicio;
			console.log('avaliação após TESTE ', avaliacao);
			res.send(avaliacao);	
		}

	};

	var substituir = function(req, res){
		var avaliacao = req.avaliacao; // new avaliacaoModel(req.body);

		avaliacao.data = req.body.data;
		if(avaliacao.data){
			avaliacao.data = moment(avaliacao.data,"DD/MM/YYYY").second(0).millisecond(0).format();
		}
		avaliacao.exercicio = req.body.exercicio;
		avaliacao.nomeAvaliador = req.body.nomeAvaliador;
		avaliacao.aluno = req.body.aluno;
		avaliacao.nota = req.body.nota;

		req.avaliacao.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.avaliacao);
			}
		});
	};

	var atualizar = function(req, res){
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.avaliacao[p] = req.body[p];	
		}
		
		req.avaliacao.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.avaliacao);
			}
		});
	};

	var remover = function(req, res){
		req.avaliacao.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Avaliação removida.');
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
		
		avaliacaoModel.find(query)
			.populate('exercicio').populate('aluno')
			.exec( function(err, avaliacaos){
				if(err){
					res.status(500).send(err);
				} else {

				/*	var returnAvaliacoes = [];
					avaliacaos.forEach(function(element, index, array){
						var avaliacaoObj = element.toJSON();
						avaliacaoObj.links = {};
						avaliacaoObj.links.self = 'http://'+req.headers.host + '/api/avaliacao/v1/' + avaliacaoObj._id;
						returnAvaliacoes.push(avaliacaoObj);
					});*/

					res.json(avaliacaos);
				}
			});
	};


	//  RELATORIOSSS

	var listarMediaNotasPorExercicio = function(codigoAluno, idCfc, req, res){
		console.log('entrou no relatorio de media de notas de exercicios dos alunos ',codigoAluno,idCfc);
		//console.log(avaliacaoModel)
		
		var filtros =  [{'loginAluno' : codigoAluno}];
		//var filtros = [{'aluno._id': ObjectId("5a91b95cf2f45e5fc321473b")}];
		//console.log(filtros);

		avaliacaoModel.aggregate(
	    [	
			{
	            //"$match": {  "nomeAvaliador" : "Stella" }
	            //"$match": {  "$aluno": "5a91b95cf2f45e5fc321473b" }
	           	"$match": {  $and: filtros }

        	},        	
        	{ "$group": 
        		{
					"_id": {exercicio: "$exercicio"},
		        	"nota" : {$avg : "$nota"},
	            	"total": {$sum: 1}
				}	
			}

	    ],
	    function(err,result) {
	    	console.log(result);
	    	res.status(201);
			res.send(result);


	       // Result is an array of documents
	    }
		);
	};

	var listarMediaNotasPorAula = function(codigoAluno, idCfc, req, res){
		console.log('entrou no relatorio de media de notas de exercicios dos alunos ',codigoAluno,idCfc);
		//console.log(avaliacaoModel)
		avaliacaoModel.aggregate(
	    [	
			/*{
	            "$match": {
	                aluno : {login : codigoAluno}
	            }
        	},
        	*/
        	{ "$group": {
				"_id": {aula: "$idAula"},
		        "nota" : {$avg : "$nota"},
	            "total": {$sum: 1}
			}}
	    ],
	    function(err,result) {
	    	console.log(result);
	    	res.status(201);
			res.send(result);


	       // Result is an array of documents
	    }
		);
	};



	return {
		listarMediaNotasPorExercicio : listarMediaNotasPorExercicio,
		listarMediaNotasPorAula : listarMediaNotasPorAula,
		substituir : substituir,
		atualizar : atualizar,
		listar : listar,
		remover : remover,
		salvarNovo : salvarNovo
	};

};

module.exports = avaliacaoController;