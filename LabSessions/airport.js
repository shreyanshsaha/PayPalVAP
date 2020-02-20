const fs = require("fs"),
	http = require("http"),
	_ = require("lodash");

const { dataToArray, parseAndClean, countDistinct } = require("./process");
const { searchByAirportName, display } = require("./search")

const columns = [
	'id',
	'name',
	'city',
	'country',
	'iata',
	'icao',
	'lat',
	'lon',
	'alt',
	'timezone',
	'dst',
	'tz',

]

fs.readFile("./airports.csv", function (err, data) {
	var data = dataToArray(data);
	console.log("Data rows:", data.length);

	var dataframe = parseAndClean(data);
	console.log("Data rows after cleaning:", dataframe.length);
	for (let i = 1; i < columns.length; i++)
		console.log(`Column ${columns[i]} unique values count: `, countDistinct(dataframe, i))
	display(dataframe[1])

	console.log("Searching by airport name:", searchByAirportName(dataframe, "Madang Airport"));


	onComplete();
});


// setInterval(()=>{}, 10);

function onComplete() {

	a = [1, 2, 3, 4];
	b = [3, 4, 5, 6];
	c = [5, 6, 7, 8]

	d = _.union(a, b, c);
	// console.log(_.add([a, b]));
	console.log(d);

	console.log(_.filter(a, (data) => {
		return data > 2;
	}));

	var myArray = [{
		id: '17bce1148',
		name: 'shreyansh',
		data: '13124'
	}, {
		id: '17bce1148',
		name: 'shreyaqnsh',
		data: '131245'
	}]

	var result = _.uniqWith(myArray, function (arrVal, othVal) {
		return arrVal.id === othVal.id;
	});

	console.log(result);

	var result = _.uniqBy(myArray, 'id');

	console.log(result);

	var result = _.intersectionBy(a, b, (data) => {
		return data * 0;
	});

	console.log(result);


	result = _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
	console.log(result);


	function greet(marker) {
		return {
			print: function (person) {
				console.log(marker + "-" + person);
			}
		}
	}

	var greeter = greet("*");
	greeter.print("Geralt");
	greeter.print("Dandelion");
}