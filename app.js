const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const ejsLocals = require('ejs-locals');
dotenv.config();
const app = express();
const session = require('express-session');  // Importar express-session
connectDB();
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsLocals);
app.set('view engine', 'ejs');
app.set('views', './src/resources/views');
app.use(express.static('./src/resources/views'));
const apiRoutes = require('./src/routes/api'); // Pasamos crypto como parámetro
const webRoutes = require('./src/routes/web');
app.use('/api', apiRoutes);
app.use('/', webRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message, archivo: err.stack });
});
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}
module.exports = app;
