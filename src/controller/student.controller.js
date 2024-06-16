const express = require("express");
const router = express.Router();
const studentService = require("../service/student.service");
const verify = require('../middleware/verifyJWT')

router.get("/", verify.verifyJWT, async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const student = req.body;
  try {
    const newStudent = await studentService.createStudent(student);
    res.json(newStudent);
  } catch (error) {
    res.status(500).json({ error: "Error created student" });
  }
});

router.get('/:id', verify.verifyJWT, async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await studentService.getStudentById(studentId);
    if (!student) {
      return res.status(400).json({error: 'Student not found'});
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error'});
  }
})

router.delete('/:id', verify.verifyJWT, async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await studentService.deleteStudentById(studentId);
    if (!student) {
      return res.status(400).json({error: 'Student not deleted'});  
    }
    res.json({message: 'Student deleted successfully'});
  } catch (error) {
    res.status(500).json({error: 'Error while deleting student'});
  }
})

router.put('/:id', async (req, res) => {
  const studentId = req.params.id;
  const updateStudent = req.body;

  try {
    const student = await studentService.modifyStudentById(studentId, updateStudent);

    if(!student){
      return res.status(404).json({error: 'Student not found'});
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.post('/login', async (req, res) => {
  const student = req.body;

  try {
    const dataStudent = await studentService.login(student);
    console.log(dataStudent)
    if(!dataStudent) {
      return res.status(404).json({error: 'Data student not found'});
    }
    res.json(dataStudent);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.post('/protected-route', verify.verifyJWT, (req, res) => {
  res.json({ message: 'You are authorized!!'})
})

module.exports = router;
