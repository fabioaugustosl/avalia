var alunosController = function(alunoModel){

	var salvarNovo = function(req, res){
		var aluno = new alunoModel(req.body);

		if(!req.body.nome){
			res.status(400);
			res.send('Nome obrigatório');
		} else {
			aluno.save();
			res.status(201);
			res.send(aluno);	
		}

	};

	var substituir = function(req, res){
		
	};

	var atualizar = function(req, res){
		
	};

	var listar = function(req, res){
		var query = {};
		if(req.query){
			query = req.query;
		}
		alunoModel.find(query, function(err, alunos){
			if(err){
				res.status(500).send(err);
			} else {

				var returnAlunos = [];
				alunos.forEach(function(element, index, array){
					var alunoObj = element.toJSON();
					alunoObj.links = {};
					alunoObj.links.self = 'http://'+req.headers.host + '/api/alunos/v1/' + alunoObj._id;
					returnAlunos.push(alunoObj);
				});

				res.json(returnAlunos);
			}
		});
	};

	return {
		substituir : substituir,
		atualizar : atualizar,
		listar : listar,
		salvarNovo : salvarNovo
	};

};

module.exports = alunosController;