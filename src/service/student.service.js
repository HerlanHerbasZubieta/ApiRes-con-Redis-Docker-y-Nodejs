const { error } = require("console");
const Student = require("../model/student.model");
const initClient = require("./initClient");
const { promisify } = require("util");

class StudentService {
  async createStudent(student) {
    try {
      const client = await initClient();
      const key = `student_${student.id}`;
      await client.set(key, JSON.stringify(student));
      return student;
    } catch (error) {
      console.error("Error creating student:", error);
    }
  }

  async getAllStudents() {
    const client = await initClient();
    const students = [];

    try {
      const keysAsync = promisify(client.keys).bind(client);
      const keys = await keysAsync("student*");
      for (const key of keys) {
        const getAsync = promisify(client.get).bind(client);
        const data = await getAsync(key);
        if (data) {
          students.push(new Student(...Object.values(JSON.parse(data))));
        }
      }
      return students;
    } catch (error) {
      console.error("Error retrieving students:", error);
      throw error;
    }
  }

  async getStudentById(id) {
    try {
      const client = await initClient();
      const key = `student_${id}`;
      const serializedStudent = await client.get(key);

      if(!serializedStudent){
        return null;
      }

      const student = JSON.parse(serializedStudent);
      return student;
    } catch (error) {
      console.error("Error getting student", error);
    }
  }

  async deleteStudentById(id){
    try {
      const client = await initClient();
      const key = `student_${id}`;
      const delAsync = promisify(client.del).bind(client);
      const deleted = await delAsync(key);

      if (!deleted) {
        console.error(`Student with id ${id} not found in Redis`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting student", error);
    }
  }

  async modifyStudentById(id, updateStudent){
    try {
      const client = await initClient();
      const key = `student_${id}`;
      const getAsync = promisify(client.get).bind(key);
      const student = await getAsync(key);
      if(!student){
        return {error: 'Student not found'};
      }
      const parsedStudent = JSON.parse(student);
      const mergedStudent = {...parsedStudent,  ...updateStudent};
      await client.set(key, JSON.stringify(mergedStudent));
      return mergedStudent;
    } catch (error) {
      return {error: "Internal Server Error"};
    }
  }
}

module.exports = new StudentService();
