
const { 
  addToFile, getDataAsArray, 
  updateData, deleteData, searchFile 
} = require("./fileHandling");

let student = {
  "username": "student4",
  "password": "password1",
  "name": "student fullname",
  "student": "As Student",
}

let studentNew = {
  "username": "student4",
  "password": "password1",
  "name": "student fullname new 3",
  "student": "As Student",
}

// Add another data
// addToFile("./data/student.dat", JSON.stringify(student))
//   .catch((err) => console.log(err))
//   .then(() => console.log("Added to file"))
//   .then(() => updateData("./data/student.dat", JSON.stringify(studentNew)))
//   .then(() => console.log("Updated Student"))
//   .catch((err) => console.log(err))
//   .then(() => deleteData("./data/student.dat", JSON.stringify(studentNew)))
//   .then(() => console.log("Deleted Student"))
//   .catch((err) => console.log(err));

// Get complete data
getDataAsArray("./data/student.dat")
  .then((data) => console.log(data))
  .then(() => searchFile("./data/student.dat", 'student1'))
  .then((data)=>console.log(data))
  .catch((err) => console.log(err));