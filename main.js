const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

// Environment variables (if using process.env for token and DB URI)
const token = process.env.TELEGRAM_BOT_TOKEN || '7801002281:AAGUS_gSipt8ZB7R2SUhKpuBXvIOAB-sbs0';
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pajanustanrecovery234:KiIrOkbaHHanDSgp@cluster0.4iwxq.mongodb.net/Lorex_Ai_Bot?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Create a new Telegram bot
const bot = new TelegramBot(token, { polling: true });

// Set up bot commands
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome! I am Lorex Ai bot.');
});

// Handle all other messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `You said: ${msg.text}`);
});

// Catch polling errors
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});
