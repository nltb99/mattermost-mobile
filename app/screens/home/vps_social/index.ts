// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import compose from 'lodash/fp/compose';

import VPSSocialScreen from './vps_social_webview';

const enhance = withObservables([], () => {
    return {
    };
});

export default compose(
    withDatabase,
    enhance,
)(VPSSocialScreen);
