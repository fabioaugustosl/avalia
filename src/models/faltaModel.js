var mongoose = require('mongoose'), Schema = mongoose.Schema;

var faltaModel = new Schema({
	id : {type : String },
	cfc : {type : String},
	categoria : {type : String},  //A, B, C, D, E
	nome : {type : String},
	descricao : {type : String}
});

module.exports = mongoose.model('Falta', faltaModel);
