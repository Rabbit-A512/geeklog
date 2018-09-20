import axios, { AxiosInstance } from 'axios';

const server = axios.create({
  baseURL: 'http://47.106.158.254'
});

export const getAuthServer = (): AxiosInstance => {
  return axios.create({
    baseURL: 'http://47.106.158.254',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
};

export default server;
