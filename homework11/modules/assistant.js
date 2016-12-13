var CryptoJS = require('crypto-js');

function randomStr(len) {
  var pos;
  var str = '';
  var domain = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < len; ++i) {
    pos = Math.floor(Math.random() * 62);
    str += domain[pos];
  }

  return str;
}

function decryptPassword(encryptedStr, token) {
  var key = CryptoJS.enc.Utf8.parse(token.slice(7, 23));
  var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedStr);
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  return decryptedData.toString(CryptoJS.enc.Utf8);
}

exports.randomStr = randomStr;
exports.decryptPassword = decryptPassword;
