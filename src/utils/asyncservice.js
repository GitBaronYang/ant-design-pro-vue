import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
// import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  baseURL: 'http://capi.tianta.com.cn', // api base_url
  timeout: 60000, // 请求超时时间
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

export default {
  get: async (url = '', status) => {
    // load.openLoading()
    // setInterval(load.closeLoading,2000)
    url = url + '?' + new Date().getTime()
    try {
      const response = await service.get(url)
      // console.log(response)

      return response
    } catch (error) {
      // debugger
      let msg = '异常'
      console.log(error.message)
      if (!Vue._.isUndefined(error.message) && error.message === 'Network Error') {
        msg = '网络异常'
      }
      return { code: -1, msg: msg, data: {} }
    } finally {
      // load.closeLoading()
    }
  },

  post: async (url = '', data = {}) => {
    // load.openLoading()
    // setInterval(load.closeLoading,2000)
    try {
      const response = await service.post(url, data)
      console.log(response)
      return response.data
    } catch (error) {
      let msg = '异常'
      console.log(error.message)
      if (!Vue._.isUndefined(error.message) && error.message === 'Network Error') {
        msg = '网络异常'
      }
      return { code: -1, msg: msg, data: {} }
    } finally {
      // load.closeLoading()
    }
  },

  put: async (url = '', data = {}) => {
    // load.openLoading()
    try {
      const response = await service.put(url, data)
      // console.log(response)
      return response.data
    } catch (error) {
      // debugger;
      let msg = '异常'
      console.log(error.message)
      if (!Vue._.isUndefined(error.message) && error.message === 'Network Error') {
        msg = '网络异常'
      }
      return { code: -1, msg: msg, data: {} }
    } finally {
      // load.closeLoading()
    }
  },

  delete: async (url = '', status) => {
    // load.openLoading()
    url = url + '?' + new Date().getTime()
    try {
      const response = await service.delete(url)
      return response.data
    } catch (error) {
      let msg = '异常'
      console.log(error.message)
      if (!Vue._.isUndefined(error.message) && error.message === 'Network Error') {
        msg = '网络异常'
      }
      return { code: -1, msg: msg, data: {} }
    } finally {
      // load.closeLoading()
    }
  },
  download: async (url = '', status) => {
    // load.openLoading()
    // setInterval(load.closeLoading,2000)
    url = url + '?' + new Date().getTime()
    try {
      const response = await service.get(url, { responseType: 'blob' })
      console.log(response)

      return response
    } catch (error) {
      console.log(error)
      return null
    } finally {
      // load.closeLoading()
    }
  }
}
