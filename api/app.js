const CONFIG = require('./config.json');
const SECURITY = require('./keys.json');
const INFO = require('./info.json');
const app = require('express')();
const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const { color, log } = require('console-log-colors');
const { greenBright, redBright, yellowBright, magentaBright } = color;

log(redBright(`[!] Openguess API is starting...`));
console.clear();

log(redBright(`
█▀▀▀█ █▀▀█ █▀▀ █▀▀▄ █▀▀▀ █  █ █▀▀ █▀▀ █▀▀ 
█   █ █▀▀▀ █▀▀ █  █ █ ▀█ █  █ █▀▀ ▀▀█ ▀▀█ 
█▄▄▄█ .API ▀▀▀ ▀  ▀ ▀▀▀▀  ▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀
  by ${INFO.AUTHOR} - v.${INFO.VERSION} - ${INFO.LAST_BUILD}
`));

if (CONFIG.CORS_ENABLED) {
    app.use(cors({
        origin: CONFIG.CORS_ORIGIN,
    }));
} else {
    app.use(cors({
    	origin: '*',
    }));
}

async function setupAPI() {
    log(greenBright(`[+] Openguess API started on port ${CONFIG.WEB_PORT_HTTP}`));
    log(yellowBright(`Waiting for requests...`));
}

app.listen(
    CONFIG.WEB_PORT_HTTP,
    () => setupAPI()
)

if (CONFIG.USE_HTTPS) {
    log(yellowBright(`[!] Loading HTTPS keys...`));
    https
    .createServer(
        {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem'),
        ca: fs.readFileSync('./cert/chain.pem'),
        },
        app
    )
    .listen(CONFIG.WEB_PORT_HTTPS, () => {
        log(greenBright(`[+] HTTPS is running on port ${CONFIG.WEB_PORT_HTTPS}`));
    })
}

app.get('/api' + CONFIG.API_VERSION + '/openguess', (req, res) => {
    const apiKey = req.query.apiKey;
    const mapId = req.query.mapId;
    if (SECURITY.PUBLIC_APIKEYS.includes(apiKey)) {
        fs.readFile(`./data/${mapId}.json`, (err, data) => {
            if (err) {
                res.status(404).send('Map not found');
                if (CONFIG.REQUEST_LOGGING)
                log.red("[404] Invalid map name provided.");
            } else {
                res.status(200).send(data);
                if (CONFIG.REQUEST_LOGGING)
                log.green("[200] Map data sent.");
            }
        });
    } else {
        res.status(401).send('Invalid API key');
        if (CONFIG.REQUEST_LOGGING)
        log.red("[401] Invalid API key provided.");
    }
});

app.get('/api' + CONFIG.API_VERSION + '/maps', (req, res) => {
    const apiKey = req.query.apiKey;
    if (SECURITY.PUBLIC_APIKEYS.includes(apiKey)) {
        fs.readFile(`./data/MapsDB.json`, (err, data) => {
            if (err) {
                res.status(404).send('Database file not found');
                if (CONFIG.REQUEST_LOGGING)
                log.red("[404] File not found.");
            } else {
                res.status(200).send(data);
                if (CONFIG.REQUEST_LOGGING)
                log.green("[200] Maps database sent.");
            }
        });
    } else {
        res.status(401).send('Invalid API key');
        if (CONFIG.REQUEST_LOGGING)
        log.red("[401] Invalid API key provided.");
    }
});

app.use('/cdn', express.static('img'));