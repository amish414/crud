const express = require('express')
const app = express.Router()

const service = require('../services/renderFIle');

app.get('/', (req, res) => {
    res.render('LoginPage');
});
app.post('/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username === 'amish') {
        return res.render("ProductPage");
    }
});
// app.post('/product_page', service.homepage);
// module.exports = app;