const { H, Handlers } = require('@highlight-run/node');

const highlightConfig = {
  projectID: 'qe988kwd',
  serviceName: 'pdf-reader-app',
  serviceVersion: 'git-sha',
  environment: process.env.NODE_ENV,
};
H.init(highlightConfig);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
require('dotenv').config();
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const sequelize = require('./src/config/db');
const app = express();

const port = process.env.PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Cambia esto por el dominio de tu frontend
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Cambia a true si usas HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    },
  }),
);

// This should be before any controllers (route definitions)
app.use(Handlers.middleware(highlightConfig));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send({
    nombre: 'Johan',
    apellido: 'Posso',
    edad: 25,
    correo: 'johanposso@gmail.com',
    telefono: '3178123456',
    direccion: 'Calle 123 # 45-67',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    codigoPostal: '111111',
    fechaNacimiento: '1990-01-01',
    genero: 'Masculino',
  });
});

app.get('/sync', () => {
  // do something dangerous...
  throw new Error('oh no! this is a synchronous error');
});

app.get('/async', async (req, res) => {
  try {
    // do something dangerous...
    throw new Error('oh no!');
  } catch (error) {
    const { secureSessionId, requestId } = H.parseHeaders(req.headers);
    H.consumeError(error, secureSessionId, requestId);
  } finally {
    res.status(200).json({ hello: 'world' });
  }
});

app.use(Handlers.errorHandler(highlightConfig));
sequelize.sync().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
});
