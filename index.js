const express = require("express")
const app = express()
const port = 3000

const uniqueRandomArray = require("unique-random-array");
const morningGreetings = require("./data/greetings.js");
const dayGreetings = require("./data/day.js");
const eveningGreetings = require("./data/evening.js");
const nightGreetings = require("./data/night.js");
const colorPairs = require("./data/colors.js");

const { registerFont, createCanvas } = require('canvas')
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

app.get('/',
    async (req, res) => {

        const {
            greet,
            heading,
            text,
            darkmode = false,
            w=1200,
            h=250
        } = req.query;

        res.setHeader("Cache-Control", `public, max-age=${5}`);

        const currentDate = new Date(getDateFromOffset(getTimeZoneOffset()));
        const hours = currentDate.getHours();

        let message = "Hello Everyone this is greeter.";
        let textMessage = "weeeeeeeeeee weeeeeeeeeee";

        if (typeof heading != 'undefined' && heading !== '') {
            message = heading;
        }

        if (typeof text != 'undefined' && text !== '') {
            textMessage = text;
        }

        if (typeof greet != 'undefined' && greet === "true") {
            let randomMessage;
            if (hours < 12) {
                randomMessage = uniqueRandomArray(morningGreetings.greetings)
            } else if (hours >= 12 && hours < 18) {
                randomMessage = uniqueRandomArray(dayGreetings.greetings)
            } else if (hours >= 18 && hours < 21) {
                randomMessage = uniqueRandomArray(eveningGreetings.greetings)
            } else {
                randomMessage = uniqueRandomArray(nightGreetings.greetings)
            }

            message = randomMessage();
            textMessage = randomMessage();
        }

        let width = 0
        let height = 0

        if (typeof w != 'undefined' && w !== '') {
            width = w;
        }

        if (typeof h != 'undefined' && h !== '') {
            height = h;
        }

        registerFont("poppins-Regular.ttf", { family: "Poppins", weight: "400", style: "Regular" })
        registerFont("poppins-Bold.ttf", { family: "Poppins", weight: "700", style: "Bold" })
        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')

        let background;
        let foreground;

        if (typeof darkmode != 'undefined' && darkMode === "true") {
            if (darkmode) {
                background = `#3b4252`;
                foreground = `#FFFFFF`;
            } else {
                const colors = uniqueRandomArray(colorPairs.colorPairs);
                background = `${colors()[0]}`;
                foreground = `${colors()[1]}`;
            }
        }
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

const getTimeZoneOffset = () => {
    const timezoneOffset = new Date().getTimezoneOffset()
    const offset = Math.abs(timezoneOffset)
    const offsetOperator = timezoneOffset < 0 ? '+' : '-'
    const offsetHours = (offset / 60).toString().padStart(2, '0')
    const offsetMinutes = (offset % 60).toString().padStart(2, '0')

    return `${offsetOperator}${offsetHours}`
}

function getDateFromOffset(offset) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    console.log(d.getTimezoneOffset());
    // create new Date object for different city
    // using supplied offset
    var newDate = new Date(utc + (3600000 * offset));

    // return time as a string
    return newDate.toLocaleString();
}

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})