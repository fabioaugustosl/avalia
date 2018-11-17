var mongoose = require('mongoose'), Schema = mongoose.Schema;

var simuladoModel = new Schema({
	avaliador : {type : String },
	nomeAvaliador : {type : String},
	cfc :{type: Schema.Types.ObjectId, ref:'Cfc'},
	aluno : {type: Schema.Types.ObjectId, ref:'Aluno'},
	loginAluno : {type: String},
	faltas : [{type: Schema.Types.ObjectId, ref:'Falta'}],
	pontos :  {type : Number},
	data: { type: Date, default: Date.now },
	dataFim: { type: Date}

});

module.exports = mongoose.model('Simulado', simuladoModel);