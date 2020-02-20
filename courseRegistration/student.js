
const _ = require("lodash");

const {
  addToFile, getDataAsArray,
  updateData, deleteData, searchFile
} = require("./fileHandling");

const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const { getSlots } = require("./course");


function hashPassword(str) {
  return escape(str);
}

function addStudent(studentObj) {
  if (!studentObj.username || !studentObj.password)
    throw new Error("Username & password cannot be empty");
  return new Promise((resolve, reject) => {
    addToFile("./data/student.dat", JSON.stringify(studentObj), "username")
      .then((newStudentObj) => {
        resolve(newStudentObj);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function registerCourse(studentObj, courseID, professorID) {
  if (!studentObj.username || !courseID || !professorID)
    throw new Error("StudentObj missing username or courseID or professorID missing");

  return searchFile("./data/course.dat", courseID, "_id", true)
    .then(async (courseObj) => {

      infoPrint("Registering course " + courseID + " for student " + studentObj.username + " by professor " + professorID);
      if (courseObj == undefined)
        throw new Error("CourseID not found to register");
      // courseObj = JSON.parse(courseObj);

      console.log("Course find: ", _.find(studentObj.courseDetails, {"courseID": courseObj.courseID}));

      if (_.find(studentObj.courseDetails, {"courseID": courseObj.courseID})!=undefined)
        throw new Error("Course already registered");


      let slots = await getSlots(studentObj.courses)
      if (slots.includes(courseObj.slot))
        throw new Error("Slot already booked!");

      // All clear
      studentObj.courses.push(courseObj._id);
      courseObj.students.push(studentObj._id);

      // copy object
      newStudentObj = {
        "username": studentObj.username,
        "password": studentObj.password,
        "name": studentObj.name,
        "courses": studentObj.courses,
        "type": studentObj.type,
        "_id": studentObj._id,
        "createdOn":studentObj.createdOn,
      }

      return [newStudentObj, courseObj];
    })
    .then((combinedData) => {
      updateData("./data/student.dat", JSON.stringify(combinedData[0]));
      return combinedData[1];
    })
    .then((courseObj) => {
      updateData("./data/course.dat", JSON.stringify(courseObj), '_id')
      studentObj.slots.push(courseObj.slot);
      return courseObj;
    })
    .catch((err) => {
      throw new Error(err);
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
        try {
          // console.log(courseObj);
          await updateData("./data/course.dat", JSON.stringify(courseObj), 'courseID');
        } catch (err) {
          throw new Error(err.stack);
        }
      }

      return "Removed successfully";
    })
    .then(debugPrint)
    .catch((err) => { throw new Error(err.stack) });
}

function dropCourse(studentObj, courseID) {
  // console.log(studentObj, courseID);
  if (!studentObj.username || !courseID)
    throw new Error("Username and courseID required to delete course");

  if (!studentObj._id)
    throw new Error("Student obj required _id");

  // Make a copy of the object
  newStudentObj = {
    "username": studentObj.username,
    "password": studentObj.password,
    "name": studentObj.name,
    "courses": studentObj.courses,
    "type": studentObj.type,
    "_id": studentObj._id,
    "createdOn":studentObj.createdOn,
  }

  return searchFile("./data/course.dat", courseID, '_id')
    .then((courseObj) => {
      // remove course from student
      _.remove(newStudentObj.courses, (element) => {
        return element == courseID;
      });

      // remove student from course
      _.remove(newStudentObj.students, (element) => {
        return element == studentObj._id;
      });

      return [newStudentObj, courseObj];
    })
    //TODO: Remove this
    .then(async (objList) => {
      await updateData("./data/student.dat", JSON.stringify(objList[0]));
      await updateData("./data/course.dat", JSON.stringify(objList[1]))
      studentObj.courses = newStudentObj.courses;
      _.remove(studentObj.courseDetails, (element)=>{
        return element._id == courseID;
      });
      _.remove(studentObj.slots, (element)=>{
        return element == objList[1].slot;
      });
      return studentObj;
    })
    
    // .then(infoPrint("Course " + courseID + " dropped for student " + studentObj.username))
    .catch((err) => { throw new Error(err.stack) })
}

function authenticateStudent(username, password) {
  if (!username || !password)
    throw new Error("Username or password empty");
  else if (username.length < 5 || password.length < 6)
    throw new Error("Invalid length input");
  console.log(username.toLowerCase(), password);
  return getDataAsArray("./data/student.dat")
    .then((studentArray) => {
      let userDetails = _.find(studentArray, { 'username': username.toLowerCase(), 'password': password });
      if (!userDetails)
        throw new Error("Username and password not found");
      debugPrint("Authenticated user: " + userDetails.username);
      return userDetails;
    });
}

module.exports.addStudent = addStudent;
module.exports.registerCourse = registerCourse;
module.exports.deleteStudent = deleteStudent;
module.exports.dropCourse = dropCourse;
module.exports.authenticateStudent = authenticateStudent;