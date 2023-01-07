const express = require('express');
const db = require('croxydb');
const moment = require('moment');
const app = express();


app.get('/:code', (req, res) => {
    let code = req.params.code;
    let url = db.fetch(`url_${code}`);
    if(!url) return res.send('Bu kod ile kayıtlı bir url bulunamadı.');
    let user = {
        ip: req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        agent: req.headers['user-agent'],
        time: moment().format('DD/MM/YYYY HH:mm:ss')
    }
    let logs = db.fetch(`logs_${code}`);
    if(!logs) db.set(`logs_${code}`, []);
    db.push(`logs_${code}`, user);
    res.redirect(url);
});

app.get('/logs/:code', (req, res) => {
    let code = req.params.code;
    let logs = db.fetch(`logs_${code}`);
    if(!logs) return res.send('Bu kod ile kayıtlı bir url bulunamadı.');
    res.json(logs);
});

app.use((req, res) => {
    res.send('404');
});

app.listen(80, () => {
    console.log(`Sunucu başlatıldı. Port: 80`);
});