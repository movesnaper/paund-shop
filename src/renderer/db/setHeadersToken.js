import axios from 'axios'
const name ='x_token'
export default (token) => 
  axios.defaults.headers.common[name] = token
   || localStorage.getItem(name)