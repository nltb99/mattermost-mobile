// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import axios, {AxiosInstance} from 'axios';

import {API_VPS_SOCIAL} from '../rest/constants';

export const InstanceAxios: AxiosInstance = axios.create({
    baseURL: API_VPS_SOCIAL,
    headers: {
        'Content-Type': 'application/json',
    },
});

InstanceAxios.interceptors.request.use((config) => {
    if (config.headers) {
        //
    }

    return config;
});
