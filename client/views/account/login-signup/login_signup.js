//Login action
Template.loginForm.events({
  //Normal login
  'submit #loginForm' : function(e, t) {
    e.preventDefault();
    var username = trimInput(t.find('input[name=username]').value.toLowerCase())
      , password = t.find('input[name=password]').value;

    if (isNotEmpty(username, 'loginError')
        && isNotEmpty(password, 'loginError')){
      Meteor.loginWithPassword(username, password, function(err){
        if (err && err.error === 403) {
          // Session.set('displayMessage', '用户名或密码不正确');
          FlashMessages.clear();
          FlashMessages.sendError("用户名或密码不正确");
        } else {
          t.$('#loginModal').modal('hide');
          NotificationMessages.sendSuccess('登陆成功','欢迎回来');
          Router.go(Session.get('currentPath') || 'landing');
        }
      });
    }
    return false;
  },
  //facebook login
  'click #facebookLogin' : function(e, t){
    e.preventDefault();
    Meteor.loginWithFacebook(function(err){
      if (err && err.error === 403) {
        Session.set('displayMessage', 'Login Error: email or password is not correct.');
      } else {
        Router.go(Session.get('currentPath') || 'landing');
      }
    });
  },
  //google login
  'click #googleLogin' : function(e, t){
    e.preventDefault();
    Meteor.loginWithGoogle(function(err){
      if (err && err.error === 403) {
        Session.set('displayMessage', 'Login Error: username or password is not correct.');
      } else {
        Router.go(Session.get('currentPath') || 'landing');
      }
    });
  }
});

Template.loginForm.rendered = function() {
  render();
};

// Validators, helpers

// Trim Input
function trimInput(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

// Validations
function isEmail(val) {
  if (val.indexOf('@') !== -1) {
      return true;
    } else {
      FlashMessages.clear();
      FlashMessages.sendError("无效邮箱地址");
      return false;
    }
}

function isValidPassword(val) {
  if (val.length >= 6) {
    return true;
  } else {
    FlashMessages.clear();
    FlashMessages.sendError("请输入六位以上的密码");
    return false;
  }
}

function isNotEmpty(val) {
  // if null or empty, return false
  if (!val || val === ''){
    FlashMessages.clear();
    FlashMessages.sendError("请填写所有必须填写的栏目");
    return false;
  }
  return true;
}

function isValidType(val) {
  // if null or empty, return false
  if (val!=1 && val!=2 ){
    Session.set('displayMessage', 'Error & Undefined Type.');
    return false;
  }
  return true;
}

function isSame(val1,val2) {
  // if not the same the passwords
  if(val1 !== val2 ){
    FlashMessages.clear();
    FlashMessages.sendError("重复输入密码不同");
    return false;
  }
  return true;
}

function isValidName(val){
  userRegex = /^[-\w\.\$@\*\!]{1,30}$/;
  if(!val.match(userRegex)){
    FlashMessages.clear();
    FlashMessages.sendError("无效用户名");
    return false;
  }
  if (val.length < 3) {
    FlashMessages.clear();
    FlashMessages.sendError("用户名需要三位数以上");
    return false;
  }
  return true;
}

// Create an account and login the user.
Template.signupForm.events({
  'submit #signupForm' : function(e, t) {
    e.preventDefault();
    var email = trimInput(t.find('input[name=email]').value.toLowerCase())
      , password = t.find('input[name=password]').value
      , password2 = t.find('input[name=passwordAgain]').value
      , username = t.find('input[name=username]').value;
    if (isNotEmpty(email)
        && isNotEmpty(password)
        && isEmail(email)
        && isValidPassword(password)
        && isSame(password,password2)
        && isNotEmpty(username)
        && isValidName(username))
    {
      Accounts.createUser({
        username: username,
        email: email,
        password: password
      }, function(err){
        if (err && err.error === 403) {
          // Session.set('displayMessage', '用户名或密码不正确');
          FlashMessages.clear();
          FlashMessages.sendError(err.reason);
        } else {
          t.$('#signupModal').modal('hide');
          swal('验证邮箱', '一封验证邮件已发送，请查收', 'success');
          NotificationMessages.sendSuccess('注册成功','欢迎您的加入');
          Router.go(Session.get('currentPath') || 'landing');
        }
      });
    }else{

    }
    return false;
  }

});

Template.signupForm.rendered = function() {
  render();
};

Template.signupForm.helpers({
  agency: function(){
    return Config.getAgency();
  }
})