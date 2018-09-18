import axios from 'axios';

const myServer = axios.create({
  baseURL: 'http://47.106.158.254'
});

export const authServer = axios.create({
  baseURL: 'http://47.106.158.254',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export default myServer;
