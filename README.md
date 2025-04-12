# 📚 BookMatch API - Backend

> El motor detrás de tu Tinder de libros: conectando lectores con sus próximas aventuras literarias.

## 📋 Índice de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
- [Contribución](#contribución)
- [Enlaces Útiles](#enlaces-útiles)
- [Licencia](#licencia)
- [Equipo](#equipo)

## 📝 Descripción

**BookMatch API** es el backend que impulsa nuestra innovadora plataforma para descubrir libros. Proporciona todos los servicios y puntos de acceso necesarios para que los usuarios puedan explorar, filtrar y guardar libros según sus preferencias, interactuar con otros lectores y gestionar su biblioteca personal.

Esta API RESTful está diseñada con una arquitectura modular y escalable para garantizar un rendimiento óptimo y facilitar futuras expansiones.

## 🛠️ Tecnologías

El backend de BookMatch está construido con las siguientes tecnologías:

### Dependencias Principales
- **Express**: ^5.1.0 - Framework web rápido y minimalista para Node.js
- **MongoDB**: ^6.15.0 - Driver oficial de MongoDB para Node.js
- **Mongoose**: ^8.13.2 - Modelado de objetos MongoDB para Node.js
- **Dotenv**: ^16.4.7 - Carga de variables de entorno desde archivos .env
- **CORS**: ^2.8.5 - Middleware para habilitar CORS (Cross-Origin Resource Sharing)

### Herramientas de Desarrollo
- **Nodemon**: ^3.1.9 - Utilidad que monitoriza cambios y reinicia automáticamente el servidor

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   ├── db.js             # Configuración de la base de datos
│   └── .env.example      # Plantilla de variables de entorno
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   ├── matchController.js
│   └── userController.js
├── middleware/
│   ├── auth.js           # Middleware de autenticación
│   └── errorHandler.js   # Manejo centralizado de errores
├── models/
│   ├── Book.js
│   ├── Match.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── books.js
│   ├── matches.js
│   └── users.js
├── utils/
│   ├── logger.js
│   └── validators.js
├── .env                  # Variables de entorno (no versionado)
├── .gitignore
├── index.js              # Punto de entrada de la aplicación
├── package.json
└── README.md
```

## ⚙️ Requisitos Previos

Para ejecutar este proyecto, necesitarás:

- Node.js (v16.x o superior)
- MongoDB (local o conexión a MongoDB Atlas)
- Git

## 🚀 Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/FSDSTR0225/TFM-backend-amarillo.git
cd TFM-backend-amarillo
```

2. **Instala las dependencias**

```bash
npm install
```

## 🔧 Configuración

1. **Crea un archivo .env basado en .env.example**

```
.env
```

2. **Edita el archivo .env con tus configuraciones**

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookmatch

# Añade aquí otras variables de entorno necesarias
```

## ▶️ Ejecución

### Modo desarrollo

```bash
npx nodemon 
```



## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión

### Usuarios
- `GET /api/users/profile` - Obtener perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil

### Libros
- `GET /api/books` - Listar libros con filtros
- `GET /api/books/:id` - Obtener detalles de un libro
- `POST /api/books/:id/match` - Marcar libro como "me gusta"
- `POST /api/books/:id/dismiss` - Descartar libro

### Matches
- `GET /api/matches` - Obtener lista de libros guardados
- `DELETE /api/matches/:id` - Eliminar un libro de la lista de guardados

## 📊 Modelos de Datos

### User
```javascript
{
  "_id": ObjectId,
  "name": "string",
  "email": "string",
  "password": "string",
  "save": ["book_id"], 
  "read": [
    {
      "book": "book_id",
      "state": "string" // estado de lectura
    }
  ],
  "preferences": [
    {
      "genres": ["string"],
      "languages": ["string"]
    }
  ],
    "timestamp": "ISODate"
  "like": ["book_id"],
  "dislike": ["book_id"],
  "list": ["list_id"]
}
```

### book
```javascript
{
  "_id": ObjectId,
  "name": "string",
  "like": NumberInt,
  "dislike": NumberInt,
  "state": NumberDecimal, // porcentaje de algo (¿progreso?)
  "review": [
    {
      "user": "user_id",
      "text": "string",
      "rating": NumberInt
    }
  ],
  "genre":"string"
  "language":"string"
  "url": "string"
  "timestamp": "ISODate"

}
```

### list
```javascript
{
  "_id": ObjectId,
  "name": "string",
  "books": ["book_id"],
  "timestamp": "ISODate"
}
```

## 🌿 Flujo de Trabajo con Git

Para mantener un desarrollo organizado y colaborativo, seguimos el siguiente flujo de trabajo con Git:

### Ramas Principales
- `main` - Código de producción estable
- `dev` - Rama de desarrollo e integración

### Ramas de Características
Para nuevas funcionalidades:
- `nombrePersona/nombre-funcionalidad`

### Ramas de Corrección
Para corrección de errores:
- `bugfix/descripcion-error`

### Proceso de Pull Request
1. Crea tu rama desde `develop`
2. Desarrolla la funcionalidad o corrección
3. Asegúrate de que tu código sigue las directrices del proyecto
4. Crea un Pull Request a `develop`
5. Después de la revisión y aprobación, se fusionará con la rama principal

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea tu rama de características (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

Por favor, asegúrate de actualizar las pruebas según corresponda y sigue las directrices de contribución del proyecto.

## 🔗 Enlaces Útiles

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Mongoose](https://mongoosejs.com/docs/guide.html)
- [Repositorio Frontend](https://github.com/tu-usuario/bookmatch-frontend)
- [Tablero de Proyecto](https://trello.com/b/tu-tablero)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia ISC - consulta el archivo LICENSE para más detalles.

## 👨‍💻 Equipo

- **[Pablo Pianelo]** 
- **[Nombre ]** 

---

Desarrollado con ❤️ por el equipo de amarillo