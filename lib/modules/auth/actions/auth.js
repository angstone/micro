class SIGNUP {
  constructor(user, req) {
    this.type = 'auth_signup';
    this.user = user;
    this.payload = req;
  }
}

module.exports = { SIGNUP };
