const passport = require('passport');

exports.isAuth = (req, res, done) => {
  //console.log('isAuth is called.........');
  return passport.authenticate('jwt')
};

exports.sanitizeUser = (user)=>{
  console.log('user from sanitizeUser :',user);
    return {id:user.id, role:user.role}
}

//-----------------------------------------