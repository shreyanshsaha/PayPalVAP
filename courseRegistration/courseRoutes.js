var express = require("express");
const _ = require("lodash");

var router = express.Router();
const middleware = require("./middleware");
const { debugPrint, errorPrint, infoPrint } = require("./printFunction")
const { authenticateStudent, addStudent, registerCourse, deleteStudent, dropCourse } = require("./student");
const { addProfessor, createCourse, deregisterCourse, deleteProfessor, authenticateProfessor } = require("./professor");
const { searchFile, getDataAsArray } = require("./fileHandling");
const { createMessage } = require("./utility");
const { getSlots } = require("./course");





router.get("/course/register", middleware.isStudent, (req, res) => {
  getDataAsArray("./data/course.dat")
    .then(async (courseArray) => {
      for (let i = 0; i < courseArray.length; i++)
        courseArray[i].professorDetails = await searchFile("./data/professor.dat", courseArray[i].professor, '_id', true);
      console.log("/course/register", req.session.user);
      // res.send(req.session.user);
      if (req.query.courseID)
        courseArray = _.filter(courseArray, (element) => {
          return element.courseID == req.query.courseID.toLowerCase();
        });
      return res.render("course", {
        courses: courseArray,
        student: req.session.user
      });
    }).catch((err) => {
      req.session.message = createMessage("Course Page Error", err.message, "error");
      res.redirect("/student");
    })
});

router.get("/course/register/:courseID/:professorID", middleware.isStudent, (req, res) => {
  registerCourse(req.session.user, req.params.courseID, req.params.professorID)
    .then(async (newCourse) => {
      newCourse.professorDetails = await searchFile("./data/professor.dat", newCourse.professor, '_id');
      req.session.user.courseDetails.push(newCourse);
      console.log("/course/register/", newCourse, req.session.user);
      req.session.message = createMessage("Course Registered", newCourse.courseID + " registred successfully", "positive");
      res.redirect("/student");
    })
    .catch((err) => {
      req.session.message = createMessage("Registration Error", err.message, "error");
      res.redirect("/student");
    });
});

router.get("/course/drop/:courseID", middleware.isStudent, (req, res) => {
  if (!req.params.courseID) {
    req.session.message = createMessage("Course Drop Error", "CourseID Required", "error");
    return res.redirect("/student");
  }
  if (!req.session.user._id) {
    req.session.message = createMessage("Course Drop Error", "Student Obj needs ID", "error");
    return res.redirect("/student");
  }

  dropCourse(req.session.user, req.params.courseID)
    .then((newStudentObj) => {
      console.log(newStudentObj);
      req.session.user = newStudentObj;
      req.session.message = createMessage("Dropped Successfully", "Course dropped", "positive");
      return res.redirect("/student");
    })
    .catch((err) => {
      req.session.message = createMessage("Course Drop Error", err.message, "error");
      return res.redirect("/student");
    });
});


// router.get("/course/drop/:courseID", middleware.isStudent, (req, res) => {
//   message = req.session.message;
//   dropCourse(req.session.user, req.params.userID)
//   .then(()=>{
//     // drop from courses
//     _.remove(req.session.user.course, (element)=>{
//       return element == req.params.courseID;
//     });

//     // drop from courseDetails
//     // _.remove(req.session.user.courseDetails, (element)=>{
//     //   return 
//     // });
//   })
//   .catch((err)=>{
//     req.session.message = createMessage("Registration Error", err.message, "error");
//     res.redirect("/student");
//   })
//   // res.render("drop", {
//   //   courseID: req.params.courseID,
//   //   message: message,
//   //   student:
//   // });
// });

router.get("/course/create", middleware.isProfessor, function (req, res) {
  message = req.session.message;
  delete req.session.message;
  return res.render("createCourse", {
    message: message,
  });
})

router.post("/course/create", middleware.isProfessor, function (req, res) {
  if (
    !req.body.courseID ||
    !req.body.name ||
    !req.body.slot
  ) {
    req.session.message = createMessage("Create Error", "Course params incomplete", "error");
    return res.redirect("/course/create");
  }
  let courseObj = {
    courseID: req.body.courseID.toLowerCase(),
    name: req.body.name,
    slot: req.body.slot,
  }
  // console.log('obj: ', courseObj);
  createCourse(req.session.user, courseObj)
    .then((newCourse) => {
      console.log(newCourse);
      if (newCourse)
        req.session.user.courseDetails.push(newCourse);
      req.message = createMessage("Course Created", "Course created successfully", "positive");
      res.redirect("/professor");
    })
    .catch((err) => {
      errorPrint(err);
      req.session.message = createMessage("Course Creation Error", err.message, "error");
      res.redirect("/professor");
    })
})


router.get("/course/delete/:courseID", middleware.isProfessor, function (req, res) {
  if (!req.params.courseID) {
    req.session.message = createMessage("Delete Error", "CourseID Required", "error");
    return res.redirect("/course/create");
  }
  if (!req.session.user._id) {
    req.session.message = createMessage("Delete Error", "Professor Obj needs ID", "error");
    return res.redirect("/course/create");
  }

  deregisterCourse(req.session.user, req.params.courseID)
    .then((updatedProfessor) => {
      req.session.user = updatedProfessor;
      console.log('new prof:' + updatedProfessor);
      req.session.message = createMessage("Deleted Successfully", "Course deleted successfully", "positive");
      return res.redirect("/professor");
    })
    .catch((err) => {
      console.log(err);
      req.session.message = createMessage("Delete Error", err.message, "error");
      return res.redirect("/professor");
    })
});

module.exports = router;