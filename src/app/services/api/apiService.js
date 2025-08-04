import axios from 'axios';
import { APIErrorMsg, APINwErrorMsg } from '../../constants/apiConstants';

class ApiService {

    constructor() {
        const service = axios.create({
            headers: {}
        });
        this.service = service;
        this.currentUrl = '';
    }

    get(path, params) {
        this.currentUrl = path;
        return this.service
            .request({
                method: 'GET',
                url: path,
                params: params,
                headers: this.getHeader()
            })
            .then((response) => {
               // response?.data?.token && setJWTToken(response?.data?.token);
                return response.data || response;
            })
            .catch((e) => this.handleError(e));
    }

    put(path, payload, options = {}) {
        return this.service
            .request(this.getRequestObject('PUT', path, payload, options))
            .then((response) => response.data || response)
            .catch((e) => this.handleError(e));
    }

    patch(path, payload, options = {}) {
        return this.service
            .request(this.getRequestObject('PATCH', path, payload, options))
            .then((response) => response.data || response)
            .catch((e) => this.handleError(e));
    }

    post(path, payload, options = {}, contentType = null) {
        return this.service
            .request(this.getRequestObject('POST', path, payload, options, contentType))
            .then((response) => {
               // response?.data?.token && setJWTToken(response?.data?.token);
                return response?.data || response;
            })
            .catch((e) => {
                return this.handleError(e?.error);
            });
    }

    getHeader = (contentType) => {
        if (contentType === 'multipart/form-data') {
            return {
                'Content-Type': 'multipart/form-data',
              //  Authorization: getJWTToken()
            };
        } else {
            return {
                'Content-Type': 'application/json;charset=UTF-8',
              //  Authorization: getJWTToken()
            };
        }
    };

    getRequestObject = (
        method,
        path,
        payload,
        options,
        contentType
    ) => {
        this.currentUrl = path;
        return {
            method: method,
            url: path,
            responseType: options?.responseType || 'json',
            data: payload,
            headers: this.getHeader(contentType)
        };
    };

    handleError = (error) => {
        return Promise.reject(this.getFormattedError(error));
    };

    getFormattedError = (err) => {
        try {
            if (err.response && err.response.data) {
                if (err.response.data.error) {
                    return {
                        status: err.response.data.error.type,
                        message: err.response.data.error.message,
                        details: err.response.data.error.details || err.response.data.error.data
                    };
                } else if (err.response.data.message) {
                    return {
                        status: err.response.data,
                        message: err.response.data.message,
                        details: err.response.data.message
                    };
                }
            } else {
                return {
                    status: 'error',
                    message: APIErrorMsg,
                    Error: err.message
                };
            }
        } catch (e) {
            return {
                status: 'error',
                message: APIErrorMsg,
                details: APINwErrorMsg
            };
        }
    };
}

const apiServiceInst = new ApiService();

export default apiServiceInst;


