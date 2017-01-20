
/*
chrome.storage.sync.get('portalNotice',function(data){
	
});
*/

var str="";

window.onload = function onLoadListener(){
	getScreenShotFiles();
};


var getScreenShotFiles = function(){
	str = "";
	var httpPost = new XMLHttpRequest(),
	path = "http://ec2-52-79-155-110.ap-northeast-2.compute.amazonaws.com:3000/getScreenShotLists/";
   	// Set callback function
   	httpPost.onreadystatechange = function(err) {
   		if (httpPost.readyState == 4 && httpPost.status == 200){
   			var res = httpPost.responseText;
   			var imgJson = JSON.parse(res);
   			for(i = 0 ; i < imgJson.length ; i++){
   				str += "<div id= 'box" + i + "' class=\"screenshot\"><img src = \"" + imgJson[i].imgURL + "\" height= \"150\" width=\"300\" > </div>";
   			}
   			console.log(str);
			document.getElementById("container").innerHTML = str; 
   		} else {
   			console.log(err);
   		}
   	};
    // Set the content type of the request to json since that's what's being sent
    httpPost.open("GET", path, true);
    httpPost.setRequestHeader('Content-Type', 'application/json');
    httpPost.send();
};

var takeScreenShot = function(){
	
}