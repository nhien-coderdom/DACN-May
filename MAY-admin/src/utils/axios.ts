import axios from "axios"

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('  Token attached:', token.substring(0, 20) + '...')
  } else {
    console.log('  No token in localStorage')
  }

  return config
})

export default axiosClient