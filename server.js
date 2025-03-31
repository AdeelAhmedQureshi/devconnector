const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


const app = express();
//DB config
const db = require('./config/keys').mongoURI; 

//connect DB with mongoose
mongoose.connect(db)     // it returns promise while tried for connection establishment.
    .then(()=> console.log("MongoDB Connected!"))
    .catch((err)=> console.log(err));

// app.get(routes, req/res_callback_func)
app.get('/', (req, res) => res.send('Hello World') );

// Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;  //   deploying where or local(5000) 

app.listen(port, ()=> { console.log(`server is running on port ${port}`)})