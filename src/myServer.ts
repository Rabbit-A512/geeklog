import axios from 'axios';

const myServer = axios.create({
  baseURL: 'http://47.106.158.254'
});

export default myServer;
