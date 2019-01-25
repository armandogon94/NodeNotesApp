const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
router.get('/users/signin',(req,res) => {
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup',(req,res) => {
    res.render('users/signup')
})

router.post('/users/signup', async (req,res) => {
    const {name,email,password,confirm_password} = req.body
    const errors = []
    if(name.length == 0){
        errors.push({text: 'Please insert your Name!'})
    }
    if(email.length == 0){
        errors.push({text: 'Please insert your Email!'})
    }
    if(password.length == 0){
        errors.push({text: 'Please insert your Password!'})
    }
    if(confirm_password.length == 0){
        errors.push({text: 'Please confirm your Password!'})
    }
    if(password != confirm_password && password.length > 0 && confirm_password.length > 0){
        errors.push({text: 'Password does not match!'})
    }
    if(password.length < 4 && password.length > 0){
        errors.push({text: 'Password must be at least 4 characters long!'})
    }
    if(errors.length > 0){
        res.render('users/signup',{errors,name,email,password,confirm_password})
    }else{
        const emailUser = await User.findOne({email: email})
        if (emailUser){
            req.flash('error_msg', 'The e-mail is already in use!')
            res.redirect('/users/signup')
        }else{
            const newUser = new User({name,email,password})
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('success_msg','You are now registered!')
            res.redirect('/users/signin')
        }
        
    }
})
router.get('/users/logout',(req,res) => {
    req.logout()
    res.redirect('/')
})
module.exports = router