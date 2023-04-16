// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {
    BackHandler,
    DeviceEventEmitter,
    StyleSheet,
    Text,
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

import Loading from '@app/components/loading';
import WebViewSideBar from '@app/components/webview_sidebar/webview_sidebar';
import {VPS_WEB_VIEW_LINK} from '@app/utils/constants';
import ConnectionBanner from '@components/connection_banner';
import FreezeScreen from '@components/freeze_screen';
import {Navigation as NavigationConstants, Screens} from '@constants';
import {useTheme} from '@context/theme';
import NavigationStore from '@store/navigation_store';
import {isMainActivity} from '@utils/helpers';

import {VPSTopButton} from './vps_top_button';

import type {TVPSSocialFunction} from '@app/components/webview_sidebar/function_list/function_list';

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backroundColor: 'red',
        position: 'absolute',
        width: '100%',
        height: '100%',
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
    const [currentWebviewSite, setCurrentWebviewSite] = useState<string>('');
    const [loadingWebview, setLoadingWebview] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [myOrderedFunctions, __] =
        useState<TVPSSocialFunction[]>(VPS_WEB_VIEW_LINK);

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

    const onShowSideBar = () => {
        setShowSidebar((e) => !e);
    };

    useEffect(() => {
        const eventTabPress = DeviceEventEmitter.addListener(
            'tabPressVPSSocial',
            onShowSideBar,
        );

        return () => {
            eventTabPress.remove();
        };
    }, [navigation]);

    const onToggleSideBar = () => {
        setShowSidebar((e) => !e);
    };

    const onChangeWebView = (
        item: TVPSSocialFunction,
        token: string,
        check?: false,
    ) => {
        if (!check) {
            // eslint-disable-next-line array-callback-return
            myOrderedFunctions.map((e) => {
                e.selected = false;
            });
        }
        item.selected = true;
        const endpoint = item.params ? item.params + token : '';
        setCurrentWebviewSite(item.uri + endpoint);
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
                    <Animated.View style={[styles.content, animated]}>
                        <WebViewSideBar
                            iconPad={false}
                            teamsCount={showSidedbar ? 2 : 0}
                            myOrderedFunctions={myOrderedFunctions}
                            onChangeWebView={onChangeWebView}
                        />
                        {loadingWebview && (
                            <View
                                style={styles.loadingContainer}
                                pointerEvents='none'
                            >
                                <Loading/>
                                <Text style={{color: theme.sidebarText}}>
                                    Đang tải...
                                </Text>
                            </View>
                        )}
                        <View
                            style={{flex: 1, opacity: loadingWebview ? 0 : 1}}
                        >
                            <WebView
                                automaticallyAdjustContentInsets={false}
                                javaScriptCanOpenWindowsAutomatically={true}
                                allowFileAccessFromFileURLs={true}
                                allowUniversalAccessFromFileURLs={true}
                                allowsFullscreenVideo={true}
                                allowsInlineMediaPlayback={true}
                                allowFileAccess={true}
                                geolocationEnabled={true}
                                cacheEnabled={true}
                                onShouldStartLoadWithRequest={() => true}
                                ref={webView}
                                source={{uri: currentWebviewSite}}
                                startInLoadingState={true}
                                javaScriptEnabled={true}
                                useSharedProcessPool={true}
                                onLoadStart={() => {
                                    setLoadingWebview(true);
                                }}
                                onLoad={() => {
                                    setLoadingWebview(false);
                                }}
                            />
                        </View>
                        <VPSTopButton
                            theme={theme}
                            onPress={onToggleSideBar}
                        />
                    </Animated.View>
                </View>
            </SafeAreaView>
        </FreezeScreen>
    );
};

export default VPSSocialScreen;