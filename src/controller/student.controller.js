const express = require("express");
const router = express.Router();
const studentService = require("../service/student.service");

router.get("/", async (req, res) => {
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

router.get('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

module.exports = router;
