var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');


var app = express();

var db;
if(process.env.ENV == 'Test'){
	db = mongoose.connect('mongodb://localhost/db_avalia_tests');
} else {
	db = mongoose.connect('mongodb://localhost/db_avalia_novo');
    //db = mongoose.connect('mongodb://some-mongo/db_avalia_novo');
}

var port = process.env.PORT || 3000;

// diretorios publicos
//app.use(express.static('public'));

//middlaware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'library'}));


// cors
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

require('./src/config/passport')(app);

app.set('views','./src/views');


//rotas
var exeRouter = require('./src/routes/exercicioRoutes');
var alunoRouter = require('./src/routes/alunoRoutes');
var cfcRouter = require('./src/routes/cfcRoutes');
var avaliadorRouter = require('./src/routes/avaliadorRoutes');
var avaliacaoRouter = require('./src/routes/avaliacaoRoutes');
var infracaoRouter = require('./src/routes/infracaoRoutes');
var aulaRouter = require('./src/routes/aulaRoutes');
var cfcAutenticadorRouter = require('./src/routes/cfcAutenticadorRoutes');
var instrutorAutenticadorRouter = require('./src/routes/instrutorAutenticadorRoutes');
var veiculoRouter = require('./src/routes/veiculoRoutes');
var dashRouter = require('./src/routes/dashRoutes');

//var authRouter = require('./src/routes/authRoutes');
app.use('/api/exercicio/v1', exeRouter);
app.use('/api/aluno/v1', alunoRouter);
app.use('/api/cfc/v1', cfcRouter);
app.use('/api/cfcAutenticacao/v1', cfcAutenticadorRouter);
app.use('/api/instrutorAutenticacao/v1', instrutorAutenticadorRouter);
app.use('/api/avaliador/v1', avaliadorRouter);
app.use('/api/avaliacao/v1', avaliacaoRouter);
app.use('/api/infracao/v1', infracaoRouter);
app.use('/api/aula/v1', aulaRouter);
app.use('/api/dashAluno/v1', dashRouter);
app.use('/api/veiculo/v1', veiculoRouter);

app.get('/', function(req, res){
	res.render('index');
});

// start servidor
app.listen(port, function(err){
	console.log('running avalia on '+port);
});


module.exports = app;

