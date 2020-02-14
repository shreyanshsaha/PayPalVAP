var format = require("string-format");
var colors = require("colors");
var _ = require("lodash");

format.extend(String.prototype, {})

function searchByAirportName(data, name){
	return _.filter(data, (value)=>{
		return value[1].toLowerCase() == name.toLowerCase();
	});
}

function searchByCityName(data, name){
	return _.filter(data, (value)=>{
		return value[2].toLowerCase() == name.toLowerCase();
	});
}

function display(data){
	console.log('Name: {}, City: {}, Country: {}'.format(data[1], data[2], data[3]));
}

module.exports.searchByAirportName = searchByAirportName;
module.exports.searchByCityName = searchByCityName;
module.exports.display = display;