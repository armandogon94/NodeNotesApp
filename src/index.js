const express = require('express')//framework
const path = require('path')//directorio donde estamos
const exphbs = require('express-handlebars')//view engine
const methodOverride = require('method-override')
const session = require('express-session')//para sesiones de usuario
const flash = require('connect-flash')//mensajes globales a la aplicacion
const passport = require('passport')//autenticacion de usuarios
//Initializations
const app = express()
require('./database')
require('./config/passport')
//Settings
app.set('port', process.env.PORT || 3000)//definiendo el puerto de acceso
app.set('views', path.join(__dirname,'views'))
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),//plantillas completas
    partialsDir: path.join(app.get('views'),'partials'),//pedazos de html reusables
    extname: '.hbs'
}))
app.set('view engine','.hbs')//motor de vistas llamado handlebars

//Middlewares
app.use(express.urlencoded({extended: false}))//trae los datos encriptados, extended: false para que no encripte imagenes
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mysecretapp',//clave secreta solo para el desarrollador
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1800000
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Global Variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg')//mensajes de exito de flash
    res.locals.error_msg = req.flash('error_msg')//mensajes de errores de flash
    res.locals.error = req.flash('error')//mensajes de errores de passport en flash
    res.locals.user = req.user || null
    next()
})
//Routes
app.use(require('./routes/index'))//redireccionamiento hacia routes/*.js para cada url
app.use(require('./routes/notes'))
app.use(require('./routes/users'))
//Static Files
app.use(express.static(path.join(__dirname,'public')))
//Server is Listening
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})