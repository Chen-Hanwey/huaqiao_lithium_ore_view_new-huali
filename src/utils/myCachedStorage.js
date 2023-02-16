export function setCachedStorage(key, value, expired) {
  /*
    * set 存储方法
    * @ param {String} 	key 键
    * @ param {String} 	value 值，
    * @ param {String} 	expired 过期时间，以分钟为单位，非必须,默认60分钟
    */
  let source = window.localStorage;
  source[key] = value;
  if (expired) {
    source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired
  } else {
    source[`${key}__expires__`] = Date.now() + 1000 * 60 * 60
  }
  return value;

}

export function getCachedStorage(key) {
  /*
    * get 获取方法
    * @ param {String} 	key 键
    * @ param {String} 	expired 存储时为非必须字段，所以有可能取不到，默认为 Date.now+1
    */
  const source = window.localStorage,
    expired = source[`${key}__expires__`] || Date.now + 999;
  const now = Date.now();

  if (now >= expired) {
    removeCachedStorage(key);
    return '';
  }
  return source[key];
}

export function removeCachedStorage(key) {
  window.localStorage.removeItem(key)
  window.localStorage.removeItem(`${key}__expires__`)
}
