
function hello(name) {
	console.log("Hello", name);
}

hello("John");
hello("Shreyansh");

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

console.log("File 2 read");


var hello = require("./hello");
hello.a(hello.b);