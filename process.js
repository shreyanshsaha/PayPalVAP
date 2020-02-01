var fs = require("fs");

fs.readFile("./airports.dat", function(err, data){
	var data = data.toString().split("\n");
	console.log("Data rows:", data.length);

	var dataframe = [];
	for(let i=0; i<data.length; i++)
		dataframe.push(data[i].replace(/\"/g,"").split(","));
	console.log("Row Example: ", dataframe[0]);

	// Null values in each column
	nullCount={}
	for(let j=0;  j<dataframe.length; j++){
		row = dataframe[j];
		for(let i =0; i<row.length; i++){
			value=row[i];
			if(value.length<=0 || value==NaN || value=="\N"){
				if(nullCount[i])
					nullCount[i]+=1;
				else
					nullCount[i]=1;
				// Delete null rows
				dataframe.splice(j, 1);
			}
		};
	};
	

	console.log("Null Values: ", nullCount);
	console.log("Data rows:", dataframe.length);





});