const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const {User} = require('./model/User')
const { createProduct } = require("./controller/Product");
const productRouter = require("./routes/Products");
const categoryRouter = require("./routes/Category");
const brandRouter = require("./routes/Brand");
const userRouter = require("./routes/User");
const cors = require("cors");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");

const {isAuth,sanitizeUser} = require('./services/common')

const SECRET_KEY = 'SECRET_KEY';
// JWT options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY; // TODO: should not be in code;

const server = express();

server.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));
server.use(passport.initialize());
server.use(passport.session());


server.use(cors({ exposedHeaders: ["X-Total-Count"] }));
server.use(express.json());
server.use("/products",isAuth(), productRouter.router);
server.use("/categories",isAuth(), categoryRouter.router);
server.use("/brands",isAuth(), brandRouter.router);
server.use("/user",isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart",isAuth(), cartRouter.router);
server.use("/orders",isAuth(), orderRouter.router);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected..");
}

server.listen(8080, () => {
  console.log("server started..");
});

//local Stategy
passport.use('local',new LocalStrategy({
  // override with email instead of email instead of userame
      usernameField: "email",
      passwordField: "password",
    },async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email }).exec();
/*
       if (!user) { 
        done(null,false,{message: "No such user email"});
      } else if (user.password === password) {
        done(null,user)
      } else {
        done(null,false,{ message: "Invalid credentials" });
      } 
      */

        if (!user) {
          return done(null, false, { message: 'invalid credentials' }); // for safety
      }
        crypto.pbkdf2(password,user.salt,310000,32,'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'invalid credentials' });
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          done(null, token); // this lines sends to serializer
      }
);

    } catch (err) {
      done(err)
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
console.log("jwt_payload :: ",{ jwt_payload });
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//this create session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log('serialiedUser ----------------------------------------:',user);
  process.nextTick(function () {
    return cb(null, {id:user.id,role:user.role});
  });
});

//this changes session variable req.user on being called from authorized request
passport.deserializeUser(function (user, cb) {
  console.log('deserialiedUser ************** :',user);
  process.nextTick(function () {
    return cb(null, user);
  });
}); 
