import axios from 'axios';
import { CookiesService } from '../core/service/cookie.service';
import { TokenType } from '../api/bases/enums/jwt.enum';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhoast:8080/api';

const publicApi = axios.create({
    baseURL : BASE_URL,
    timeout: 10000,
});

const privateApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

publicApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response.status;
        if( status === 401 ){
            console.log('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        }
        return Promise.reject(error);
    },
);

privateApi.interceptors.request.use(
    (config) => {
        const token = CookiesService.getToken(TokenType.ACCESS_TOKEN);
        if(token && config['headers']){
        {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
    },
    (error) => Promise.reject(error),
);

privateApi.interceptors.response.use(
    (response) => response.data,
    (error) =>{
        const status = error.response.status;
        if(status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại")
        }
        const data = error.response?.data;
        console.log("API error", data)
        toast.error(JSON.stringify(data.messgae))
        return Promise.reject({
            message: data.message,
            status
        })
    },
);

export { publicApi, privateApi };