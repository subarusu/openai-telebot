const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require("openai");
const { BOT_TOKEN, OWNER_ID, MAX_TOKEN } = setting = require('./setting.json');
const configuration = new Configuration({
apiKey: setting.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);
const bot = new Telegraf(BOT_TOKEN);
const client = bot.telegram;

function reply(chatid, message, msgid, opts) {
    return client.sendMessage(chatid, message, { reply_to_message_id: msgid, ...opts });
}


bot.on('message', async (ctx) => {
    let body = ctx.message.text || ctx.message.caption || "";
    let chatId = ctx.message.chat.id;
    let userId = ctx.message.from.id;
    let messageId = ctx.message.message_id;
    let username = ctx.message.from.username;
    let isOwner = OWNER_ID.includes(userId);
    let name = ctx.message.from.first_name;
    let lastName = ctx.message.from.last_name;
    let chatType = ctx.message.chat.type;
    let fullName = (name + " ") + (lastName ? lastName : "").trim();
    let mention = (username ? "@" + username : fullName);
    let mentionId = (fullName ? fullName : username ? "@" + username : userId);
    let userIdLink = "tg://user?id=" + userId;
    let args = body.split(" ").slice(1);
    let command = body.split(" ")[0].toLowerCase();

    switch (command) {
    case "/start":
    let shareText = `Cobain Nih!!
Chat Bot AI yang akan membantu kamu. 
Kirimkan pertanyaan kamu disini, nanti bot akan menjawab pertanyaan kamu.

https://t.me/${bot.botInfo.username.toLowerCase()}`;

    reply(chatId, `Hai 👋\n\nSaya adalah Robot AI untuk menjawab pertanyaan anda, Silahkan kirim Pertanyaan kamu, nanti jawaban kamu akan dijawab oleh robot.\n\n_AI (Artificial Intelligence) adalah teknologi yang menggunakan algoritma kompleks untuk membuat mesin yang dapat berpikir dan bertindak seperti manusia. AI dapat digunakan untuk menyelesaikan masalah yang rumit dan membuat keputusan yang lebih tepat daripada manusia. AI juga dapat digunakan untuk menganalisis data dan mengambil keputusan berdasarkan data tersebut. AI juga dapat digunakan untuk meningkatkan produktivitas dan efisiensi, serta membantu manusia dalam menyelesaikan tugas-tugas yang rumit._\n\n_bot dibatasi menjawab maximal ${MAX_TOKEN} kata_\n\n*Created by @caliphdev*`, messageId, { parse_mode: "Markdown", reply_markup: {
    inline_keyboard: [
      [{ text: '💌 Owner', url: "https://t.me/caliphdev" }, { text: "🔗 Source Code", url: "https://github.com/caliphdev/openai-telebot" }],
      [{ text: "❤️ Share Bot ini", url: "https://t.me/share/url?"+new URLSearchParams({ text: shareText }) }]
    ]
  } });
    break;
        
        case ">":
        if (args.length == 0) return reply(chatId, "Send me a code for execute.", messageId);
        if (!isOwner) return reply(chatId, "You are not my owner.", messageId);
        let code = args.join(" ");
        try {
            let evaled = await eval(`(async () => { ${code} })()`);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth: 7 });
            reply(chatId,  evaled, messageId);
        } catch (err) {
            reply(chatId, err, messageId);
        }
        break;
        case "/ping":
                det = new Date
                x = await reply(chatId, "Testing ping...", messageId)
                dex = new Date - det
                client.editMessageText(chatId, x.message_id, null, `Pong!!!\nSpeed : ${dex < 1000 ? dex : dex / 1000} ${dex < 1000 ? "ms" : "Seconds"}`);
                break
        default:
        if (!body) return 
        client.sendChatAction(chatId, "typing");
try {
const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: body,
          temperature: 0,
          max_tokens: MAX_TOKEN,
          top_p: 1,
          frequency_penalty: 0.2,
          presence_penalty: 0,
        });
        console.log(response.data);
reply(chatId, response.data.choices[0].text.trim(), messageId);
} catch (e) {
reply(chatId, "Maaf, saya tidak mengerti maksud anda!", messageId);
} 
        break;
    }
});

bot.launch().then(() => {
    console.log("Bot started!");
}).catch((err) => {
    console.log(err);
});