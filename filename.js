
function hello(name) {
	console.log("Hello", name);
}

// hello("John");
// hello("Shreyansh");

var fs = require("fs");

filename1 = "file1.txt";
filename2 = "file2.txt";


// fs.readFile(filename1, function (err, data) {
// 	console.log(data.toString());
// });

// console.log("File 1 read");

// fs.readFile(filename2, function (err, data) {
// 	console.log(data.toString());
// });

// console.log("File 2 read");


var a = 0;
var data1;
var data2;
function onComplete(){
  if(a==2){
		console.log("Both files read!");
		console.log(data1);
		console.log(data2);
  }
}

fs.readFile(filename1, function (err, data) {
  data1 = data.toString();
  a+=1;
  onComplete();
});

fs.readFile(filename2, function (err, data) {
  data2=data.toString();
  a+=1;
  onComplete();
});