
const express = require('express');
const router = express.Router();
const mercadopago = require('../mercadopago');

router.post('/create-pix', async (req, res) => {
  const { description, amount, payer } = req.body;

  try {
    const payment_data = {
      transaction_amount: Number(amount),
      description,
      payment_method_id: 'pix',
      payer
    };

    const payment = await mercadopago.payment.create(payment_data);
    res.json({
      id: payment.body.id,
      status: payment.body.status,
      qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: payment.body.point_of_interaction.transaction_data.qr_code_base64
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar pagamento.');
  }
});

router.post('/webhook', express.json(), (req, res) => {
  console.log('Webhook recebido:', req.body);
  res.status(200).send('OK');
});

module.exports = router;
