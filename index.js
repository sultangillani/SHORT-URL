const express = require('express');
const cookieParser = require('cookie-parser');

const {connectMongoDb} = require('./connect');
const { getCurrentUser } = require('./globals');
const {restrictToLoggedinUserOnly, checkAuth, checkForAuthentication, restrictTo} = require('./middlewares/auth');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

const app = express();

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const PORT = 8001;
const URL = require('./models/url');

const dbURI = 'mongodb://127.0.0.1:27017/short-url'; 

global.APP_URL = "http://localhost:8001/";

connectMongoDb(dbURI).then(() => console.log('MongoDB connected successfully!')).catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use( express.json() );
app.use( express.urlencoded({extended: false}) );
app.use(cookieParser());
app.use(checkForAuthentication);

//app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use('/url', restrictTo(['ADMIN','NORMAL']) ,urlRoute);
app.use('/user', userRoute);
app.use('/', staticRoute);
//app.use('/', checkAuth, staticRoute);

app.get('/url/:shortId', async (req, res) => {
	const shortId = req.params.shortId;
	const entry = await URL.findOneAndUpdate({ shortId }, {
		$push: {
			visitedHistory: {timestamp: Date.now() }
		}
	});
	
	res.redirect(entry.redirectURL);
});


/********** BOT Starts Here **********/

const client_id = '';
const token = '';
const openAIKey = '';

const { Client, Events, GatewayIntentBits, SlashCommandBuilder} = require('discord.js');
const {registerCammands} = require('./command');
const {sendUrlForShortUrl} = require('./controllers/url');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });
client.on('messageCreate', (message) => {
    console.log(message.content);
    if(message.author.bot){
        return;
    }
    //openAiResponse(openAIKey,message);
});

client.on('interactionCreate', async (interaction) => {
    //console.log(interaction);
	const user = getCurrentUser();
	
    if(interaction.commandName == 'shorturl'){
		const userMessage = interaction.options.getString("message");
		const urlRegex = /(https?:\/\/[^\s]+)/g;

		const foundUrls = userMessage.match(urlRegex);

		if (foundUrls && foundUrls.length > 0) {
			//console.log(foundUrls);	
			let short_url_reply = 'Here are found URL\'s with their short versions: \n';

            for (const url of foundUrls) {
                try {
                    const short_url = await sendUrlForShortUrl(url, user._id);
                    short_url_reply += `${url} => ${short_url}\n`;
                } catch (err) {
                    short_url_reply += `${url} => ❌ Failed to shorten\n`;
                }
            }

            await interaction.reply(short_url_reply);

			//interaction.reply(`🔗 I found this URL: ${foundUrls[0]}`);
			//interaction.reply(short_url_reply);
		} else {
			interaction.reply("❌ No valid URL found in your message.");
		}

		console.log(foundUrls);
		
        //interaction.reply('Pong!');
    }
});

if(token != ''){
    client.login(token);

    app.get('/discord',(req, res) => {
        const commands = [
		new SlashCommandBuilder()
			.setName("shorturl")
			.setDescription("Replies with Pong and your message")
			.addStringOption(option =>
			option.setName("message")
				.setDescription("Type your message")
				.setRequired(true)
			)
			.toJSON(),
		];

        const result = registerCammands(client_id,token,commands);

        return res.json({'data': result});
    });
}else{
	//return res.json({'data': 'Unauthorized User'});
}

/********** BOT Ends Here **********/

app.listen(PORT,() => {
	console.log('Server Started');
});