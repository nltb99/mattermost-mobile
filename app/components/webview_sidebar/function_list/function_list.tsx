// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';

import {useJwtVPSSocial} from '@app/context/jwt_social';
import {VPS_WEB_VIEW_LINK} from '@app/utils/constants';

import TeamItem from './team_item';

export type TVPSSocialFunction = {
    id: string;
    iconName: string;
    uri: string;
    params: string;
    selected: boolean;
};

const keyExtractor = (item: TVPSSocialFunction) => item.id;

const renderTeam = (
    {item}: ListRenderItemInfo<TVPSSocialFunction>,
    onChangeWebView: any,
    token: string,
) => {
    return (
        <TeamItem
            hasUnreads={false}
            onChangeWebView={() => onChangeWebView(item, token)}
            myTeam={item}
            selected={false}
        />
    );
};

export type TFunctionListProps = {
    myOrderedFunctions: TVPSSocialFunction[];
    onChangeWebView: any;
};

export default function FunctionList({
    myOrderedFunctions,
    onChangeWebView,
}: TFunctionListProps) {
    const jwtToken = useJwtVPSSocial();

    useEffect(() => {
        onChangeWebView(VPS_WEB_VIEW_LINK[0], jwtToken, true);
    }, [jwtToken]);

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
                    renderTeam(item, onChangeWebView, jwtToken)
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
