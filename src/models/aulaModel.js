var mongoose = require('mongoose'), Schema = mongoose.Schema;

var aulaModel = new Schema({
	cfc : {type : String},
	aluno : {type : String},
	instrutor : {type : String},
	periodo : {type : String}, // MANHA, TARDE e NOITE
	kmInicio : {type : Number},
	kmFim : {type : Number},
	data: { type: Date, default: Date.now },
	dataFim: { type: Date }
});

module.exports = mongoose.model('Aula', aulaModel);
