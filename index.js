import express from 'express';

const app = express()
const port = 3000

import uniqueRandomArray from 'unique-random-array';
import morningGreetings from './data/greetings.js';
import dayGreetings from './data/day.js';
import eveningGreetings from './data/evening.js';
import nightGreetings from './data/night.js';

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/greet', async (req, res) => {

    res.setHeader("Content-Type", "image/svg+xml");
    
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const message = hours < 12 ? uniqueRandomArray(morningGreetings.greetings) : hours < 18 ? uniqueRandomArray(dayGreetings.greetings) : hours < 21 ? uniqueRandomArray(eveningGreetings.greetings) : uniqueRandomArray(nightGreetings.greetings);
        
    return res.send(
        `
    <svg width="495" height="120" viewBox="0 0 495 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
    .header { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: #ffffff }
    </style>
    <rect x="0.5" y="0.5" width="494" height="79%" rx="4.5" fill="#180040" stroke="#E4E2E2"/>
    <text x="25" y="45" class="header">${message()}</text>
    </svg>
  `);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})