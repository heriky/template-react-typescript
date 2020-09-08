import axios from 'axios';
import { responseError, response, request } from './interceptors';
import { API_PREFIX } from '@constants';

const baseURL = '/';

const http = axios.create({
    baseURL: baseURL,
    headers: {
        'X-Requested-With': 'shuyun.com',
    },
    withCredentials: true,
});

http.interceptors.request.use(request.interceptor);
http.interceptors.response.use(response.retvalInterceptor, responseError.httpErrorInterceptor);

export const service = new Proxy(http, {
    get(target, prop) {
        http.defaults.baseURL = API_PREFIX;
        return Reflect.get(target, prop); // 这里的类型怎么规定？？？
    },
});

export default new Proxy(http, {
    get(target, prop) {
        http.defaults.baseURL = '';
        return Reflect.get(target, prop);
    },
});
