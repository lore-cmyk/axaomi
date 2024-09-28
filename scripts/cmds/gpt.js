const axios = require("axios");

const baseUrl = async () => {
  return 'https://lorex-gpt4.onrender.com/api';
};

module.exports.config = {
  name: "ai",
  aliases: ["ai", "chatgpt"],
  version: "1.0.0",
  role: 0, 
  author: "lorexai", 
  description: "GPT-4 AI with multiple conversations",
  usePrefix: true,
  guide: "[message]",
  category: "Ai",
  countDown: 5,
};

module.exports.onReply = async function ({ message, event, Reply }) {
  const { author, type } = Reply;
  if (author != event.from.id) return;
  if (type === "reply") {
    const reply = event.text?.toLowerCase();
    if (isNaN(reply)) {
      try {
        const generatingMessage = await message.reply("Generating...");
        const response = await axios.get(`${await baseUrl()}/gpt4?prompt=${encodeURIComponent(reply)}&uid=${author}`);
        const ok = response.data.response;
        await generatingMessage.unsend();
        const info = await message.reply(ok);

        global.functions.onReply.set(info.message_id, {
          commandName: this.config.name,
          type: 'reply',
          messageID: info.message_id,
          author: author,
          link: ok
        });
      } catch (err) {
        console.log(err.message);
        message.reply(`Error: ${err.message}`);
      }
    }
  }
};

module.exports.onStart = async ({ message, args, event }) => {
  try {
    const author = event.from.id;
    const userMessage = args.join(" ").toLowerCase();

    if (!args[0]) {
      return message.reply("Please provide a prompt to interact with Ai GPT-4");
    }

    const generatingMessage = await message.reply("Generating...");
    
    const response = await axios.get(`${await baseUrl()}/gpt4?prompt=${encodeURIComponent(userMessage)}&uid=${author}`);
    const aiResponse = response.data.response;
    
    await message.unsend(generatingMessage.message_id); 
    const info = await message.reply(aiResponse);
    
    global.functions.onReply.set(info.message_id, {
      commandName: this.config.name,
      type: 'reply',
      messageID: info.message_id,
      author,
      link: aiResponse
    });
    
  } catch (error) {
    console.log(`Failed to get an answer: ${error.message}`);
    message.reply(`Error: ${error.message}`);
  }
};
