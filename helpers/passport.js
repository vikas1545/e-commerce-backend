
const passport = require('passport')
const LocalStrategy = require('passport-local')

const verifyCallback = async function (username, password, done) {
    console.log("username :",username);
      try {
        const user = await User.findOne({ email: username }).exec();
        if (!user) { 
          done(null,false,{message: "No such user email"});
        } else if (user.password === password) {
          done(null,user)
        } else {
          done(null,false,{ message: "Invalid credentials" });
        }
      } catch (err) {
        done(err)
      }
    }
  //local Stategy
  const strategy = new LocalStrategy(verifyCallback)
  passport.use(strategy)
  
  //this create session variable req.user on being called from callbacks
  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, {id:user.id,role:user.role});
    });
  });
  
  //this changes session variable req.user on being called from authorized request
  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
  