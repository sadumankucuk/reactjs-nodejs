const express = require('express');
var cors = require('cors')

const bodyParser = require('body-parser');

const contactsRoute = require('./routes/contacts.route');
const userRoute = require('./routes/user.route');

const app = express();
app.use(cors())

app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/contact", contactsRoute);


module.exports = app;
