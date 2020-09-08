import { shake } from '@utils';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

/**
 * 请求拦截
 */
export const request = {
    /**
     * @param {any} res
     */
    interceptor(config: AxiosRequestConfig) {
        if (config.data) {
            console.log(config.data, '000000');
            config.data = shake(config.data);
        }
        if (config.params) {
            config.params = shake(config.params);
        }
        return config;
    },
};

/**
 * 结果拦截
 */
export const response = {
    /**
     * @param {{ data: any; }} res
     */
    retvalInterceptor(res: AxiosResponse) {
        if (res.data.code > 299) {
            throw Error(res.data.message ?? '缺省的错误信息');
        }

        return res.data?.data ?? res.data;
    },
};

/**
 * 错误处理
 */
export const responseError = {
    /**
     * @param {any} error
     */
    httpErrorInterceptor(error: unknown) {
        return Promise.reject(error);
    },
};
