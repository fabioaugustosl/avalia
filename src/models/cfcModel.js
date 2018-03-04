var mongoose = require('mongoose'), Schema = mongoose.Schema;

var Falta = new Schema({
	id : {type : String },
	categoria : {type : String},  //A, B, C, D, E
	nome : {type : String}	
});


var Exercicio = new Schema({
	id : {type : String },
	categoria : {type : String},  //A, B, C, D, E
	nome : {type : String}
});


var cfcModel = new Schema({
	id : {type : String },
	nome : {type : String},
	email : {type : String},
	senha : {type : String},
	telefone : {type : String},
	endereco : {type : String},
	cidade : {type : String},
	estado : {type : String},
	dataCriacao: { type: Date, default: Date.now },
	exercicios: [Exercicio],
	faltas: [Falta]
});

module.exports = mongoose.model('Cfc', cfcModel);

