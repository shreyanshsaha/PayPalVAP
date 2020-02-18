const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");

const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const { getSlots } = require("./course");

function addStudent(studentObj) {
  if (!studentObj.username || !studentObj.password)
    throw new Error("Username & password cannot be empty");
  return new Promise((resolve, reject) => {
    addToFile("./data/student.dat", JSON.stringify(studentObj))
      .then(() => {
        resolve(studentObj);
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
}

function registerCourse(studentObj, courseID) {
  if (!studentObj.username)
    throw new Error("StudentObj missing username");

  searchFile("./data/course.dat", courseID, 'courseID')
    .then(async (courseObj) => {
      if (courseObj.length <= 0)
        return reject(new Error("CourseID not found to register"));
      if (studentObj.courses.includes(courseID))
        throw new Error("Course already registered");

      let slots = await getSlots(studentObj.courses)
      // console.log(slots, courseObj.slot);
      if (slots.includes(courseObj.slot))
        throw new Error("Slot already booked!");

      // All clear
      studentObj.courses.push(courseID);
      courseObj.students.push(studentObj.username);
      return [studentObj, courseObj];
    })
    .then((combinedData) => {
      updateData("./data/student.dat", JSON.stringify(combinedData[0]));
      return combinedData[1];
    })
    .then((courseObj)=>updateData("./data/course.dat", JSON.stringify(courseObj), 'courseID'))
    .then((info) => infoPrint(info))
    .catch((err) => {
      throw new Error(err.stack);
    });
}

module.exports.addStudent = addStudent;
module.exports.registerCourse = registerCourse;