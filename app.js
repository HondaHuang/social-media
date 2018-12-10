const express = require('express');
const app = express();
const path = require('path');
// To handle HTTP POST request in Express.js version 4 and above,
// body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body.
const bodyParser = require('body-parser');

// Move to a routes folder later
app.get('/', (req, res) => {
  res.send('hello');
})
app.listen(3000);
