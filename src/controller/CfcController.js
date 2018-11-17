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
			//E -> Eliminatória
			var f1 = { categoria : 'B',  nome : 'Desobedecer à sinalização semafórica e de paradas obrigatórios', tipo:'E'};
			var f2 = { categoria : 'B',  nome : 'Avançar sobre o meio fio', tipo:'E'};
			var f3 = { categoria : 'B',  nome : 'Não colocar o veiculo na área balizada, em no máximo três tentativas no tempo estabelecido', tipo:'E'};
			var f4 = { categoria : 'B',  nome : 'Avançar sobre o balizamento demarcado quando da colocação do veiculo na vaga', tipo:'E'};
			var f5 = { categoria : 'B',  nome : 'Usar a contramão de direção', tipo:'E'};
			var f6 = { categoria : 'B',  nome : 'Não completar a realização de todas as etapas do exame', tipo:'E'};
			var f7 = { categoria : 'B',  nome : 'Avançar a via preferencia', tipo:'E'};

			// G -> Grave
			var f20 = { categoria : 'B',  nome : 'Desobedecer à sinalização da via, ou do agente da autoridade de trânsito', tipo:'G'};
			var f21 = { categoria : 'B',  nome : 'Não observar as regras de ultrapassagem ou de mudança de direção', tipo:'G'};
			var f22 = { categoria : 'B',  nome : 'Manter a porta do veículo aberta ou semi-aberta durante o percurso da prova ou parte dele', tipo:'G'};
			var f23 = { categoria : 'B',  nome : 'Não sinalizar com antecedência a manobra pretendida ou sinalizá-la incorretamente', tipo:'G'};
			var f24 = { categoria : 'B',  nome : 'Não usar devidamente o cinto de segurança', tipo:'G'};

			// M -> Média
			var f40 = { categoria : 'B',  nome : 'Executar o percurso da prova no todo ou parte dele, sem estar o freio de mão inteiramente livre', tipo:'M'};
			var f41 = { categoria : 'B',  nome : 'Trafegar em velocidade inadequada para as condições adversas do local da circulação do veículo e do clima', tipo:'M'};
			var f42 = { categoria : 'B',  nome : 'Interromper o funcioamento do motor, sem justa razão, após o início da prova', tipo:'M'};
			var f43 = { categoria : 'B',  nome : 'Fazer conversão incorretamente', tipo:'M'};
			var f44 = { categoria : 'B',  nome : 'Usar buzina sem necessidade ou em local proibido', tipo:'M'};

			//L -> Leve
			var f60 = { categoria : 'B',  nome : 'Provocar movimentos irregulares no veículo, sem motivo justificado', tipo:'L'};
			var f61 = { categoria : 'B',  nome : 'Ajustar incorretamente o banco do veículo destinado ao condutor', tipo:'L'};
			var f62 = { categoria : 'B',  nome : 'Não ajustar devidamente os espelhos retrovisores', tipo:'L'};
			var f63 = { categoria : 'B',  nome : 'Apoiar o pé no pedal da embreagem com o veículo engrenado e em movimento', tipo:'L'};

			 //E (Eliminatoria), G (Grave), M (Média), L (Leve)

			cfc.exercicios = [c1,c2,c3,c4,c5];
			cfc.faltas = [f1,f2,f3,f4,f5,f6,f7, f20,f21,f22,f23,f24, f40,f41,f42,f43,f44, f60,f61,f62,f63];
			
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