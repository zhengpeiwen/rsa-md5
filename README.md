# rsa 加密、解密、加签、验签和md5加密


## 1、RSA简介
&emsp;&emsp;RSA加密是一种非对称加密。可以在不直接传递密钥的情况下，完成解密。这能够确保信息的安全性，避免了直接传递密钥所造成的被破解的风险。是由一对密钥来进行加解密的过程，分别称为公钥和私钥。两者之间有数学相关，该加密算法的原理就是对一极大整数做因数分解的困难性来保证安全性。通常个人保存私钥，公钥是公开的（可能同时多人持有）。


## 2、RSA加密、加签区别
&emsp;&emsp;加密和签名都是为了安全性考虑，但略有不同。常有人问加密和签名是用私钥还是公钥？其实都是对加密和签名的作用有所混淆。简单的说，加密是为了防止信息被泄露，而签名是为了防止信息被篡改。这里举2个例子说明。

### 第一个场景：战场上，B要给A传递一条消息，内容为某一指令。

RSA的加密过程如下：

（1）A生成一对密钥（公钥和私钥），私钥不公开，A自己保留。公钥为公开的，任何人可以获取。

（2）A传递自己的公钥给B，B用A的公钥对消息进行加密。

（3）A接收到B加密的消息，利用A自己的私钥对消息进行解密。

　　在这个过程中，只有2次传递过程，第一次是A传递公钥给B，第二次是B传递加密消息给A，即使都被敌方截获，也没有危险性，因为只有A的私钥才能对消息进行解密，防止了消息内容的泄露。

 

### 第二个场景：A收到B发的消息后，需要进行回复“收到”。

RSA签名的过程如下：

（1）A生成一对密钥（公钥和私钥），私钥不公开，A自己保留。公钥为公开的，任何人可以获取。

（2）A用自己的私钥对消息加签，形成签名，并将加签的消息和消息本身一起传递给B。

（3）B收到消息后，在获取A的公钥进行验签，如果验签出来的内容与消息本身一致，证明消息是A回复的。

　　在这个过程中，只有2次传递过程，第一次是A传递加签的消息和消息本身给B，第二次是B获取A的公钥，即使都被敌方截获，也没有危险性，因为只有A的私钥才能对消息进行签名，即使知道了消息内容，也无法伪造带签名的回复给B，防止了消息内容的篡改。

 

　　但是，综合两个场景你会发现，第一个场景虽然被截获的消息没有泄露，但是可以利用截获的公钥，将假指令进行加密，然后传递给A。第二个场景虽然截获的消息不能被篡改，但是消息的内容可以利用公钥验签来获得，并不能防止泄露。所以在实际应用中，要根据情况使用，也可以同时使用加密和签名，比如A和B都有一套自己的公钥和私钥，当A要给B发送消息时，先用B的公钥对消息加密，再对加密的消息使用A的私钥加签名，达到既不泄露也不被篡改，更能保证消息的安全性。
  
**总结：公钥加密、私钥解密、私钥签名、公钥验签。**

### 代码

```javascript
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
```
```javascript
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
```

```javascript
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
```
```javascript
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
```

```javascript
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
```

```javascript
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
```

```javascript
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
```

```javascript
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
```
