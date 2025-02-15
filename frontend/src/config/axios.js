/* eslint-disable no-unused-vars */
import axios from 'axios'

const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
})