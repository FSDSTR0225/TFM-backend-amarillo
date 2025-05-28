import {describe,test,expect,beforeAll,afterAll,beforeEach,} from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
const request = require("supertest");
import mongoose from "mongoose";
import app from "../app";

describe("User Routes Integration Tests", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

      // Verifica si ya hay una conexión activa

     if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    // Desconectar y cerrar MongoDB después de las pruebas
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Limpiar las colecciones antes de cada prueba
    await mongoose.connection.dropDatabase();
  });

  // Test del login  de usuario
  describe("POST /users/login", () => {
    test("Iniciar sesion", async () => {
      await request(app).post("/users/register").send({
        name: "test",
        email: "test@test.com",
        password: "Password1@",
      });
      // Luego, iniciar sesión
      const res = await request(app).post("/users/login").send({
        email: "test@test.com",
        password: "Password1@",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("access_token");
    });
    // Test de inicio de sesión con credenciales incorrectas
    test("Iniciar sesion con credenciales incorrectas", async () => {
      const res = await request(app).post("/users/login").send({
        email: "test@test.com",
        password: "Password1@",
      });
      console.log(res.body);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
    });

  });
});
