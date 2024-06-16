const Student = require("../model/student.model");
const initClient = require("./initClient");
const { promisify } = require("util");
const { hashPassword, comparePassword } = require("../common/bcrypt");
const generate = require("../jwt/generateJWT")
class StudentService {
  async createStudent(student) {
    try {
      const client = await initClient();
      const id = student.id || (await getNextId());
      const hashedPassword = await hashPassword(student.password);
      student.password = hashedPassword;
      student.id = id;
      student.createdAt = new Date().toISOString();
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
      const serializedStudent = await getAsync(key);

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

  async deleteStudentById(id) {
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

  async modifyStudentById(id, updateStudent) {
    try {
      const client = await initClient();
      const key = `student_${id}`;
      const getAsync = promisify(client.get).bind(key);
      const student = await getAsync(key);
      if (!student) {
        console.error("Error getting student");
        return false;
      }
      const parsedStudent = JSON.parse(student);
      const mergedStudent = { ...parsedStudent, ...updateStudent };
      mergedStudent.updatedAt = new Date().toISOString();
      await client.set(key, JSON.stringify(mergedStudent));
      return mergedStudent;
    } catch (error) {
      console.error("Error updating student", error);
    }
  }

  async login(student) {
    try {
      const client = await initClient();
      const key = `student_${student.id}`;
      const getAsync = promisify(client.get).bind(client);
      const bdStudent = await getAsync(key);

      if(!bdStudent) {
        console.error('Student not found');
        return false;
      }
      const jsonStudent = JSON.parse(bdStudent);
      const passwordMatch = await comparePassword(student.password, jsonStudent.password);

      if(!passwordMatch) {
        console.error('Invalid password');
        return false;
      }
      const token = generate.generateJWT(jsonStudent);
      return { data: jsonStudent,  token: token };
    } catch (error) {
      console.error("Error generate token", error);
    }
  }
}

module.exports = new StudentService();
