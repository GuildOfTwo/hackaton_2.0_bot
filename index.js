const { Telegraf } = require('telegraf');

// const HttpsProxyAgent = require('https-proxy-agent');
// Общие настройки
let config = {
    "token": "6776594984:AAG9CpZvT1fSB5Ds3LbqWWBCY_X09-QRg88", // Токен бота
    "admin": 496258527 // id владельца бота
};
const bot = new Telegraf(config.token, {
    // Если надо ходить через прокси - укажите: user, pass, host, port
    // telegram: { agent: new HttpsProxyAgent('http://user:pass@host:port') }
}
);
let replyText = {
    "helloAdmin": "Ждем сообщения от пользователей",
    "helloUser": "Привет! Постараюсь ответить в ближайшее время",
    "replyWrong": "Для ответа пользователю используйте функцию Ответить/Reply."
};
let isAdmin = (userId) => {
    return userId == config.admin;
};
let forwardToAdmin = (ctx) => {
    if (isAdmin(ctx.message.from.id)) {
        ctx.reply(replyText.replyWrong);
    } else {
        ctx.forwardMessage(config.admin, ctx.from.id, ctx.message.id);
    }
};
bot.start((ctx) => {
    ctx.reply(isAdmin(ctx.message.from.id)
        ? replyText.helloAdmin
        : replyText.helloUser);
});
bot.on('message', (ctx) => {
    if (ctx.message.reply_to_message
        && ctx.message.reply_to_message.forward_from
        && isAdmin(ctx.message.from.id)) {
        ctx.telegram.sendCopy(ctx.message.reply_to_message.forward_from.id, ctx.message);
    } else {
        forwardToAdmin(ctx);
    }
});
bot.launch();