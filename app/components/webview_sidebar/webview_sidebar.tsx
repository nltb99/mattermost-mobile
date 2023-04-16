// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import {TEAM_SIDEBAR_WIDTH} from '@constants/view';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

import FunctionList from './function_list';

import type {TVPSSocialFunction} from './function_list/function_list';

type TWebViewSideBarProps = {
    iconPad?: boolean;
    teamsCount: number;
    myOrderedFunctions: TVPSSocialFunction[];
    onChangeWebView: any;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            width: TEAM_SIDEBAR_WIDTH,
            height: '100%',
            backgroundColor: theme.sidebarBg,
            paddingTop: 10,
        },
        listContainer: {
            backgroundColor: theme.sidebarHeaderBg,
            borderTopRightRadius: 12,
            flex: 1,
        },
        iconMargin: {
            marginTop: 44,
        },
    };
});

export default function WebViewSideBar({
    iconPad,
    teamsCount,
    myOrderedFunctions,
    onChangeWebView,
}: TWebViewSideBarProps) {
    const initialWidth = teamsCount > 1 ? TEAM_SIDEBAR_WIDTH : 0;
    const width = useSharedValue(initialWidth);
    const marginTop = useSharedValue(iconPad ? 44 : 0);
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const transform = useAnimatedStyle(() => {
        return {
            width: withTiming(width.value, {duration: 350}),
        };
    }, []);

    const serverStyle = useAnimatedStyle(
        () => ({
            marginTop: withTiming(marginTop.value, {duration: 350}),
        }),
        [],
    );

    useEffect(() => {
        marginTop.value = iconPad ? 44 : 0;
    }, [iconPad]);

    useEffect(() => {
        width.value = teamsCount > 1 ? TEAM_SIDEBAR_WIDTH : 0;
    }, [teamsCount]);

    return (
        <Animated.View style={[styles.container, transform]}>
            <Animated.View style={[styles.listContainer, serverStyle]}>
                <FunctionList
                    onChangeWebView={onChangeWebView}
                    myOrderedFunctions={myOrderedFunctions}
                />
            </Animated.View>
        </Animated.View>
    );
}