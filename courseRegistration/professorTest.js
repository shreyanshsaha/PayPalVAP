const { addProfessor, createCourse } = require("./professor");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")

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

createCourse(professorObj, courseObj)
.then(()=>{
  console.log("Course Added");
})
.catch((err)=>errorPrint(err));