
const express = require('express');
const app = express();
require('dotenv').config();

const paymentRoutes = require('./routes/payment');

app.use(express.json());
app.use('/payment', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
