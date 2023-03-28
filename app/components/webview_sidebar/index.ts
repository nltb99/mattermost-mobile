// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import withObservables from '@nozbe/with-observables';

import {withServerUrl} from '@context/server';

import WebViewSideBar from './webview_sidebar';

const enhanced = withObservables([], () => {
    return {
    };
});

export default withServerUrl(enhanced(WebViewSideBar));
