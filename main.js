const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');  // Load config.json

// Use values from config.json
const token = config.token;  // Telegram bot token
const mongoURI = config.mongodbURI;  // MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Create a new Telegram bot
const bot = new TelegramBot(token, { polling: true });

// Load all command files from the 'scripts/cmds' folder
const commandFiles = fs.readdirSync(path.join(__dirname, 'scripts/cmds')).filter(file => file.endsWith('.js'));

// Load all event files from the 'scripts/events' folder
const eventFiles = fs.readdirSync(path.join(__dirname, 'scripts/events')).filter(file => file.endsWith('.js'));

// Store commands and events
const commands = {};
const events = {};

// Load commands
for (const file of commandFiles) {
  const command = require(`./scripts/cmds/${file}`);
  commands[command.name] = command;
}

// Load events
for (const file of eventFiles) {
  const event = require(`./scripts/events/${file}`);
  events[event.name] = event;
}

// Set up command handling
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  // Check if the message starts with a command prefix (from config.json)
  if (text.startsWith(config.prefix)) {
    const commandName = text.split(' ')[0].substring(config.prefix.length);  // Get the command name without the prefix

    if (commands[commandName]) {
      try {
        // Execute the command's `execute` function
        await commands[commandName].execute(bot, msg);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        bot.sendMessage(chatId, 'There was an error executing that command.');
      }
    } else {
      bot.sendMessage(chatId, 'Command not recognized.');
    }
  }
});

// Set up event handling
for (const eventName in events) {
  if (events.hasOwnProperty(eventName)) {
    // Attach the event to the bot
    bot.on(eventName, (...args) => events[eventName].execute(bot, ...args));
  }
}

// Catch polling errors
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});
