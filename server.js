//Importing express
const express = require('express');
//Initializing app
const app = express();

//Getting enviroment variables
require('dotenv').config();

//requiring and initializing online-log
const online_log = require("online-log")
const log = online_log.log;

//Initializing online-log
online_log(app, {enable_console_print: true, enable_colorful_console: true});

//("DEBUG", "This is a debug log line")

//Function router
app.use('/functions', require('./functions/router'));
app.get('/api', function (req, res) {
  log("DEBUG", {
    test: "prueba",
    casa: "respuesta",
    objeto: {
      prop: "3",
      num: 4
    }
  });

  
  res.send('Hello World!');

});

app.listen(process.env.PORT, function () {
  console.log(`Functions service running on port ${process.env.PORT}`);
});