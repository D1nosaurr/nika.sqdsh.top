require('dotenv').config();
const SDC = require('@megavasiliy007/sdc-api');
const client = new SDC(process.env.SDC_TOKEN);

const { Client } = require('discord.js');
const discord = new Client({ disableEveryone: true });
discord.on('ready', () => console.log("Discord client has started!"));
discord.login(process.env.DISCORD_TOKEN);

const express = require('express');
const nika = express();

nika.set('view engine', 'ejs');
nika.use('/static', express.static('static'));
nika.get('/', (req, res) => {
    let phrases = [
        `<span style="cursor: help;" onclick="alert('Лиське привет передайте. <3')">Фырк.</span> ©️ Vlad Ciphersky`,
        `Только на <a href="/partner/1" target="_blank">этом сервере</a> жителей увозят на чорный рынак. ©️ D1nosaurr</span>`,
        `YstNeris <3`,
        `Ностальгия из 2018...`
    ];

    let phraseID = Math.floor(Math.random() * phrases.length);
    let phrase = phrases[phraseID] || "Здесь могла быть ваша реклама.";

    if(req.query.id) {
        if(isNaN(req.query.id)) return res.render('error', { message: "Указан некорректный аргумент.", phrase: phrase });
        else return client.warns(req.query.id)
            .then((data) => discord.fetchUser(req.query.id).then((usdat) => {
                if(data.error && data.error.code == 429) return res.render('error', { message: "Превышен лимит запросов к Server-Discord API. Повторите попытку позже.", phrase: phrase });
                else if(data.error && data.error.code == 204) return res.render('warns', { id: req.query.id, userData: usdat || { error: "NotFound" }, warns: 0, phrase: phrase });
                else return res.render('warns', { id: req.query.id, userData: usdat || { error: "NotFound" }, warns: data.warns, phrase: phrase });
            }).catch((err) => res.render('error', { message: "Такого пользователя в Discord никогда не существовало, либо аккаунт был удалён.", phrase: phrase })));
    } else return res.render('index', { phrase: phrase });
});

nika.get('/partner/:id', (req, res) => {
    switch (Number(req.params.id)) {
        case 1:
            res.redirect("https://vk.com/lf_minecraft");
            break;

        case 2:
            res.redirect("https://bots.server-discord.com/543858333585506315");
            break;
    
        default:
            res.redirect("/");
            break;
    }
});
nika.get('/appeal', (req, res) => res.redirect("https://sdc.su/form"));
nika.listen(3130, () => console.log('App started on *:3130'));