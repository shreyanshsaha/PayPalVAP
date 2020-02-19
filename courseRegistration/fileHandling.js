const fs = require("fs");
const util = require("util");
const _ = require("lodash");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")

/*
NOTE:
This approach is not ideal for large files,
in case of large files it is smarter to use databases
like mongodb or mysql. I am implementing using files
as that's what we learned in Paypal VAP. For production,
replace the definitions of the functions but keep the function
signature same so that there is less effort to switch to database.
*/

const appendFile = util.promisify(fs.appendFile);
const readFile = util.promisify(fs.readFile);
const renameFile = util.promisify(fs.rename);

function searchFile(filename, value, property = 'username') {
  return new Promise((resolve, reject) => {
    getDataAsArray(filename)
      .then((dataframe) => {
        let objectDetails = _.filter(dataframe, (row) => {
          return row[property] == value;
        });
        // console.log(userDetails);
        if (objectDetails)
          objectDetails = objectDetails[0];
        resolve(objectDetails);
      })
      .catch((err) => reject(new Error(err)));

  });
}

function addToFile(filename, userData, ifNotExists = true, primaryKey = 'username') {
  return new Promise((resolve, reject) => {
    if (!(typeof userData == "string"))
      return reject(new Error("Invalid Data, String expected"));
    if (ifNotExists) {
      readFile(filename, 'utf-8')
        .then((data) => {
          let tempUserData = JSON.parse(userData);
          let lines = data.split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].length <= 0)
              continue;
            if (JSON.parse(lines[i])[primaryKey] == tempUserData[primaryKey]) {
              // console.log(JSON.parse(lines[i])['username'], tempUserData.username)
              throw new Error(primaryKey + " already exists in " + filename);
            }
          }
          return [];
        })
        .then(() => resolve(appendFile(filename, userData + "\n")))
        .catch((err) => reject(new Error(err)));
    }
    else {
      return resolve(appendFile(filename, userData + "\n"));
    }
  });

}

function updateData(filename, newData, checkProperty = 'username') {
  // TODO: Right now username cannot be changed, fix it by adding _id
  return new Promise((resolve, reject) => {
    if (!(typeof newData == "string"))
      return reject(new Error("Invalid Data, String expected"));
    let tempFileName = filename + ".temp";
    readFile(filename, 'utf-8')
      .then((data) => {
        let writeFileStream = fs.createWriteStream(tempFileName);
        if (!writeFileStream)
          throw new Error("Error creating temp file");
        let tempData = JSON.parse(newData);
        let lines = data.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].length <= 0)
            continue;
          if (JSON.parse(lines[i])[checkProperty] != tempData[checkProperty])
            writeFileStream.write(lines[i] + "\n");
          else
            writeFileStream.write(newData + "\n");
        }
        writeFileStream.end();
      })
      .then(() => resolve(renameFile(tempFileName, filename)))
      .then(infoPrint("Updated: "+JSON.parse(newData)[checkProperty]+" in "+filename))
      .catch((err) => reject(new Error(err)));

  });
}

function deleteData(filename, dataToDelete, checkProperty = 'username') {
  return new Promise((resolve, reject) => {
    if (!(typeof dataToDelete == "string"))
      return reject(new Error("Invalid Data, String expected"));
    let tempFileName = filename + ".temp";

    readFile(filename, 'utf-8')
      .then((data) => {
        let writeFileStream = fs.createWriteStream(tempFileName);
        if (!writeFileStream)
          throw new Error("Error creating temp file");

        let tempData = JSON.parse(dataToDelete);
        let lines = data.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].length <= 0)
            continue;
          // console.log(lines);
          // console.log(lines[i], tempData[checkProperty]);
          if (JSON.parse(lines[i])[checkProperty] != tempData[checkProperty]) {
            // console.log(lines[i], tempData[checkProperty]);
            writeFileStream.write(lines[i] + "\n");
          }
        }
        writeFileStream.end();
      })
      .then(() => {
        infoPrint(dataToDelete+" deleted from file "+filename);
        renameFile(tempFileName, filename);
      })
      .catch((err) => reject(new Error(err)))
      .finally(() => resolve(dataToDelete));

  });
}

function getDataAsArray(filename) {
  // TODO: Add only if username doesnt already exists
  return new Promise((resolve, reject) => {
    readFile(filename, 'utf-8')
      .then((data) => {
        let lines = data.split("\n");

        // Remove empty lines if any
        lines = _.filter(lines, (element) => {
          return element.length > 0;
        });

        // Parse all elements to json
        let dataframe = _.map(lines, (element) => {
          return JSON.parse(element);
        });

        resolve(dataframe);
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
}

module.exports.addToFile = addToFile;
module.exports.getDataAsArray = getDataAsArray;
module.exports.updateData = updateData;
module.exports.deleteData = deleteData;
module.exports.searchFile = searchFile;