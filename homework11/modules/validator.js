var validator = {
  checkUsername: function(username) {
    return /^[a-zA-Z][0-9a-zA-Z_]{5,17}$/.test(username);
  },
  checkPassword: function(password) {
    return /^[0-9a-zA-Z\-_]{6,12}$/.test(password);
  },
  checkStuID: function(stuID) {
    return /^[1-9]\d{7}$/.test(stuID);
  },
  checkPhone: function(phone) {
    return /^[1-9]\d{10}$/.test(phone);
  },
  checkEmail: function(email) {
    return /^\w+([-+.]\w+)*@(([0-9a-zA-Z_\-]+\.)+[a-zA-Z]{2,4})$/.test(email);
  },
  isValidUser: function(user) {
    return this.checkUsername(user.username) && this.checkPassword(user.password) &&
           this.checkStuID(user.stuID) && this.checkPhone(user.phone) &&
           this.checkEmail(user.email);
  }
}

module.exports = validator;