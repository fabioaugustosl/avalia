var express = require('express');
var authRouter = express.Router();
var passport = require('passport');


	authRouter.route('/signUp')
				.post(function(req, res){
					console.log('fabio');
					console.log(req.body);
					req.login(req.body, function(){
						res.redirect('/auth/profile');
					});
				});

	authRouter.route('/signIn')
				.post(passport.authenticate('local', {
						failureRedirect : '/'
				}), function(req, res){
					res.redirect('/auth/profile');
				});

	authRouter.route('/profile')
				.all(function(req, res, next){
					if(!req.user){
						res.redirect('/');
					}
					next();
				})
				.get(function(req, res){
					res.json(req.user);
				});



module.exports = authRouter;