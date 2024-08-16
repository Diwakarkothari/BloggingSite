const express = require('express');

app=express();
const PORT = 8000;

app.set('view engine','ejs');

app.listen(PORT,()=> console.log('Server started at PORT ',PORT));