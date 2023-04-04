// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {View, useWindowDimensions} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import ThreadsButton from '@components/threads_button';
import {TABLET_SIDEBAR_WIDTH, TEAM_SIDEBAR_WIDTH} from '@constants/view';
import {useTheme} from '@context/theme';
import {useIsTablet} from '@hooks/device';
import {makeStyleSheetFromTheme} from '@utils/theme';

import Categories from './categories';
import ChannelListHeader from './header';
import LoadChannelsError from './load_channels_error';
import SubHeader from './subheader';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.sidebarBg,
        paddingTop: 10,
    },
    containerPadding: {
        paddingLeft: 18,
        paddingRight: 20,
    },
}));

type ChannelListProps = {
    channelsCount: number;
    iconPad?: boolean;
    isCRTEnabled?: boolean;
    teamsCount: number;
};

const getTabletWidth = (teamsCount: number) => {
    return TABLET_SIDEBAR_WIDTH - (teamsCount > 1 ? TEAM_SIDEBAR_WIDTH : 0);
};

const CategoriesList = ({
    channelsCount,
    iconPad,
    isCRTEnabled,
    teamsCount,
}: ChannelListProps) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);
    const {width} = useWindowDimensions();
    const isTablet = useIsTablet();
    const tabletWidth = useSharedValue(
        isTablet ? getTabletWidth(teamsCount) : 0,
    );

    useEffect(() => {
        if (isTablet) {
            tabletWidth.value = getTabletWidth(teamsCount);
        }
    }, [isTablet && teamsCount]);

    const tabletStyle = useAnimatedStyle(() => {
        if (!isTablet) {
            return {
                maxWidth: width,
            };
        }

        return {maxWidth: withTiming(tabletWidth.value, {duration: 350})};
    }, [isTablet, width]);

    let content;

    if (channelsCount < 1) {
        content = <LoadChannelsError/>;
    } else {
        content = (
            <>
                <View style={[styles.containerPadding]}>
                    <SubHeader/>
                    {isCRTEnabled && <ThreadsButton/>}
                </View>
                <Categories/>
            </>
        );
    }

    return (
        <Animated.View style={[styles.container, tabletStyle]}>
            <View style={[styles.containerPadding]}>
                <ChannelListHeader iconPad={iconPad}/>
            </View>
            {content}
        </Animated.View>
    );
};

export default CategoriesList;
