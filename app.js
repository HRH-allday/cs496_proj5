var express  = require('express');
var request = require('request');
var app      = express();
var port     = process.env.PORT || 3000;
var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var json = require('json');
var mongoose = require("mongoose");
var mongodb = require('mongodb');
var fs = require('fs');


var http_protocol = 'http://';
var server_address = '52.79.155.110:3000';
var img_write_path = __dirname + '/images/';

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
		    // CONNECTED TO MONGODB SERVER
		    console.log("Connected to mongod server");
		});


mongoose.connect('mongodb://localhost/proj5');

// Configuration
app.use(express.static(__dirname + '/public'));
//app.use(bodyParser());
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var server = app.listen(port);
console.log('The App runs on port ' + port);


app.post('/uploadImage', function(req, res){
	var json = req.body;
	console.log(json);
	var url = saveImageSync(json.image);
	console.log(url);
});


function decodeBase64Image(dataString) {
  var response = {};

  response.data = new Buffer(dataString, 'base64');

  return response;
}


function saveImageSync(base64Data) {
  console.log('BASE64DATA : ' + base64Data)

  var imageBuffer = decodeBase64Image(base64Data.toString());
  var filename = "img_" + Date.now() + ".jpg";
  var filepath = img_write_path + filename;
  console.log(filepath);
  console.log(decodeBase64Image(base64Data).data);
  fs.writeFileSync(filepath, imageBuffer.data);
  console.log('D');
  var url = http_protocol + server_address + filepath;

  return url; 
}