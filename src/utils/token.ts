import { storage as _storage, tokenTableName } from '/@/config'

const storage = _storage || 'localStorage'

/**
 * @description 获取token
 */
export const getToken = () => {
  if ('localStorage' === storage) return localStorage.getItem(tokenTableName)
  else if ('sessionStorage' === storage) return sessionStorage.getItem(tokenTableName)
}

/**
 * @description 存储token
 * @param token
 */
export const setToken = (token: string) => {
  if ('localStorage' === storage) return localStorage.setItem(tokenTableName, token)
  else if ('sessionStorage' === storage) return sessionStorage.setItem(tokenTableName, token)
}

/**
 * @description 移除token
 */
export const removeToken = (storage = 'localStorage') => {
  if ('localStorage' === storage) return localStorage.removeItem(tokenTableName)
  else if ('sessionStorage' === storage) return sessionStorage.clear()
}
