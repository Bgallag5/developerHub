const express = require('express');
const connectionDB = require('./config/connection');

const PORT = process.env.PORT || 3001
const app = express();

//connect DB
connectionDB();

//middleware
app.use(express.json({extended: false }))

app.get('/', (req, res) => {
    res.send('Home route working')
})

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => {
    console.log(`🌏 APP is Listening on port ${PORT}`);
})