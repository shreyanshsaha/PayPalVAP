
const { addStudent, registerCourse } = require("./student");
const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");

const { debugPrint, errorPrint, infoPrint } = require("./printFunction")

let studentObj = searchFile("./data/student.dat", "student3");

studentObj
.then((studentObj)=>{
  registerCourse(studentObj, 'CSE0003');
})
.catch((err)=>errorPrint(err));
