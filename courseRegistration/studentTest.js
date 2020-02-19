
const { addStudent, registerCourse, deleteStudent, dropCourse } = require("./student");
const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");

const { debugPrint, errorPrint, infoPrint } = require("./printFunction")

// let studentObj = {
//   username: "student3",
//   name:" Student 3",
//   password:"password@123",
//   courses:[],
//   type:"student",
//   student:"As student",
// }

// addStudent(studentObj);
// searchFile("./data/student.dat", "student3")
// .then((studentObj)=>{
//   dropCourse(studentObj, 'CSE0001');
// })
// .catch(errorPrint);

// addStudent(studentObj)
// searchFile("./data/student.dat", "student3")
// .then((studentObj)=>{
//   registerCourse(studentObj, 'CSE0001');
// })
// .catch(errorPrint);
// studentObj
// .then(deleteStudent)
// .catch(errorPrint);