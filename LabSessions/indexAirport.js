const http = require("http");
const fs = require("fs");
const events = require("events");

const { dataToArray, parseAndClean, countDistinct } = require("./process");
const {searchByCityName} = require("./search");

var eventEmitter = new events.EventEmitter();


function getColumnn(data, column) {
	var data = dataToArray(data);
	var dataframe = parseAndClean(data);
	var airports = [];
	for (let i = 0; i < dataframe.length; i++) {
		airports.push(dataframe[i][column]);
	}
	return airports;
}

var server = http.createServer(function (req, res) {
	res.setHeader("Content-Type", "application/json");

	eventEmitter.on('complete', function (data) {
		return res.end(JSON.stringify({data}));
	});

	if (req.url == "/airport") {
		fs.readFile("./airports.csv", function (err, data) {
			airports = getColumnn(data, 1);
			 eventEmitter.emit('complete', airports);
		});
	}
	else if (req.url == "/cities") {
		fs.readFile("./airports.csv", function (err, data) {
			cities = getColumnn(data, 2);
			return eventEmitter.emit('complete', cities);
		});
	}
	else if (/cities\/[a-zA-Z]*$/.test(req.url)) {
		fs.readFile("./airports.csv", function (err, data) {
			let city = /[a-zA-Z]*$/.exec(req.url)[0];
			let details = searchByCityName(parseAndClean(dataToArray(data)), city)

			return eventEmitter.emit('complete', details);
		});
	}
	else {
		res.end("Invalid path");
	}
});

console.log("Server running");
server.listen(8000);