
const _ = require("lodash");

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
      if (courseObj == undefined || courseObj.length <= 0)
        throw new Error("CourseID not found to register");
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
    .then((courseObj) => updateData("./data/course.dat", JSON.stringify(courseObj), 'courseID'))
    .then((info) => infoPrint(info))
    .catch((err) => {
      throw new Error(err.stack);
    });
}

function deleteStudent(studentObj) {
  if (!studentObj.username || !studentObj.password)
    throw new Error("Username & password cannot be empty");

  return deleteData("./data/student.dat", JSON.stringify(studentObj))
  .then(async () => {
    let courses = studentObj.courses;
    for (let i = 0; i < courses.length; i++) {
      let courseObj = await searchFile("./data/course.dat", courses[i], 'courseID');
      if (!courseObj)
        reject(new Error("Course " + courses[i] + " cannot be found for student: " + studentObj.username));
      // console.log(courseObj.students);
      _.remove(courseObj.students, (element) => {
        return element == studentObj.username;
      });
      try{
        // console.log(courseObj);
        await updateData("./data/course.dat", JSON.stringify(courseObj), 'courseID');
      } catch(err){
        throw new Error(err.stack);
      }
    }

    return "Removed successfully";
  })
  .then(debugPrint)
  .catch((err)=>{throw new Error(err.stack)});
}

function dropCourse(studentObj, courseID){
  if(!studentObj.username || !courseID)
    throw new Error("Username and courseID required to delete course");

  return searchFile("./data/course.dat", courseID, 'courseID')
  .then((courseObj)=>{
    // remove course from student
    _.remove(studentObj.courses, (element)=>{
      return element == courseID;
    });

    // remove student from course
    _.remove(courseObj.students, (element)=>{
      return element==studentObj.username;
    });

    return [studentObj, courseObj];
  })
  .then(async (objList)=>{
    await updateData("./data/student.dat", JSON.stringify(objList[0]));
    return objList[1];
  })
  .then(courseObj=>updateData("./data/course.dat", JSON.stringify(courseObj), 'courseID'))
  .then(infoPrint("Course "+courseID+" dropped for student "+studentObj.username))
  .catch((err)=>{throw new Error(err.stack)})
}

module.exports.addStudent = addStudent;
module.exports.registerCourse = registerCourse;
module.exports.deleteStudent = deleteStudent;
module.exports.dropCourse = dropCourse;