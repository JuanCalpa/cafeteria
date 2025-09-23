const express = require('express');
const cors = require('cors');
const session = require('express-session');
const productosRouter = require('./routes/productosRouter');
const loginRouter = require('./routes/loginRouter');
const usuarioRouter = require('./routes/usuariosRouter');

const app = express();
app.use(session({
  secret:'Cafeteria321',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 600000 } 
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));
app.use(express.json());
app.use('/api', productosRouter);
app.use('/api', loginRouter);
app.use('/api', usuarioRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});