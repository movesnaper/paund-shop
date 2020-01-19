import PouchDB from 'pouchdb-browser'
var Auth = require('pouchdb-auth')
PouchDB.plugin(Auth)

import axios from 'axios'
import { store } from '@/setup'
const local =  `http://localhost:5984`
const remote = `http://91.235.129.14:5984/virus`
const auth = { 
  // username: 'mbasnap@yandex.ua',
  // password: 'Stalker01',
  username: 'admin',
  password: 'Stalker01'
}
const user = new PouchDB(`${local}/_users`, { auth })
  user.useAsAuthenticationDB()
const klient = new PouchDB(`${local}/klient`, { auth })
  klient.sync( new PouchDB(`${remote}-klient`,{ auth }), { live: true })
  .on('change', v => console.log(v))
  .on('error', v => console.log(v))
const company = new PouchDB(`${local}/company`, { auth })
  company.sync( new PouchDB(`${remote}-company`,{ auth }), { live: true })
  .on('change', v => console.log(v))
  .on('error', v => console.log(v))
const reestr = new PouchDB(`${local}/reestr`, { auth })
  reestr.sync( new PouchDB(`${remote}-reestr`,{ auth }), { live: true })
  .on('change', v => console.log(v))
  .on('error', v => console.log(v))


axios.interceptors.response.use(undefined, function (err) {
  const {status, statusText} = err.response
  return new Promise(function () {
    if (status === 401) store.dispatch('user/logout')
  })
})

const  query = (action, url, params) => {
  const { date } = store.getters
  return axios[action](url, { ...params, date })
    .then(res => res.data)
      .catch(err => {
        throw err.response.data
  })
}

const setHeaders = (name, token) => {
  const headers = axios.defaults.headers.common
  if (token) headers[name] = token
  else delete headers[name]
}

const getToken = (name) => {
  const token = localStorage.getItem(name)
  setHeaders(name, token)
}

const db = (name = '') => {
 const getUrl = () => 'http://localhost:8080/lombard'  + name
  return {
    get: (action) => query('get', getUrl() + action),
    post: (action, params) => query('post', getUrl() + action, params),
  }
}

export {
  db,
  getToken,
  user,
  klient,
  company,
  reestr
}

