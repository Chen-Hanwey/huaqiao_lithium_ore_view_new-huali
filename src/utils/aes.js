/**
 * Created by Administrator on 2016/12/14.
 */

import CryptoJS from "crypto-js";

export function encryptetobase64 (data, aeskey, aesiv) {
  const encryptedData = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(aeskey), {
    iv: CryptoJS.enc.Utf8.parse(aesiv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encryptedData.toString();
}

//AES解密
export function decryptebase64 (data, aeskey, aesiv) {
  const decryptedData = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(aeskey), {
    iv: CryptoJS.enc.Utf8.parse(aesiv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decryptedData.toString(CryptoJS.enc.Utf8);
}

