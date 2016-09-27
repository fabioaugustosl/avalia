var mongoose = require('mongoose'), Schema = mongoose.Schema;


var cfcModel = new Schema({
	id : {type : Number },
	nome : {type : String},
	email : {type : String},
	telefone : {type : String},
	cidade : {type : String},
	dataCriacao: { type: Date, default: Date.now },
	exercicios: [{type:String}]
});

module.exports = mongoose.model('Cfc', cfcModel);
