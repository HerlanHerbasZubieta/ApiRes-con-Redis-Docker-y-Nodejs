const Student = require("../model/student.model");
const initClient = require("./initClient");
const { promisify } = require("util");
const { hashPassword } = require('../common/bcrypt');

class StudentService {
  async createStudent(student) {
    try {
      const client = await initClient();
      const id = student.id || await getNextId();
      const hashedPassword = await hashPassword(student.password);
      student.password = hashedPassword;
      student.id = id;
      const serializedStudent = JSON.stringify(student);
      await client.set(`student_${id}`, serializedStudent);
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
      const getAsync = promisify(client.get).bind(client);
      const serializedStudent = await getAsync(key)

      if (!serializedStudent) {
        console.error(`Student with ID ${id} not found in Redis`);
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
        console.error("Error getting student");
        return false;
      }
      const parsedStudent = JSON.parse(student);
      const mergedStudent = {...parsedStudent,  ...updateStudent};
      await client.set(key, JSON.stringify(mergedStudent));
      return mergedStudent;
    } catch (error) {
      console.error("Error updating student", error);
    }
  }
}

module.exports = new StudentService();
