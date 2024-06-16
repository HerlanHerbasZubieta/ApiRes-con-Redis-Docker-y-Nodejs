# Error al cargar las variables de entorno en Nodejs

Este Blog se proporciona una guía paso a paso para configurar y solucionar problemas con las variables de entorno, en este caso se tomara como ejemplo un proyecto API Rest con Docker y Nodejs con la base de datos **Redis**.

## Solución de Problemas

### Variables de Entorno No Reconocidas

1. **Archivo `.env` en la ubicación incorrecta**: Asegúrate de que el archivo `.env` esté en la raíz del proyecto.
[![Captura-de-pantalla-2024-06-16-180447.png](https://i.postimg.cc/MKN0FKhR/Captura-de-pantalla-2024-06-16-180447.png)](https://postimg.cc/HV07JHWs)
2. **Configuración incorrecta de `dotenv`**: Asegúrate de requerir y configurar `dotenv` al inicio del archivo principal.
3. **Errores de sintaxis en el archivo `.env`**: Verifica que el archivo `.env` no tenga espacios adicionales alrededor del signo `=`.
   **Ejemplo incorrecto:**

        DB_HOST = localhost  # Incorrecto, hay un espacio antes del '='
   
   **Ejemplo correcto:**

        DB_HOST=localhost  

## 1. Instalar `dotenv`

Asegúrate de que `dotenv` esté instalado en tu proyecto. Ejecuta el siguiente comando en la terminal:

    npm install dotenv --save

## 2. Verifica el Archivo `package.json`
    {
    "name": "api-con-redis-y-docker",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
        "dev": "nodemon src/app.js",
        "start": "node src/app.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "description": "",
    "dependencies": {
        "bcryptjs": "^2.4.3",
        "dotenv": "^16.4.5",
        "express": "^4.19.2",
        "jsonwebtoken": "^9.0.2",
        "moment": "^2.30.1",
        "redis": "^4.6.13",
        "response-time": "^2.3.2"
    },
    "devDependencies": {
        "nodemon": "^3.1.0"
    }
    }


## 3. Crear un Archivo `.env`

Crea un archivo `.env` en la raíz del proyecto. Este archivo contendrá todas tus variables de entorno. Asegúrate de que no haya espacios alrededor de los signos `=`.

    PORT=5000
    REDIS_PORT=6379
    REDIS_HOST=redis_image
    SECRET_KEY=secretkey123

## 4. Configura `dotenv` Correctamente
Asegúrate de configurar `dotenv` al inicio de tu archivo principal (por ejemplo, **index.js** o **app.js**). Esto es crucial para que las variables de entorno se carguen antes de cualquier otro código.

    const express = require('express');
    const app = express();
    require('dotenv').config();
    const studentRouter = require('./controller/student.controller')

    app.use(express.json());
    app.use('/student', studentRouter);


    const port = process.env.PORT || 5000
    app.listen(port, ()=>{
        console.log(`Server listening on port ${port}`)
    })




