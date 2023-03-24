// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {WebView} from 'react-native-webview';

const VPSSocialScreen = () => {
    const webView = React.useRef<WebView>(null);

    return (
        <>
            <WebView
                automaticallyAdjustContentInsets={false}
                cacheEnabled={true}

                // onLoadEnd={onLoadEnd}
                // onMessage={messagingEnabled ? onMessage : undefined}
                // onNavigationStateChange={onNavigationStateChange}
                onShouldStartLoadWithRequest={() => true}
                ref={webView}
                source={{uri: 'https://social.lcnk.xyz/?token=https://social.lcnk.xyz/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDE5MWRkM2VhNWVkNjNlNjkxNDhjNzIiLCJpZCI6IjYwMTkxZGQzZWE1ZWQ2M2U2OTE0OGM3MiIsImVtYWlsIjoibzJvdmlldEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im8yb3ZuIiwiZmlyc3ROYW1lIjoiTzJPIiwibGFzdE5hbWUiOiJWaeG7h3QgTmFtIiwiaWF0IjoxNjIzMDYxODEwLCJleHAiOjE2NTQ1OTc4MTB9.RTMkrwY6I7_CcMRFQwKGWa9dgMv0RtpP1qqVVWuO_ls'}}
                startInLoadingState={true}
                useSharedProcessPool={false}
            />
        </>
    );
};

export default VPSSocialScreen;
