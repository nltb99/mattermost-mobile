// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import _ from 'lodash';

import {InstanceAxios} from './axios';

import type {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';

export const HandleResponseError = (
    error: AxiosError<{message: string}, any>,
) => {
    return error;
};

class HttpRestService {
    // eslint-disable-next-line no-useless-constructor
    constructor(private axiosInstance: AxiosInstance) {}

    async get<T>(route: string, configs?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.
            get(route, configs).
            then((data) => _.get(data, 'data')).
            catch(HandleResponseError);
    }

    async post<P, R>(
        route: string,
        payload?: P,
        configs?: AxiosRequestConfig,
    ): Promise<R> {
        return this.axiosInstance.
            post(route, payload, configs).
            then((data) => _.get(data, 'data')).
            catch(HandleResponseError);
    }

    async patch<P, R>(
        route: string,
        payload?: P,
        configs?: AxiosRequestConfig,
    ): Promise<R> {
        return this.axiosInstance.
            patch(route, payload, configs).
            then((data) => _.get(data, 'data')).
            catch(HandleResponseError);
    }

    async put<P, R>(
        route: string,
        payload?: P,
        configs?: AxiosRequestConfig,
    ): Promise<R> {
        return this.axiosInstance.
            put(route, payload, configs).
            then((data) => _.get(data, 'data')).
            catch(HandleResponseError);
    }

    async delete<R>(route: string, configs?: AxiosRequestConfig): Promise<R> {
        return this.axiosInstance.
            delete(route, configs).
            then((data) => _.get(data, 'data')).
            catch(HandleResponseError);
    }
}

export const HttpService = new HttpRestService(InstanceAxios);
