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

  async getAll() {
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
}

module.exports = new StudentService();
