// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';

import {useJwtVPSSocial} from '@app/context/jwt_social';

import TeamItem from './team_item';

export type TVPSSocialFunction = {
    id: string;
    iconName: string;
    uri: string;
};

const keyExtractor = (item: TVPSSocialFunction) => item.id;

const renderTeam = (
    {item}: ListRenderItemInfo<TVPSSocialFunction>,
    onChangeWebView: (item: TVPSSocialFunction) => void,
) => {
    return (
        <TeamItem
            hasUnreads={false}
            onChangeWebView={() => onChangeWebView(item)}
            myTeam={item}
        />
    );
};

export type TFunctionListProps = {
    onChangeWebView: (item: TVPSSocialFunction) => void;
};

export default function FunctionList({onChangeWebView}: TFunctionListProps) {
    const jwtToken = useJwtVPSSocial();
    const myOrderedFunctions: TVPSSocialFunction[] = [
        {
            id: '1',
            iconName: 'play-box-multiple-outline',
            uri: `https://social.vuongphatvpn.vn?token=${jwtToken}`,
        },
        {
            id: '2',
            iconName: 'power-plug-outline',
            uri: `https://bds.vuongphatvpn.vn?token=${jwtToken}`,
        },
        {
            id: '3',
            iconName: 'hammer',
            uri: `https://dichvu.vuongphatvpn.vn?token=${jwtToken}`,
        },
        {
            id: '4',
            iconName: 'book-lock-outline',
            uri: `https://booking.vuongphatvpn.vn?token=${jwtToken}`,
        },
        {
            id: '5',
            iconName: 'eye-outline',
            uri: `https://music.vuongphatvpn.vn?token=${jwtToken}`,
        },
        {
            id: '6',
            iconName: 'video-outline',
            uri: `https://video.vuongphatvpn.vn?token=${jwtToken}`,
        },
        {
            id: '7',
            iconName: 'view-grid-plus-outline',
            uri: `https://khoahoc.vuongphatvpn.vn?token=${jwtToken}`,
        },
        {
            id: '8',
            iconName: 'webhook',
            uri: 'https://news.vuongphatvpn.vn',
        },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                key={'id'}
                id='id'
                bounces={false}
                contentContainerStyle={styles.contentContainer}
                data={myOrderedFunctions}
                fadingEdgeLength={30}
                keyExtractor={keyExtractor}
                renderItem={(item: TVPSSocialFunction) =>
                    renderTeam(item, onChangeWebView)
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
    },
    contentContainer: {
        alignItems: 'center',
        marginVertical: 6,
        paddingBottom: 10,
    },
});
