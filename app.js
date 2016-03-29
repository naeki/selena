var express = require('express');
var app = express();
var expressWs = require('express-ws')(app)
var exec = require('child_process').fork;
var env = require('./selena/env');





app.set('view engine', 'jade');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
});





app.ws('/', function(ws, req) {

    ws.on('message', function(msg) {
    	// env.url = msg;

    	// require('./run.js')
        var child = exec('selena/run.js', {
		  	env : {url : msg}
		});

		child.on('message', function(data){
			ws.send(data)
		});
    });
});

app.listen(8124, function () {
});