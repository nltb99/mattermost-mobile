// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {DeviceEventEmitter} from 'react-native';

import {Launch} from '@app/constants';
import {relaunchApp} from '@app/init/launch';

export const registerDeviceEventEmmiterListeners = () => {
    DeviceEventEmitter.addListener('RELAUNCH_APP', () => {
        relaunchApp({launchType: Launch.Normal, coldStart: false});
    });
};
