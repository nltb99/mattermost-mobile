// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';

import TeamItem from './team_item';

export type TFunctionListProps = {};

const keyExtractor = (item: any) => item.id;

const renderTeam = ({item}: ListRenderItemInfo<any>) => {
    return <TeamItem myTeam={item}/>;
};

export default function FunctionList() {
    const myOrderedFunctions: any = [
        {
            id: '1',
            iconName: 'power-plug-outline',
        },
        {
            id: '2',
            iconName: 'timeline-text-outline',
        },
        {
            id: '3',
            iconName: 'shield-alert-outline',
        },
        {
            id: '4',
            iconName: 'view-grid-plus-outline',
        },
        {
            id: '5',
            iconName: 'video-outline',
        },
        {
            id: '6',
            iconName: 'view-grid-plus-outline',
        },
    ];

    return (
        <View style={styles.container}>
            <FlatList
                bounces={false}
                contentContainerStyle={styles.contentContainer}
                data={myOrderedFunctions}
                fadingEdgeLength={30}
                keyExtractor={keyExtractor}
                renderItem={renderTeam}
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
