const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const mongoClient = require('mongoose')


//setup connect mongodb by mongoose
mongoClient.connect('mongodb://127.0.0.1:27017', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('Connected database from mongodb ✅'))
.catch(()=> console.error(`Connect database failed❌`))

const app = express()

const userRoute = require('./routes/user')
const deckRoute = require('./routes/deck')


app.use(logger('dev'))
app.use(bodyParser.json())

//Routes
app.use('/decks' , deckRoute)
app.use('/users' , userRoute)

app.get('/' , (req,res,next) => {
    return res.status(200).json({
        message : 'Server is OK!'
    })
})


app.use((req,res,next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})
//Error handler function
app.use((err, req , res , next) =>{
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    //response to client
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})

const port = app.get('port') || 3000
app.listen(port , () => console.log(`Server is listening on port ${port}`)) 