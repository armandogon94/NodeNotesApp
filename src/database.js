const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/notes-db-app',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
 .then(db => console.log('DB is connected'))//promesa si se cumple
 .catch(err => console.error(err))//error si no se cumple