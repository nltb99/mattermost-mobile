// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {
    BackHandler,
    DeviceEventEmitter,
    StyleSheet,
    ToastAndroid,
    View,
} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {
    Edge,
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import WebViewSideBar from '@app/components/webview_sidebar/webview_sidebar';
import ConnectionBanner from '@components/connection_banner';
import FreezeScreen from '@components/freeze_screen';
import {Navigation as NavigationConstants, Screens} from '@constants';
import {useTheme} from '@context/theme';
import NavigationStore from '@store/navigation_store';
import {isMainActivity} from '@utils/helpers';

import {VPSTopButton} from './vps_top_button';

export type TVPSSocialScreenProps = {};

const edges: Edge[] = ['bottom', 'left', 'right'];

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    flex: {
        flex: 1,
    },
});

let backPressedCount = 0;
let backPressTimeout: NodeJS.Timeout | undefined;

const VPSSocialScreen = () => {
    const theme = useTheme();
    const intl = useIntl();

    const webView = React.useRef<WebView>(null);

    const route = useRoute();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const params = route.params as {direction: string};
    const [showSidedbar, setShowSidebar] = useState<boolean>(true);

    const handleBackPress = useCallback(() => {
        const isHomeScreen =
            NavigationStore.getVisibleScreen() === Screens.HOME;
        const homeTab = NavigationStore.getVisibleTab() === Screens.HOME;
        const focused = navigation.isFocused() && isHomeScreen && homeTab;

        if (isMainActivity()) {
            if (!backPressedCount && focused) {
                backPressedCount++;
                ToastAndroid.show(
                    intl.formatMessage({
                        id: 'mobile.android.back_handler_exit',
                        defaultMessage: 'Press back again to exit',
                    }),
                    ToastAndroid.SHORT,
                );

                if (backPressTimeout) {
                    clearTimeout(backPressTimeout);
                }
                backPressTimeout = setTimeout(() => {
                    clearTimeout(backPressTimeout!);
                    backPressedCount = 0;
                }, 2000);
                return true;
            } else if (isHomeScreen && !homeTab) {
                DeviceEventEmitter.emit(NavigationConstants.NAVIGATION_HOME);
                return true;
            }
        }
        return false;
    }, [intl]);

    const animated = useAnimatedStyle(() => {
        if (!isFocused) {
            let initial = 0;
            if (params?.direction) {
                initial = -25;
            }
            return {
                opacity: withTiming(0, {duration: 150}),
                transform: [{translateX: withTiming(initial, {duration: 150})}],
            };
        }
        return {
            opacity: withTiming(1, {duration: 150}),
            transform: [{translateX: withTiming(0, {duration: 150})}],
        };
    }, [isFocused, params]);

    const top = useAnimatedStyle(() => {
        return {height: insets.top, backgroundColor: theme.sidebarBg};
    }, [theme, insets.top]);

    useEffect(() => {
        const back = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackPress,
        );
        return () => back.remove();
    }, [handleBackPress]);

    useEffect(() => {
        return () => {
            setShowSidebar(true);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setShowSidebar(true);
        });

        return unsubscribe;
    }, [navigation]);

    const onToggle = () => {
        setShowSidebar((e) => !e);
    };

    return (
        <FreezeScreen freeze={!isFocused}>
            <Animated.View style={top}/>
            <SafeAreaView
                style={styles.flex}
                edges={edges}
            >
                <ConnectionBanner/>
                <View style={styles.content}>
                    <VPSTopButton onPress={onToggle}/>
                    <Animated.View style={[styles.content, animated]}>
                        <WebViewSideBar
                            iconPad={true}
                            teamsCount={showSidedbar ? 2 : 0}
                        />
                        <WebView
                            automaticallyAdjustContentInsets={false}
                            cacheEnabled={true}

                            // onLoadEnd={onLoadEnd}
                            // onMessage={messagingEnabled ? onMessage : undefined}
                            // onNavigationStateChange={onNavigationStateChange}
                            onShouldStartLoadWithRequest={() => true}
                            ref={webView}
                            source={{
                                uri: 'https://social.lcnk.xyz/?token=https://social.lcnk.xyz/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDE5MWRkM2VhNWVkNjNlNjkxNDhjNzIiLCJpZCI6IjYwMTkxZGQzZWE1ZWQ2M2U2OTE0OGM3MiIsImVtYWlsIjoibzJvdmlldEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Im8yb3ZuIiwiZmlyc3ROYW1lIjoiTzJPIiwibGFzdE5hbWUiOiJWaeG7h3QgTmFtIiwiaWF0IjoxNjIzMDYxODEwLCJleHAiOjE2NTQ1OTc4MTB9.RTMkrwY6I7_CcMRFQwKGWa9dgMv0RtpP1qqVVWuO_ls',
                            }}
                            startInLoadingState={true}
                            useSharedProcessPool={false}
                        />
                    </Animated.View>
                </View>
            </SafeAreaView>
        </FreezeScreen>
    );
};

export default VPSSocialScreen;
