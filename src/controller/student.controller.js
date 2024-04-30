const express = require("express");
const router = express.Router();
const studentService = require("../service/student.service");

router.get("/", async (req, res) => {
  try {
    const students = await studentService.getAll();
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

module.exports = router;
