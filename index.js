require("dotenv").config();
const express = require('express');
const fetch = require('node-fetch');
require("dotenv").config();
const app = express();

app.use(express.json());

app.post("/alertmanager", (req, res) => {
    try {
        const { alerts, status } = req.body;
        console.log(req.body);
        const description = alerts[0].annotations.description;
        const summary = alerts[0].annotations.summary;
        let message;

        if (status === "firing") {
            message = JSON.stringify({
                'text': description,
            });
        } else if (status === "resolved") {
            message = JSON.stringify({
                'text': `\`${summary}\` was resolved.`,
            });
        } else {
            return;
        }

        fetch(process.env.webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: message,
        })
    } catch (error) {
        console.error(`Google chat error: ${error}`);
    } finally {
        console.log(res.status);
        res.status(200).send("request succesful");
    }
})

app.get('*', (req, res) => {
    res.status(404).send("What you tryna do!?");
});

// middleware for handling 500 error in requests
app.use((error, req, res, next) => {
    res.status(500)
    res.send({ error: error })
    console.error(error.stack)
    next(error)
})


app.listen(process.env.PORT, () =>
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
);