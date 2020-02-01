const events = require("events");
const fs = require("fs");
var eventEmitter = new events.EventEmitter();


// eventEmitter.on('read', (file)=>{
// 	console.log("Log 1: ", file);
// });

// eventEmitter.on('read', (file)=>{
// 	console.log("Log 2: ", file);
// });

// eventEmitter.on('connect', (file, serverID)=>{
// 	console.log("Connect event: ", file, serverID);
// });

// eventEmitter.emit('read', 'docs/file.txt');
// eventEmitter.emit('connect', 'server', 1);



let readStream = fs.createReadStream("airports.csv", 'utf-8');
var data="";
var i =1;
readStream.on("data", function(chunk){
	data+=chunk;
	console.log("Chunk: "+i);
	i+=1;
}).on("end", function(){
	console.log("Completed");
});

