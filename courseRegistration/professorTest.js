const { addProfessor, createCourse, deregisterCourse, deleteProfessor } = require("./professor");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");

let professorObj = {
  username: "P0001",
  password: "professor@123",
  name: "Professor 1",
  courses: [],
  type: "professor"
}

let courseObj = {
  courseID: "CSE0002",
  name: "Basic Programming in C",
  slot: "A",
}

// createCourse(professorObj, courseObj)
// .then(()=>{
//   console.log("Course Added");
// })
// .catch((err)=>errorPrint(err));

searchFile("./data/professor.dat", 'P0001')
.then(professorObj=>deleteProfessor(professorObj))
// .then(console.log)
.catch(errorPrint);