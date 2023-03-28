// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';

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
    const myOrderedFunctions: TVPSSocialFunction[] = [
        {
            id: '1',
            iconName: 'power-plug-outline',
            uri: 'https://bds.vuongphatvpn.vn',
        },
        {
            id: '2',
            iconName: 'hammer',
            uri: 'https://dichvu.vuongphatvpn.vn',
        },
        {
            id: '3',
            iconName: 'book-lock-outline',
            uri: 'https://booking.vuongphatvpn.vn',
        },
        {
            id: '4',
            iconName: 'eye-outline',
            uri: 'https://music.vuongphatvpn.vn',
        },
        {
            id: '5',
            iconName: 'video-outline',
            uri: 'https://video.vuongphatvpn.vn',
        },
        {
            id: '6',
            iconName: 'view-grid-plus-outline',
            uri: 'https://game.vuongphatvpn.vn',
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
                renderItem={(item) => renderTeam(item, onChangeWebView)}
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
