import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
	baseURL: (import.meta as any).env.VITE_BACK_URL,
});

export default axiosInstance;
