const express = require('express');
const mongoose = require('mongoose');
const { db } = require('./config/keys.js');
const bodyparser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

var app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/', (req, res) => {
	res.send('Hello');
});
//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport.js')(passport);

//users routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

mongoose
	.connect(db, {
		useNewUrlParser: true
	})
	.then(() => {
		console.log('connection successful');
	})
	.catch((e) => {
		console.log(e);
	});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
