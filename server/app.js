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

let CanvasImage = require('./canvasImage')

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

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

var server = app.listen(port);
console.log('The App runs on port ' + port);

app.get('/', function (req, res) {
  screenshotlist.find(function (err, shots) {
    for(let i = 0; i< shots.length; i++){
      console.log(shots[i].imgURL)
    }
    res.render('index', {
      screenshotList: shots
    })
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

app.post('/savePosition/:imgURL/:posX/:posY', function(req, res) {
  let ci = new CanvasImage({
    imgURL: decodeURIComponent(req.params.imgURL),
    posX: req.params.posX,
    posY: req.params.posY
  })
  ci.save(function(err){
    if(err){
      console.log('save failed')
      res.send({result: 'failed'})
    } else {
      console.log('position save successful')
      res.send({result: 'success'})
    }
  })
})

app.put('/updatePosition/:imgURL/:posX/:posY', function (req, res) {
  CanvasImage.findOneAndUpdate(
    {
      imgURL: decodeURIComponent(req.params.imgURL)
    },
    {
      posX: req.params.posX,
      posY: req.params.posY
    }, 
    function (err) {
      if (err) {
        console.log('save failed')
        res.send({ result: 'failed' })
      } else {
      console.log('position save successful')
      res.send({result: 'success'})
      }
    }
  )
})

app.delete('/deletePosition/:imgURL', function (req, res) {
  CanvasImage.remove(
    {
      imgURL: decodeURIComponent(req.params.imgURL)
    },
    function (err) {
      if (err) {
        console.log('remove failed')
        res.send({ result: 'failed' })
      } else {
      console.log('position save successful')
      res.send({result: 'success'})
      }
    }
  )
})

app.get('/getPosition', function(req, res) {
  CanvasImage.find(function (err, list) {
    if (err) {
      console.log(err)
      return res.status(500).json({error: 'database failure'});
    }
    if(!list){
      console.log(err);
      return res.status(500).json({error: 'cannot query'});
    }
    let newList = list.map(function (item) {
      return {
        imgURL: encodeURIComponent(item.imgURL),
        posX: item.posX,
        posY: item.posY
      }
    })
    console.log(newList)
    res.json(newList)
  })
})

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
