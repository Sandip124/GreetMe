const express = require("express")
const app = express()
const port = 3000

const uniqueRandomArray  = require("unique-random-array");
const morningGreetings = require("./data/greetings.js");
const dayGreetings = require("./data/day.js");
const eveningGreetings = require("./data/evening.js");
const nightGreetings = require("./data/night.js");

const { createCanvas } = require('canvas')
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

const getColorPair = require("random-color-pair");



app.get('/', async (req, res) => {

    const {
        greet,
        heading,
        text
    } = req.query;
    
    res.setHeader("Cache-Control", `public, max-age=${5}`);

    const currentDate = new Date();
    const hours = currentDate.getHours();

    let message = "Welcome to my github page.";
    let textMessage = "weeeeeeeeeee weeeeeeeeeee";
    
    if(typeof heading != 'undefined' && heading !== ''){
        message = heading;
    }

    if(typeof text != 'undefined' &&  text !== ''){
        textMessage = text;
    }
    
    if(typeof greet != 'undefined' && greet === "true") {
        let randomMessage = hours < 12 ? uniqueRandomArray(morningGreetings.greetings) : hours < 18 ? uniqueRandomArray(dayGreetings.greetings) : hours < 21 ? uniqueRandomArray(eveningGreetings.greetings) : uniqueRandomArray(nightGreetings.greetings);
        message = randomMessage();
        textMessage = randomMessage();
    }
    const width = 1200
    const height = 250

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    const [foreground, background] = getColorPair();


    context.fillStyle = background;
    context.fillRect(0, 0, width, height)
    context.font = '600 42px  Ubuntu, Sans-Serif;'
    context.textAlign = 'center'
    context.textBaseline = 'top'

    context.fillStyle = foreground
    //context.fillText(message, 600, 70)
    await fillTextWithTwemoji(context, message, 600, 70);

    context.font = '600 16px Ubuntu, Sans-Serif;'
    await fillTextWithTwemoji(context, `${textMessage}`, 600, 150);
    //context.fillText(`(${textMessage})`, 600, 150)
    
    const buffer = canvas.toBuffer('image/png')
    res.contentType('image/jpeg');
    res.send(buffer);

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})