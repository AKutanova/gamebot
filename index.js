const telegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');

const token = '5815366490:AAHP7jK-AKZA-e5ISDQg9QwOBtQB1MuVmy8';
const bot = new telegramApi(token, {polling: true});

const chats = {}

const startGame = async (chat_id) => {
    await bot.sendMessage(chat_id, `Сейчас я загадаю цифру от 0 до 9, а тебе нужно её отгадать:`);
    const rand = Math.round(Math.random(0, 8)*10);

    chats[chat_id] = rand;
    await bot.sendMessage(chat_id, `Я загадал. Отгадывай:`, gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Получить информацию о себе'},
        {command: '/game', description: 'Давай поиграем'}
    ])
    
    bot.on('message', async (msg) => {
        const chat_id = msg.chat.id;
        const text = msg.text;
    
        // console.log(msg);
        if (text === '/start') {
            await bot.sendSticker(chat_id, 'https://tlgrm.eu/_/stickers/744/1fd/7441fd81-d1db-309b-8b03-0c1d296943c8/1.webp');
            return bot.sendMessage(chat_id, `Добро пожаловать на телеграмм-канал JavaScript Alarm!`);
        }
        if (text === '/info') {
            return bot.sendMessage(chat_id, `Тебя зовут ${msg.chat.first_name} ${msg.chat.last_name}`);
        }

        if (text === '/game') {
            startGame(chat_id);
            return;
        }
    
        console.log(chats);
        return bot.sendMessage(chat_id, `Я не знаю такой команды, попробуй иначе!`);
        
    })

    bot.on('callback_query', async (msg) => {
        const chat_id = msg.message.chat.id;
        const text = msg.data;

        console.log(msg);
        if (text === '/game') {
            startGame(chat_id);
            return;
        }

        if (chats[chat_id] && chats[chat_id] == text) {
            return bot.sendMessage(chat_id, `Поздравляю! Я действительно загадал цифру ${text}`, againOptions);
        } else {
            return bot.sendMessage(chat_id, `Неверно, я загадал цифру ${chats[chat_id]}. Попробуй ещё!`, againOptions);
        }
    });
}

start();