//deberias considerar usa una bd de prueba?
const connectDB = require('../config/db'); // Importa la función connectDB
const mongoose = require('mongoose');
const request = require('supertest'); // Para realizar solicitudes HTTP
const app = require('../app'); // Asegúrate de exportar la instancia de tu app de Express
const User = require('../src/model/usuario_Model'); // Importa el modelo de usuario

// Mockear el modelo de usuario
jest.mock('../src/model/usuario_Model');

// Conectar a la base de datos antes de las pruebas
beforeAll(async () => {
    await connectDB(); // Conectar a la base de datos
    // Opcional: Insertar datos de prueba si es necesario
});

// Describir las pruebas
describe('POST /api/auth/login', () => {
  it('debe devolver un mensaje de éxito y el usuario si las credenciales son correctas', async () => {
    // Mockear un usuario válido
    User.getByEmail.mockResolvedValue({
        usuario_email: 'admin@gmail.com',
        usuario_password: 'abcde',
    });
    User.update.mockResolvedValue({
      usuario_nombre: 'admin',
      usuario_email: 'admin@gmail.com',
      usuario_tipo: 'administrador',
      usuario_sesion: '951bb9a17a830a1c8c120da73fd18beb',
    });
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        usuario_email: 'admin@gmail.com',
        usuario_password: 'abcde',
      })
      .set('Accept', 'application/json');
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login exitoso');
    expect(response.body).toHaveProperty('user');
  });

  it('debe devolver un error si el usuario no existe', async () => {
    // Mockear que el usuario no existe (null)
    User.getByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        usuario_email: 'noexiste@example.com',
        usuario_password: '123456',
      })
      .set('Accept', 'application/json');
      
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
  });

  it('debe devolver un error si la contraseña es incorrecta', async () => {
    // Mockear un usuario con una contraseña incorrecta
    User.getByEmail.mockResolvedValue({
        usuario_email: 'admin@gmail.com',
        usuario_password: 'abcd',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        usuario_email: 'admin@gmail.com',
        usuario_password: 'incorrecta',
      })
      .set('Accept', 'application/json');
      
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Contraseña incorrecta');
  });

  it('debe manejar errores del servidor', async () => {
    // Simulación de un error interno
    jest.spyOn(console, 'error').mockImplementation(() => {});
    User.getByEmail.mockImplementation(() => {
      throw new Error('Error interno del servidor');
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        usuario_email: 'test@example.com',
        usuario_password: '123456',
      })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('message', 'Error interno del servidor');
  });
});

// Cerrar la conexión a la base de datos después de las pruebas
afterAll(async () => {
    await mongoose.connection.close(); // Cerrar la conexión
});
