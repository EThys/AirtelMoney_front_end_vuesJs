import axios, { type AxiosInstance } from 'axios'

export const useAxiosRequestWithToken = (token: string = ''): AxiosInstance => {
  const useAxios: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
      accept: 'application/json',
      'Content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${token}`
    }
  })

  return useAxios
}
