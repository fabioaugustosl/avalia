var mongoose = require('mongoose'), Schema = mongoose.Schema;

var veiculoModel = new Schema({
	nome : {type : String},
	placa : {type : String, uppercase: true, trim: true},
	marca : {type : String, lowercase: true, trim: true},
	ano : {type : Number},
	anoModelo : {type : Number},
	tipo : {type : String, lowercase: true, trim: true}, // moto ou carro
	cfc : {type : String},
	descricao : {type : String}, 
	idInstrutorResponsavel : {type : String},
	nomeInstrutorResponsavel : {type : String}
});

module.exports = mongoose.model('Veiculo', veiculoModel);
