var colors = require("colors");
var _ = require("lodash");

function parseAndClean(data) {
	var dataframe = [];
	for (let i = 0; i < data.length; i++)
		dataframe.push(data[i].replace(/\"/g, "").split(","));

	// Null values in each column
	nullCount = {}
	for (let j = 0; j < dataframe.length; j++) {
		row = dataframe[j];
		for (let i = 0; i < row.length; i++) {
			value = row[i];
			if (value.length <= 0 || value == NaN || value == "\N") {
				if (nullCount[i])
					nullCount[i] += 1;
				else
					nullCount[i] = 1;
				// Delete null rows
				dataframe.splice(j, 1);
			}
		};
	};
	// console.log("Null Values: ".rainbow, nullCount);
	return dataframe;
}

function dataToArray(data) {
	return data.toString().split("\n")
}

function countDistinct(data, column){
	// var values = new Set();
	// for(let i =0; i<data.length; i++)
	// 	values.add(data[i][column]);
	// return values.size;
	return _.uniqBy(data, column).length;
	// return _.uniqWith(data, (thisValue, otherValue)=>{
	// 	return thisValue[column] == otherValue[column];
	// }).length;
}

module.exports.parseAndClean = parseAndClean;
module.exports.dataToArray = dataToArray;
module.exports.countDistinct = countDistinct;