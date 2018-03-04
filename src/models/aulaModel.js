var mongoose = require('mongoose'), Schema = mongoose.Schema;

var aulaModel = new Schema({
	id : {type : String },
	cfc : {type : String},
	aluno : {type : String},
	instrutor : {type : String},
	periodo : {type : String}, // MANHA, TARDE e NOITE
	data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Aula', aulaModel);
