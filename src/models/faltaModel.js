var mongoose = require('mongoose'), Schema = mongoose.Schema;

var faltaModel = new Schema({
	id : {type : String },
	cfc : {type : String},
	categoria : {type : String},  //A, B, C, D, E
	tipo : {type : String},  //E (Eliminatoria), G (Grave), M (Média), L (Leve)
	nome : {type : String},
	descricao : {type : String}
});

module.exports = mongoose.model('Falta', faltaModel);
