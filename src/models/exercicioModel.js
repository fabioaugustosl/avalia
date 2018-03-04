var mongoose = require('mongoose'), Schema = mongoose.Schema;

var exercicioModel = new Schema({
	id : {type : String },
	cfc : {type : String},
	categoria : {type : String},  //A, B, C, D, E
	nome : {type : String},
	descricao : {type : String}
});

module.exports = mongoose.model('Exercicio', exercicioModel);
