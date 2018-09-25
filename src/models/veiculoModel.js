var mongoose = require('mongoose'), Schema = mongoose.Schema;

var veiculoModel = new Schema({
	nome : {type : String},
	marca : {type : String, lowercase: true, trim: true},
	ano : {type : Number},
	anoModelo : {type : Number},
	tipo : {type : String, lowercase: true, trim: true}, // moto ou carro
	cfc : {type : String},
	descricao : {type : String}, 
	instrutorResponsavel : {type: Schema.Types.ObjectId, ref:'Avaliador'},
});

module.exports = mongoose.model('Veiculo', veiculoModel);
