const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/welcome', (req, res) => {
    const userName = "Rathi"; 
    
    res.render('welcome', { name: userName });
});

app.listen(PORT, (err) => {
    if(err) return console.log('Error: ', err);
    else console.log(`Server is running on ${PORT}`);
});
