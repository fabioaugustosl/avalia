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
	db = mongoose.connect('mongodb://localhost/db_avalia');
}

var port = process.env.PORT || 3000;

// diretorios publicos
app.use(express.static('public'));

//middlaware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'library'}));

require('./src/config/passport')(app);


app.set('views','./src/views');

// template engine
app.set('view engine', 'ejs');


//rotas
var usuRouter = require('./src/routes/usuariosRoutes');
var alunoRouter = require('./src/routes/alunoRoutes');
var authRouter = require('./src/routes/authRoutes');
app.use('/api/usuarios/v1', usuRouter);
app.use('/api/alunos/v1', alunoRouter);
app.use('/api/auth', authRouter);

app.get('/', function(req, res){
	res.render('index');
});

// start servidor
app.listen(port, function(err){
	console.log('running avalia on '+port);
});


module.exports = app;

