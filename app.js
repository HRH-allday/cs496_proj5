var express = require('express');
var request = require('request');
var app = express();
var port = process.env.PORT || 3000;
var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var json = require('json');
var mongoose = require("mongoose");
var mongodb = require('mongodb');
var fs = require('fs');
var screenshotlist = require('/home/ubuntu/screenshot/screenshot_list');


var http_protocol = 'http://';
var server_address = '52.79.155.110:3000';
var img_write_path = '/public/images/';
var img_access_path = '/static/images/';

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
  // CONNECTED TO MONGODB SERVER
  console.log("Connected to mongod server");
});


mongoose.connect('mongodb://localhost/proj5');

// Configuration
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/public'));
//app.use(bodyParser());
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

var server = app.listen(port);
console.log('The App runs on port ' + port);

app.get('/', function (req, res) {
  fs.readFile('index.html', function (error, data) { // index.html 파일 로드 .
    if (error) {
      console.log(error);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' }); // Head Type 설정 .
      res.end(data); // 로드 html response .
    } 
  })
})

app.get('/getScreenShotLists', function(req, res){
  console.log('entered');
  screenshotlist.find(function(err, shots){
    res.send(shots);
  });
});

app.post('/uploadImage', function (req, res) {
  var json = req.body;
  console.log(json);
  var url = saveImageSync(json.image);
  console.log(url);
  var screenshot = new screenshotlist({
          reference: json.ref,
          imgURL: url
            
          });
  screenshot.save(function(err){
    if(err) console.log('some error occured..' + err);
    else{
      console.log('successfully saved screenshot!');
      res.send({result : 'success'});
    }
  });
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
  var filepath = __dirname + img_write_path + filename;
  console.log(filepath);
  console.log(decodeBase64Image(base64Data).data);
  fs.writeFileSync(filepath, imageBuffer.data);
  console.log('D');
  var url = http_protocol + server_address + img_access_path + filename;

  return url;
}
