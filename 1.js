require('dotenv').config();

require('https').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
  res.end('')
});

const { Telegraf } = require('telegraf');

const api = require('covid19-api');

const COUNTRIES_HELP = require('./const');

const {Markup}  = require('telegraf');

const bot = new Telegraf(process.env.Bot_token);

bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name}!
Узнай статистику по Коронавирусу. 
Для этого напиши на английском название любой страны. 
`,

Markup.keyboard([
['US', 'Russia', 'Qatar', 'Kazakhstan'],
['Ukraine', 'Japan', 'Poland', 'Belarus'],
	]).resize() 
  )
);
bot.help((ctx) => ctx.reply(COUNTRIES_HELP));

bot.on( 'text', async (ctx) => {
	let data = {};
	try{
	data = await api.getReportsByCountries(ctx.message.text);

	const formatData = `
Страна: ${data[0][0].country}
Заболело: ${data[0][0].cases}
Умерло: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}  
	`;
	ctx.reply(formatData);
}catch {
	ctx.reply(`Введите правильное название страны. 
Список названий: /help`);
}

}); 

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

