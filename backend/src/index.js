const express = require('express');
const cors = require('cors');
const session = require('express-session');
const productosRouter = require('./routes/productosRouter');

const app = express();
app.use(session({
  secret:'Cafeteria',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 } 
}));

app.use(cors({origin: 'http://localhost:3000'})); 
app.use(express.json());
app.use('/api', productosRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});