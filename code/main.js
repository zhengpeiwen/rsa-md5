import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import jsrsasign from 'jsrsasign';
import jsencrypt from 'jsencrypt';
import crypto from 'crypto-js';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


// npm install jsrsasign  Java兼容
// main.js 引入 import jsrsasign from ‘jsrsasign’

Vue.prototype.signString = function (signData) {
  // 私钥加签   '-----BEGIN PRIVATE KEY-----这里是私钥-----END PRIVATE KEY-----'
  let privateKey = "-----BEGIN PRIVATE KEY-----" +
    "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIdPYU5M9/i/0o"
    + "Vj+gNsGyBh9UyjwDIR5QaVirjXoUahYNIBkk8ON4ieZ+GnXqgqkTnWj0QDlLG88Vtt"
    + "PZ65he/g+9CgliZcaoCrzXbnIKNQQN/BniwlBHPxh5mlIOwLcD6wknvrjn+b+9Oi1kwh"
    + "Xz1TzGjRFU/xKW389NqMZ1YrAgMBAAECgYAuF89o8fVC6m1XfUAsrEXtWRFLwz"
    + "h0lf3zqTtxThslSVIHF/v0LD6krnlquC4ZkS6ZikqRe7rKdTeu0l68VCyYkt71mdNa+dZV"
    + "O+xvi6m/+Qr+9YUtGu0bGwees/XfUV6oouwFdrbDkA1mVva/IWH9WWcyAUxWOBf"
    + "vtrLB2tN42QJBANzETldhhhb67vrCWVE0TiVILS+rq7faHolXPjRrWHX/ArWvvkPwKn"
    + "XPNqbNqAZjRWA9aPDQh7nwCU26f6bUJk8CQQCc56LX1/mqXVAY+9kAJlY2tskP"
    + "97kyvR8zenij1XlyoP5/vAMxh3D+NlsLl+twnkCLVD/j9QX+qtaUHVlI4vdlAkBLAT8EnR"
    + "OrlxG+jG1AE59BN2ZyvcaXrjmVu9hcguQJItzO0ai4+E3UvNP6lAC0OuIFMpgGyTJz"
    + "z8O5btWT3pwtAkAIVYFfx5f6RZSQjyf6iw6/Pzw0veq3WDZFDLdFtHwL66M486qTw"
    + "ebticOSPRKDW9R/0gzGtegIm9hj658ncO7FAkEAggS+JU62iNHJhSw277CYNvlaiM"
    + "pg4ZKVwMtzfvqv3TMHbCqfCBxnuEspqWLatSFJUPGctce8POhDWjvxiTTHig=="
    + "-----END PRIVATE KEY-----";
  // 与后端约定好算法 SHA1withRSA  
  let sig = new jsrsasign.KJUR.crypto.Signature({ "alg": "SHA1withRSA", "prov": "cryptojs/jsrsa", "prvkeypem": privateKey });// 初始化的对象 设置好加签或验签的算法和私钥
  let hashAlg = 'sha1'; // 设置sha1
  let sign = sig.signString(signData, hashAlg); // 加签 使用字符串对符号执行最终更新，然后将所有数据更新的签名字节作为16进制字符串返回
  sign = jsrsasign.hextob64(sign); // 将16进制转化为base64
  return sign;
}

Vue.prototype.verify = function (signData, data) {
  // signData: 加签的数据
  // data: 加签之后得到的签文
  // 公钥验签  '-----BEGIN PUBLIC KEY-----这里是公钥-----END PUBLIC KEY-----'
  let publicKey = "-----BEGIN PUBLIC KEY-----" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPhDuZsuI7vga1HZvC9cn/Pb1s40CT48iqnyhS8UnLb8k6mfpzBidiJMSpGpaYubW0n9FYuoBCnSd2"
    + "+IOxwZ5d1XMMWTJ3ujlxL/CWir+V9ZJX23Xcp+vxQ5KWKXtH1v1Y54xhZddf9SqSD5c/GNQqG0w7DS81N3vGPEGYFSUnTQIDAQAB"
    + "-----END PUBLIC KEY-----";
  // 与加签算法一致 SHA1withRSA 
  let sig = new jsrsasign.KJUR.crypto.Signature({ "alg": "SHA1withRSA", "prov": "cryptojs/jsrsa", "prvkeypem": publicKey }); // 初始化的对象 设置好加签或验签的算法和公钥
  sig.updateString(signData); // 更新要由十六进制字符串签名或验证数据
  data = jsrsasign.b64tohex(data); // 将base64 转化为16进制
  let result = sig.verify(data); // 验签
  return result;
}

