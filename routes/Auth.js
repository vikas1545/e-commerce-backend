const express = require('express');
const {createUser,loginUser,checkUser} = require('../controller/Auth');
const passport = require('passport')


const router =express.Router();


router.post('/signup',createUser);
router.post('/login',passport.authenticate('local'),loginUser);
router.get('/check',passport.authenticate('jwt'),checkUser);

exports.router=router;