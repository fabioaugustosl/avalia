var should = require('should'),
	request = require('supertest'),
	app = require('../../app.js'),
	mongoose = require('mongoose'),
	alunoModel = require('../models/alunoModel'), // mongoose.model('alunoModel'),
	agent = request.agent(app);

describe('Teste Crud Aluno', function(){
	it('Deve permitir salvar um aluno e ter como retorno o obeto com _id', function(done){

		var alunoPost = {nome: 'Fabio Teste', email:'fabio@virtz.com.br', celular:'(31) 988512273'};

		agent.post('api/alunos/v1/')
				.send(alunoPost)
				.expect(200)
				.end(function(err, results){
					results.body.should.have.property('_id');
					done();
				});
	});

	afterEach(function(done){
		alunoModel.remove.exec();
		done();
	});
});