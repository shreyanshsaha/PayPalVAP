const fs = require("fs");
const util = require("util");
const _ = require("lodash");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const crypto = require("crypto");

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

async function getDataAsArray(filename) {
  return new Promise((resolve, reject) => {
    try {
      let data = await readFile(filename, 'utf-8');
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
    }
    catch (err) {
      reject(err);
    }
  });
}

async function searchFile(filename, value, property = 'username', returnOne = true) {
  return new Promise((resolve, reject) => {
    try {
      let dataframe = await getDataAsArray(filename);

      let objectDetails = _.filter(dataframe, (row) => {
        return row[property] == value;
      });

      if (objectDetails && returnOne)
        objectDetails = objectDetails[0];

      resolve(objectDetails);
    }
    catch (err) {
      reject(err);
    }
  });
}

async function addToFile(filename, userData, primaryKey = "_id") {
  return new Promise((resolve, reject) => {
    if (!(typeof userData == "string"))
      return reject(new Error("Invalid Data, String expected"));
    if (!(typeof primaryKey == "string"))
      return reject(new Error("Invalid key, String expected"));

    try {
      let tempUserData = JSON.parse(userData);
      let _id = crypto.createHash('md5').update(userData).digest("hex");

      tempUserData.createdOn = Date.now();
      tempUserData._id = _id;

      // Checking if user already exists
      // TODO: Optimize this
      let data = readFile(filename, 'utf-8');
      let lines = data.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length <= 0)
          continue;
        if (JSON.parse(lines[i])[primaryKey] == tempUserData[primaryKey]) {
          return reject(new Error(primaryKey + " already exists"));
        }
      }

      await appendFile(filename, tempUserData + "\n")
      resolve(JSON.parse(tempUserData));
    }
    catch (err) {
      reject(err);
    }
  });
}

async function updateData(filename, newData, checkProperty = '_id') {
  return new Promise((resolve, reject) => {

    if (!(typeof newData == "string"))
      return reject(new Error("Invalid Data, String expected"));

    let tempFileName = filename + ".temp";

    try {

      let data = await readFile(filename, 'utf-8')

      let writeFileStream = fs.createWriteStream(tempFileName);
      if (!writeFileStream)
        return reject(new Error("Error creating temp file"));

      let tempData = JSON.parse(newData);
      let lines = data.split("\n");

      // Updating files by rewriting
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length <= 0)
          continue;
        if (JSON.parse(lines[i])[checkProperty] != tempData[checkProperty])
          writeFileStream.write(lines[i] + "\n");
        else
          writeFileStream.write(newData + "\n");
      }

      writeFileStream.end();


      renameFile(tempFileName, filename)
        .then(() => {
          infoPrint("Updated: " + JSON.parse(newData)[checkProperty] + " in " + filename);
          return resolve(newData);
        })
        .catch((err) => reject(new Error(err)));
    }
    catch (err) {
      reject(err);
    }


  });
}

async function deleteData(filename, dataToDelete, checkProperty = '_id') {
  return new Promise((resolve, reject) => {
    if (!(typeof dataToDelete == "string"))
      return reject(new Error("Invalid Data, String expected"));

    let tempFileName = filename + ".temp";

    try {

      let data = await readFile(filename, 'utf-8')

      let writeFileStream = fs.createWriteStream(tempFileName);
      if (!writeFileStream)
        return reject(new Error("Error creating temp file"));

      let tempData = JSON.parse(dataToDelete);
      if (!tempData._id)
        return reject(new Error("_id required to delete"));

      let lines = data.split("\n");

      // Delete file by rewriting
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length <= 0)
          continue;
        if (JSON.parse(lines[i])[checkProperty] != tempData[checkProperty])
          writeFileStream.write(lines[i] + "\n");
      }

      writeFileStream.end();

      infoPrint(dataToDelete + " deleted from file " + filename);

      renameFile(tempFileName, filename)
        .then(() => resolve(dataToDelete))
        .catch((err) => reject(new Error(err)));
    }
    catch (err) {
      reject(err);
    }

  });
}

module.exports.addToFile = addToFile;
module.exports.getDataAsArray = getDataAsArray;
module.exports.updateData = updateData;
module.exports.deleteData = deleteData;
module.exports.searchFile = searchFile;