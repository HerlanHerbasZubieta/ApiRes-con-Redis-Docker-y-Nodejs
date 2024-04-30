const express = require('express');
const app = express();
const { config } = require('dotenv')
const studentRouter = require('./controller/student.controller')
config()

app.use(express.json());
app.use('/student', studentRouter);


const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log(`Server listening on ${port}`)
})

