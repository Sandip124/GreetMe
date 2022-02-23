const express = require("express")
const app = express()
const port = 3000

const uniqueRandomArray  = require("unique-random-array");
const morningGreetings = require("./data/greetings.js");
const dayGreetings = require("./data/day.js");
const eveningGreetings = require("./data/evening.js");
const nightGreetings = require("./data/night.js");

const { registerFont,createCanvas } = require('canvas')
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

const getColorPair = require("random-color-pair");



app.get('/',
    async (req, res) => {

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

        if (typeof heading != 'undefined' && heading !== '') {
            message = heading;
        }

        if (typeof text != 'undefined' && text !== '') {
            textMessage = text;
        }

        if (typeof greet != 'undefined' && greet === "true") {
            //let randomMessage = hours < 12 ? uniqueRandomArray(morningGreetings.greetings) : hours < 18 ? uniqueRandomArray(dayGreetings.greetings) : hours < 21 ? uniqueRandomArray(eveningGreetings.greetings) : uniqueRandomArray(nightGreetings.greetings);
            let randomMessage;
            if(hours < 12){
                randomMessage = uniqueRandomArray(morningGreetings.greetings)
            }else if(hours >= 12 && hours < 18)
            {
                randomMessage = uniqueRandomArray(dayGreetings.greetings)
            }else if(hours >=18 && hours < 21){
                randomMessage = uniqueRandomArray(eveningGreetings.greetings)
            }else{
                randomMessage = uniqueRandomArray(nightGreetings.greetings)
            }
            
            message = randomMessage();
            textMessage = randomMessage();
        }
        const width = 1200
        const height = 250

        registerFont("poppins-Regular.ttf", {family: "Poppins", weight: "400", style: "Regular"})
        registerFont("poppins-Bold.ttf", {family: "Poppins", weight: "700", style: "Bold"})
        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        const [foreground, background] = getColorPair();


        context.fillStyle = background;
        roundedRect(context, 0, 0, width, height, 16);
        context.font = '700 36px Poppins, Sans-Serif;'
        context.textAlign = 'center'
        context.textBaseline = 'top'

        context.fillStyle = foreground
        await fillTextWithTwemoji(context, message, 600, 70);

        context.font = '400 18px Poppins, Sans-Serif;'
        await fillTextWithTwemoji(context, `${textMessage}`, 600, 150);

        const buffer = canvas.toBuffer('image/png')
        res.contentType('image/jpeg');
        res.send(buffer);

    })

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.fill();
    ctx.stroke();
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})