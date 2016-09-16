var should = require('should'),
	sinon = require('sinon');

describe('Testes controller alunos: ', function(){
	describe('Post', function(){
		it('Nao deve permitir aluno sem nome', function(){
			var alunoModel = function(aluno) {this.save = function(){}};

			var req = {
				body: { email : 'fabioaugustosl@gmail.com'}
			}

			var res = {
				status : sinon.spy(),
				send: sinon.spy()
			}

			var alunosController = require('../controller/alunosController')(alunoModel);
			alunosController.salvarNovo(req, res);

			res.status.calledWith(400).should.equal(true, 'Bad Status '+res.status.args[0][0]);
			res.send.calledWith('Nome obrigatório').should.equal(true);

		})
	})
});