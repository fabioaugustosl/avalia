var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){
	passport.use(new LocalStrategy({
		usernameField: 'userName',
		passwordField: 'password'
	},
	function(username, password, done){
		// ir no database validar o user
		var user = {
			username: 'fabio',
			password: '123'
		};

		console.log(user);
		console.log('pass : '+ password );
		console.log('user : '+ username );
		if(username === user.username && password === user.password){
			done(null, user);
		} else {
			done(null, false, {message : 'Bad password'});
		}

	}));
};