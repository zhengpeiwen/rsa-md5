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
    + "-----END PUBLIC KEY-----";
  let pub = jsrsasign.KEYUTIL.getKey(publicKey); // 获取公钥
  let enc = jsrsasign.KJUR.crypto.Cipher.encrypt(signData, pub); // 加密
  enc = jsrsasign.hextob64(enc); // 将16进制转化为base64
  return enc;
}

Vue.prototype.decrypt = function (signData) {
  //  解密数据 signData
  // 私钥解密
  let privateKey = "-----BEGIN PRIVATE KEY-----" + 
      "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAI+EO5my4ju+BrUdm8L1yf89vWzjQJPjyKqfKFLxSctvyTqZ"
     + "-----END PRIVATE KEY-----";

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
  let privateKey = "-----BEGIN PRIVATE KEY-----" +
      "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAI+EO5my4ju+BrUdm8L1yf89vWzjQJPjyKqfKFLxSctvyTqZ"
    + "-----END PRIVATE KEY-----";

  let prv = new JSEncrypt(); // 初始化对象
  prv.setPrivateKey(privateKey); // 获取私钥
  let dec = prv.decrypt(signData); // 解密
  return dec;
}

Vue.prototype.signString1 = function (signData) {
  let privateKey = "-----BEGIN PRIVATE KEY-----" + 
      "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAI+EO5my4ju+BrUdm8L1yf89vWzjQJPjyKqfKFLxSctvyTqZ"
   + "-----END PRIVATE KEY-----";

  let sig = new JSEncrypt(); // 初始化对象
  sig.setPrivateKey(privateKey); // 获取私钥
  let sign = sig.sign(signData, crypto.SHA256, "base64"); // 加签
  return sign;

}

Vue.prototype.verify1 = function (signData, data) {
  let publicKey = "-----BEGIN PUBLIC KEY-----" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPhDuZsuI7vga1HZvC9cn/Pb1s40CT48iqnyhS8UnLb8k6mfpzBidiJMSpGpaYubW0n9FYuoBCnSd2"
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
