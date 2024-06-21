import axios, { type AxiosInstance } from 'axios'

export const useAxiosRequestWithToken = (token: string = ''): AxiosInstance => {
  const useAxios: AxiosInstance = axios.create({
    baseURL: 'http://213.136.74.84:800/api/',
    withCredentials: false,
    headers: {
      accept: 'application/json',
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Credentials': true,
      Authorization: `Bearer ${token}`
    }
  })
  return useAxios
}