Vue.prototype.encrypt = function (signData) {
  // 加密数据 signData
  // 公钥加密
  let publicKey = "-----BEGIN PUBLIC KEY-----" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPhDuZsuI7vga1HZvC9cn/Pb1s40CT48iqnyhS8UnLb8k6mfpzBidiJMSpGpaYubW0n9FYuoBCnSd2"
    + "+IOxwZ5d1XMMWTJ3ujlxL/CWir+V9ZJX23Xcp+vxQ5KWKXtH1v1Y54xhZddf9SqSD5c/GNQqG0w7DS81N3vGPEGYFSUnTQIDAQAB"
    + "-----END PUBLIC KEY-----";
  let pub = jsrsasign.KEYUTIL.getKey(publicKey); // 获取公钥
  let enc = jsrsasign.KJUR.crypto.Cipher.encrypt(signData, pub); // 加密
  enc = jsrsasign.hextob64(enc); // 将16进制转化为base64
  return enc;
}

Vue.prototype.decrypt = function (signData) {
  //  解密数据 signData
  // 私钥解密
  let privateKey = "-----BEGIN PRIVATE KEY-----" + "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAI+EO5my4ju+BrUdm8L1yf89vWzjQJPjyKqfKFLxSctvyTqZ"
    + "+nMGJ2IkxKkalpi5tbSf0Vi6gEKdJ3b4g7HBnl3VcwxZMne6OXEv8JaKv5X1klfbddyn6/FDkpYpe0fW/VjnjGFl11"
    + "/1KpIPlz8Y1CobTDsNLzU3e8Y8QZgVJSdNAgMBAAECgYBLDzmstSYlYMlZSFcCrFItMDk2DdTkhCmbMwp/9rpFr/1qrMWUCw"
    + "/mAJzqZIGG9vnVshBne4NBU7gkPO2DtmQAmAfZkjZWmGXSkiL2tMzq3TUdZtVSVMrWRMft4/VuU1T/GWJsjM/wYwj+x/eWY2AkCs+/vLC2"
    + "+OlOubrAXmtu8QJBAPklSIWYYqn3"
    + "/rKtQMqtBZU5S37rj99bqi5vTRIlImjsNm7uASyzjxtLRRqo4pnD4rAm6JU9X8lymIbSwjcxPrMCQQCTdwKyxREKMBj0LzkDHXiMzVzQyz1hyM71IAn"
    + "+51onYy74l6O3ghAauIn8BhCIGMw4qItoQcCQmWsb+7X7QwH/AkBS2x5SJ4pwYiQXAd0xSfc4WDSOQgK30kE3bhZgeW8HG79Chu5nElP"
    + "+TLrvkcjCQE3MLTReJWoMkYq+E6s5NaxXAkBLQS/SVXlVrqf9bV/19ANCL8dPEnkXvufG9nvDZwN"
    + "+GEKvQIufKbPYPxbD08B6A9WskG7cXLnN0U108Wa0fES3AkBlWj7DCpYyYtAAqvpkM+9PBej5OP0beAmxN9reC5dBpinR+MuDypsdEC+gZ"
    + "/oLcsj2z6mtMlrCt1xVP1I6mIqf" + "-----END PRIVATE KEY-----";

  let prv = jsrsasign.KEYUTIL.getKey(privateKey); // 获取私钥
  signData = jsrsasign.b64tohex(signData); // 将base64 转化为16进制
  let dec = jsrsasign.KJUR.crypto.Cipher.decrypt(signData, prv); // 解密
  return dec;
}

// npm install jsencrypt Java不兼容
// main.js 引入 import jsencrypt from ‘jsencrypt’
// npm install crypto-js
// main.js 引入 import crypto from ‘crypto-js’
Vue.prototype.encrypt1 = function (signData) {
  // 加密数据 signData
  // 公钥加密
  let publicKey = "-----BEGIN PUBLIC KEY-----" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPhDuZsuI7vga1HZvC9cn/Pb1s40CT48iqnyhS8UnLb8k6mfpzBidiJMSpGpaYubW0n9FYuoBCnSd2"
    + "+IOxwZ5d1XMMWTJ3ujlxL/CWir+V9ZJX23Xcp+vxQ5KWKXtH1v1Y54xhZddf9SqSD5c/GNQqG0w7DS81N3vGPEGYFSUnTQIDAQAB"
    + "-----END PUBLIC KEY-----";
  let encrypt = new JSEncrypt();  // 初始化对象
  encrypt.setPublicKey(publicKey); // 获取公钥
  let enc = encrypt.encrypt(signData); // 加密
  console.log(enc);
  return enc;
}

