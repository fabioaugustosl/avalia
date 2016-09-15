var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();


var port = process.env.PORT || 5000;

// diretorios publicos
app.use(express.static('public'));

//middlaware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
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

