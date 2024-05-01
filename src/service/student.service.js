const Student = require("../model/student.model");
const initClient = require("./initClient");
const { hashPassword } = require("../common/bcrypt");

class StudentService {
  async createStudent(student) {
    try {
      const client = await initClient();
      const id = student.id || (await getNextId());
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
      const keys = await client.keys("student_*");
      for (const key of keys) {
        const data = await client.get(key);
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
      const deleted = await client.del(key);

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
      const student = await client.get(key);
      if (!student) {
        console.error("Error getting student");
        return false;
      }
      const parsedStudent = JSON.parse(student);
      const mergedStudent = { ...parsedStudent, ...updateStudent };
      await client.set(key, JSON.stringify(mergedStudent));
      return mergedStudent;
    } catch (error) {
      console.error("Error updating student", error);
    }
  }
}

module.exports = new StudentService();
