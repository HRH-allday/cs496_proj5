
var img_write_path = '/public/images/';
var img_access_path = '/static/images/';
var img_file_prefix = 'img_';


function setScreenshotUrl(url, currenturl, coords) {
  let statusText = 'startX ' + coords.startX + ' startY ' + coords.startY + ' endX ' + coords.endX + ' endY ' + coords.endY
  window.alert(statusText)
  let canvas = document.getElementById('test')
  let ctx = canvas.getContext('2d')
  let img = new Image()
  let startX = coords.startX
  let startY = coords.startY
  let sWidth = (coords.endX - coords.startX)>0?coords.endX - coords.startX:-(coords.endX - coords.startX)
  let sHeight = (coords.endY - coords.startY)>0?coords.endY - coords.startY:-(coords.endY - coords.startY)
  canvas.width = sWidth
  canvas.height = sHeight

  img.addEventListener('load', function () {
    ctx.drawImage(img, startX, startY, sWidth, sHeight, 0, 0, sWidth, sHeight)
     var dataURL = canvas.toDataURL("image/png");
     var img64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
     sendBase64ToServer(img64, currenturl);
  })
  img.src = url


  

}

var sendBase64ToServer = function(base64, currenturl){
  console.log(currenturl);
    var httpPost = new XMLHttpRequest(),
        path = "http://ec2-52-79-155-110.ap-northeast-2.compute.amazonaws.com:3000/uploadImage/",
        data = JSON.stringify({image: base64, ref: currenturl});
    httpPost.onreadystatechange = function(err) {
            if (httpPost.readyState == 4 && httpPost.status == 200){
                console.log(httpPost.responseText);
            } else {
                console.log(err);
            }
        };
    // Set the content type of the request to json since that's what's being sent
    httpPost.open("POST", path, true);
    httpPost.setRequestHeader('Content-Type', 'application/json');
    httpPost.send(data);
};