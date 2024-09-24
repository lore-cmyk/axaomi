module.exports = {
  config: {
    name: "start",
    version: "1.0",
    aliases: ["welcome"],
    author: "dipto",
    countDown: 3,
    role: 0,
    description: "Welcomes the user and provides information.",
    commandCategory: "info",
    guide: "{pn}",
  },

  run: async function ({ message }) {
    const welcomeMessage = `𝗛𝗶 𝗜'𝗺 𝗟𝗼𝗿𝗲𝘅 𝗔𝗶, 𝗜'𝗺 𝗴𝗹𝗮𝗱 𝘆𝗼𝘂'𝗿𝗲 𝗵𝗲𝗿𝗲!\n\n` +
                           `My prefix is: /\n\n` +
                           `Type /𝗵𝗲𝗹𝗽 for my commands and enjoy!`;
    await message.reply(welcomeMessage);
  },
};
