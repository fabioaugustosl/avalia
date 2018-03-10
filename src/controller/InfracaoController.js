
var moment = require('moment');
var infracaoController = function(infracaoModel){

	var salvarNovo = function(req, res){
		
		var infracao = new infracaoModel(req.body);
		
		console.log('body :',req.body);
		//var aluno = req.body.aluno;
		//var falta = req.body.falta;

		//console.log('aluno: ',aluno);
		//console.log('aluno: ',req.body.aluno);
		//console.log('exercicio: ', req.body.exercicio);
		//console.log('infracao: ',infracao);


		if(!req.body.aluno) {
			res.status(400);
			res.send('Aluno é obrigatório');
		} else if(!req.body.nota) {
			res.status(400);
			res.send('Nota obrigatório');
		} else if(!req.body.falta) {
			res.status(400);
			res.send('Falta obrigatório');
		} else {

			infracao.data = moment().second(0).millisecond(0).format();
			if(!infracao.loginAluno) {
				infracao.loginAluno = req.body.aluno.login;
			}
			if(!infracao.cfc) {
				infracao.cfc = req.body.aluno.cfc._id;
			}

			infracao.save();
			res.status(201);
			console.log('Infração após salvar', infracao);
			res.send(infracao);	
		}

	};


	var remover = function(req, res){
		req.infracao.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Infração removida.');
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
		
		infracaoModel.find(query)
			.populate('falta').populate('aluno')
			.exec( function(err, infracaos){
				if(err){
					res.status(500).send(err);
				} else {
					res.json(infracaos);
				}
			});
	};


	//  RELATORIOSSS




	return {
		listar : listar,
		remover : remover,
		salvarNovo : salvarNovo
	};

};

module.exports = infracaoController;