Vue.prototype.decrypt1 = function (signData) {
  //  解密数据 signData
  // 私钥解密
  let privateKey = "-----BEGIN PRIVATE KEY-----" + "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAI+EO5my4ju+BrUdm8L1yf89vWzjQJPjyKqfKFLxSctvyTqZ"
    + "+nMGJ2IkxKkalpi5tbSf0Vi6gEKdJ3b4g7HBnl3VcwxZMne6OXEv8JaKv5X1klfbddyn6/FDkpYpe0fW/VjnjGFl11"
    + "/1KpIPlz8Y1CobTDsNLzU3e8Y8QZgVJSdNAgMBAAECgYBLDzmstSYlYMlZSFcCrFItMDk2DdTkhCmbMwp/9rpFr/1qrMWUCw"
    + "/mAJzqZIGG9vnVshBne4NBU7gkPO2DtmQAmAfZkjZWmGXSkiL2tMzq3TUdZtVSVMrWRMft4/VuU1T/GWJsjM/wYwj+x/eWY2AkCs+/vLC2"
    + "+OlOubrAXmtu8QJBAPklSIWYYqn3"
    + "/rKtQMqtBZU5S37rj99bqi5vTRIlImjsNm7uASyzjxtLRRqo4pnD4rAm6JU9X8lymIbSwjcxPrMCQQCTdwKyxREKMBj0LzkDHXiMzVzQyz1hyM71IAn"
    + "+51onYy74l6O3ghAauIn8BhCIGMw4qItoQcCQmWsb+7X7QwH/AkBS2x5SJ4pwYiQXAd0xSfc4WDSOQgK30kE3bhZgeW8HG79Chu5nElP"
    + "+TLrvkcjCQE3MLTReJWoMkYq+E6s5NaxXAkBLQS/SVXlVrqf9bV/19ANCL8dPEnkXvufG9nvDZwN"
    + "+GEKvQIufKbPYPxbD08B6A9WskG7cXLnN0U108Wa0fES3AkBlWj7DCpYyYtAAqvpkM+9PBej5OP0beAmxN9reC5dBpinR+MuDypsdEC+gZ"
    + "/oLcsj2z6mtMlrCt1xVP1I6mIqf" + "-----END PRIVATE KEY-----";

  let prv = new JSEncrypt(); // 初始化对象
  prv.setPrivateKey(privateKey); // 获取私钥
  let dec = prv.decrypt(signData); // 解密
  return dec;
}

Vue.prototype.signString1 = function (signData) {
  let privateKey = "-----BEGIN PRIVATE KEY-----" + "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAI+EO5my4ju+BrUdm8L1yf89vWzjQJPjyKqfKFLxSctvyTqZ"
    + "+nMGJ2IkxKkalpi5tbSf0Vi6gEKdJ3b4g7HBnl3VcwxZMne6OXEv8JaKv5X1klfbddyn6/FDkpYpe0fW/VjnjGFl11"
    + "/1KpIPlz8Y1CobTDsNLzU3e8Y8QZgVJSdNAgMBAAECgYBLDzmstSYlYMlZSFcCrFItMDk2DdTkhCmbMwp/9rpFr/1qrMWUCw"
    + "/mAJzqZIGG9vnVshBne4NBU7gkPO2DtmQAmAfZkjZWmGXSkiL2tMzq3TUdZtVSVMrWRMft4/VuU1T/GWJsjM/wYwj+x/eWY2AkCs+/vLC2"
    + "+OlOubrAXmtu8QJBAPklSIWYYqn3"
    + "/rKtQMqtBZU5S37rj99bqi5vTRIlImjsNm7uASyzjxtLRRqo4pnD4rAm6JU9X8lymIbSwjcxPrMCQQCTdwKyxREKMBj0LzkDHXiMzVzQyz1hyM71IAn"
    + "+51onYy74l6O3ghAauIn8BhCIGMw4qItoQcCQmWsb+7X7QwH/AkBS2x5SJ4pwYiQXAd0xSfc4WDSOQgK30kE3bhZgeW8HG79Chu5nElP"
    + "+TLrvkcjCQE3MLTReJWoMkYq+E6s5NaxXAkBLQS/SVXlVrqf9bV/19ANCL8dPEnkXvufG9nvDZwN"
    + "+GEKvQIufKbPYPxbD08B6A9WskG7cXLnN0U108Wa0fES3AkBlWj7DCpYyYtAAqvpkM+9PBej5OP0beAmxN9reC5dBpinR+MuDypsdEC+gZ"
    + "/oLcsj2z6mtMlrCt1xVP1I6mIqf" + "-----END PRIVATE KEY-----";

  let sig = new JSEncrypt(); // 初始化对象
  sig.setPrivateKey(privateKey); // 获取私钥
  let sign = sig.sign(signData, crypto.SHA256, "base64"); // 加签
  return sign;

}

Vue.prototype.verify1 = function (signData, data) {
  let publicKey = "-----BEGIN PUBLIC KEY-----" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPhDuZsuI7vga1HZvC9cn/Pb1s40CT48iqnyhS8UnLb8k6mfpzBidiJMSpGpaYubW0n9FYuoBCnSd2"
    + "+IOxwZ5d1XMMWTJ3ujlxL/CWir+V9ZJX23Xcp+vxQ5KWKXtH1v1Y54xhZddf9SqSD5c/GNQqG0w7DS81N3vGPEGYFSUnTQIDAQAB"
    + "-----END PUBLIC KEY-----";

  let sig = new JSEncrypt(); // 初始化对象
  sig.setPublicKey(publicKey); // 获取公钥
  let sign = sig.verify(signData, data, crypto.SHA256); // 验签
  return sign;
}

// 安装依赖 npm install md5
// main.js引入 import md5 from 'js-md5'
// Vue.prototype.$md5 = md5
// 使用方法 let data = this.$md5(this.password) 这样传给接口就行