var mongoose = require('mongoose'), Schema = mongoose.Schema;

var avaliacaoModel = new Schema({
	id : {type : String },
	nomeAvaliador : {type : String},
	idAula : {type : String},
	cfc : {type : String},
	aluno : {type: Schema.Types.ObjectId, ref:'Aluno'},
	loginAluno : {type: String},
	exercicio : {type: Schema.Types.ObjectId, ref:'Exercicio'},
	nota : {type : Number},
	data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Avaliacao', avaliacaoModel);
