var mongoose = require('mongoose'), Schema = mongoose.Schema;

var infracaoModel = new Schema({
	id : {type : String },
	nomeAvaliador : {type : String},
	idAula : {type : String},
	cfc : {type : String},
	aluno : {type: Schema.Types.ObjectId, ref:'Aluno'},
	loginAluno : {type: String},
	false : {type: Schema.Types.ObjectId, ref:'Falta'},
	nota : {type : Number},
	data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Infracao', infracaoModel);