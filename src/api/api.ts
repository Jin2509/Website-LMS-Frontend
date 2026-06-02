import axios from 'axios';
import { CookiesService } from '../core/service/cookie.service';
import { TokenType } from '../api/bases/enums/jwt.enum';
import toast from 'react-hot-toast';
import { API_CONFIG } from './bases/constants/app.constants';

const BASE_URL = API_CONFIG.BASE_URL;

const publicApi = axios.create({
    baseURL : BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
});

const privateApi = axios.create({
    baseURL: BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
});

publicApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        if( status === 401 ){
            console.log('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        }
        return Promise.reject(error);
    },
);

privateApi.interceptors.request.use(
    (config) => {
        const token = CookiesService.getToken(TokenType.ACCESS_TOKEN);
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

privateApi.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const status = error.response?.status;
        const data = error.response?.data;
        
        if (status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
            // Note: Refresh token logic can be implemented here if needed
        }
        
        console.log("API error", data);
        if (data?.message) {
            toast.error(data.message);
        }
        
        return Promise.reject({
            message: data?.message || 'Đã có lỗi xảy ra',
            status
        });
    },
);

export { publicApi, privateApi };
