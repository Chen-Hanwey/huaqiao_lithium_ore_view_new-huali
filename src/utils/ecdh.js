/**
 * Created by Administrator on 2016/12/14.
 */

import crypto from 'crypto';
import { encryptetobase64, decryptebase64 } from '@/utils/aes';

export function encryptData (serverKey, data) {
  let alice = crypto.createECDH('secp384r1');
  let alice_key = alice.generateKeys();
  let alipub = alice.getPublicKey().toString('base64');
  //服务端
  let dod = crypto.createECDH('secp384r1');
  dod.generateKeys();
  dod.setPublicKey(serverKey, 'base64');
  let dobpub = dod.getPublicKey();
  //生成共享密钥
  let sign = alice.computeSecret(dobpub, null, 'base64');
  //获取aeskey ,aesiv
  let aeskey = sign.substr(5, 16);
  let aesiv = sign.substr(21, 16);
  return {encryptedData: encryptetobase64(data, aeskey, aesiv), clientKey: alipub};
}

export function encryptDataArray (serverKey, dataArray) {
  let alice = crypto.createECDH('secp384r1');
  let alice_key = alice.generateKeys();
  let alipub = alice.getPublicKey().toString('base64');
  //服务端
  let dod = crypto.createECDH('secp384r1');
  dod.generateKeys();
  dod.setPublicKey(serverKey, 'base64');
  let dobpub = dod.getPublicKey();
  //生成共享密钥
  let sign = alice.computeSecret(dobpub, null, 'base64');
  //获取aeskey ,aesiv
  let aeskey = sign.substr(5, 16);
  let aesiv = sign.substr(21, 16);

  let array = [];
  dataArray.forEach(item => {
    let en_data = encryptetobase64(item, aeskey, aesiv);
    array.push(en_data);
  })

  return {encryptedData: array, clientKey: alipub};
}
