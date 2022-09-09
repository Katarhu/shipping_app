import axios, {AxiosRequestConfig} from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
})

instance.interceptors.request.use(async (config: AxiosRequestConfig) => {
    (config.headers ??= {}).Authorization = `Bearer ${localStorage.getItem('token')}`

    return config;
});

export default instance;