const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const accountSid = 'AC9a0eb9cd2ab1371bb40bda48d3e84302';
const authToken = ' 07d2707498c5927773055d05bb3d057d';
const from = 'whatsapp:+14155238886'; // Twilio sandbox number

const sendWhatsAppMessage = async (to, body) => {
  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      new URLSearchParams({ To: `whatsapp:+${to}`, From: from, Body: body }),
      {
        auth: { username: accountSid, password: authToken },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    console.log('✅ Message sent:', response.data.sid);
    return { success: true, sid: response.data.sid };
  } catch (err) {
    console.error('❌ Message failed:', err.response?.data || err.message);
    return { success: false, error: err.response?.data || err.message };
  }
};

// ✅ API endpoint Oracle APEX will call
app.post('/send-message', async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ success: false, message: 'Number is required' });
  }

  const result = await sendWhatsAppMessage(number, 'Hello from Oracle APEX & Node backend!');
  res.json(result);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
