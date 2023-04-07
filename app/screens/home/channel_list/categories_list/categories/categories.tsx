// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {FlatList, StyleSheet, View} from 'react-native';

import {switchToChannelById} from '@actions/remote/channel';
import {useTheme} from '@app/context/theme';
import Loading from '@components/loading';
import ThreadsButton from '@components/threads_button';
import {
    CHANNELS_CATEGORY,
    FAVORITES_CATEGORY,
    DMS_CATEGORY,
} from '@constants/categories';
import {useServerUrl} from '@context/server';
import {useIsTablet} from '@hooks/device';
import {useTeamSwitch} from '@hooks/team_switch';

import CategoryBody from './body';
import LoadCategoriesError from './error';
import UnreadCategories from './unreads';

import type CategoryModel from '@typings/database/models/servers/category';

const Tab = createMaterialTopTabNavigator();

type Props = {
    categories: CategoryModel[];
    onlyUnreads: boolean;
    unreadsOnTop: boolean;
    isCRTEnabled: boolean;
};

const styles = StyleSheet.create({
    mainList: {
        flex: 1,
        marginLeft: -18,
        marginRight: -20,
    },
    loadingView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});

const extractKey = (item: CategoryModel | 'UNREADS') =>
    (item === 'UNREADS' ? 'UNREADS' : item.id);

const Categories = ({
    categories,
    onlyUnreads,
    unreadsOnTop,
    isCRTEnabled,
}: Props) => {
    const {formatMessage} = useIntl();

    const theme = useTheme();
    const intl = useIntl();
    const listRef = useRef<FlatList>(null);
    const serverUrl = useServerUrl();
    const isTablet = useIsTablet();
    const switchingTeam = useTeamSwitch();
    const teamId = categories[0]?.teamId;
    const categoriesToShow = useMemo(() => {
        if (onlyUnreads && !unreadsOnTop) {
            return ['UNREADS' as const];
        }
        const orderedCategories = [...categories];
        orderedCategories.sort((a, b) => a.sortOrder - b.sortOrder);
        if (unreadsOnTop) {
            return ['UNREADS' as const, ...orderedCategories];
        }
        return orderedCategories;
    }, [categories, onlyUnreads, unreadsOnTop]);

    const [initiaLoad, setInitialLoad] = useState(!categoriesToShow.length);

    const onChannelSwitch = useCallback(
        async (channelId: string) => {
            switchToChannelById(serverUrl, channelId);
        },
        [serverUrl],
    );

    const renderCategory = useCallback(
        (data: {item: CategoryModel | 'UNREADS'}) => {
            if (data.item === 'UNREADS') {
                return (
                    <UnreadCategories
                        currentTeamId={teamId}
                        isTablet={isTablet}
                        onChannelSwitch={onChannelSwitch}
                        onlyUnreads={onlyUnreads}
                    />
                );
            }
            return (
                <View style={{padding: 15}}>
                    {/* <CategoryHeader category={data.item}/> */}
                    <CategoryBody
                        category={data.item}
                        isTablet={isTablet}
                        locale={intl.locale}
                        onChannelSwitch={onChannelSwitch}
                    />
                </View>
            );
        },
        [teamId, intl.locale, isTablet, onChannelSwitch, onlyUnreads],
    );

    useEffect(() => {
        const t = setTimeout(() => {
            setInitialLoad(false);
        }, 0);

        return () => clearTimeout(t);
    }, []);

    if (!categories.length) {
        return <LoadCategoriesError/>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dataFavorite = useMemo(() => {
        if (!Array.isArray(categoriesToShow)) {
            return [];
        }

        return categoriesToShow.filter((e) => e.type === FAVORITES_CATEGORY);
    }, [categoriesToShow]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dataChannel = useMemo(() => {
        if (!Array.isArray(categoriesToShow)) {
            return [];
        }

        return categoriesToShow.filter((e) => e.type === CHANNELS_CATEGORY);
    }, [categoriesToShow]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dataDirectMessage = useMemo(() => {
        if (!Array.isArray(categoriesToShow)) {
            return [];
        }

        return categoriesToShow.filter((e) => e.type === DMS_CATEGORY);
    }, [categoriesToShow]);

    return (
        <>
            {!switchingTeam && !initiaLoad && onlyUnreads && (
                <View style={styles.mainList}>
                    <UnreadCategories
                        currentTeamId={teamId}
                        isTablet={isTablet}
                        onChannelSwitch={onChannelSwitch}
                        onlyUnreads={onlyUnreads}
                    />
                </View>
            )}

            {!switchingTeam && !initiaLoad && !onlyUnreads && (
                <Tab.Navigator
                    backBehavior='none'
                    screenOptions={{
                        tabBarScrollEnabled: true,
                        tabBarBounces: true,
                        tabBarInactiveTintColor: theme.sidebarText,
                        tabBarActiveTintColor: theme.mentionHighlightBg,
                        tabBarStyle: {backgroundColor: theme.sidebarBg},
                        tabBarIndicatorStyle: {
                            backgroundColor: theme.mentionHighlightBg,
                        },
                    }}
                >
                    <Tab.Screen
                        name={formatMessage({
                            id: 'chat_screen.channel_tab',
                            defaultMessage: 'Channels',
                        })}
                        component={() => {
                            return (
                                <FlatList
                                    data={dataChannel}
                                    ref={listRef}
                                    renderItem={renderCategory}
                                    style={styles.mainList}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={extractKey}
                                    initialNumToRender={dataChannel.length}

                                    // @ts-expect-error strictMode not included in the types
                                    strictMode={true}
                                />
                            );
                        }}
                    />
                    <Tab.Screen
                        name={formatMessage({
                            id: 'chat_screen.direct_message',
                            defaultMessage: 'Direct messages',
                        })}
                        component={() => {
                            return (
                                <FlatList
                                    data={dataDirectMessage}
                                    ref={listRef}
                                    renderItem={renderCategory}
                                    style={styles.mainList}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={extractKey}
                                    initialNumToRender={
                                        dataDirectMessage.length
                                    }

                                    // @ts-expect-error strictMode not included in the types
                                    strictMode={true}
                                />
                            );
                        }}
                    />
                    {isCRTEnabled && (
                        <Tab.Screen
                            name={formatMessage({
                                id: 'chat_screen.subject_tab',
                                defaultMessage: 'Subjects',
                            })}
                            component={() => {
                                return (
                                    <View style={{padding: 15}}>
                                        <ThreadsButton/>
                                    </View>
                                );
                            }}
                        />
                    )}
                    <Tab.Screen
                        name={formatMessage({
                            id: 'channel_list.favorites_category',
                            defaultMessage: 'Favorites',
                        })}

                        // options={{
                        //     tabBarShowLabel: false,
                        //     tabBarIcon: ({focused}) => {
                        //         return (
                        //             <CompassIcon
                        //                 size={20}
                        //                 name='heart-outline'
                        //                 color={
                        //                     focused ? theme.buttonBg : theme.sidebarText
                        //                 }
                        //             />
                        //         );
                        //     },
                        // }}
                        component={() => {
                            return (
                                <FlatList
                                    data={dataFavorite}
                                    ref={listRef}
                                    renderItem={renderCategory}
                                    style={styles.mainList}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={extractKey}
                                    initialNumToRender={dataFavorite.length}

                                    // @ts-expect-error strictMode not included in the types
                                    strictMode={true}
                                />
                            );
                        }}
                    />
                </Tab.Navigator>
            )}

            {(switchingTeam || initiaLoad) && (
                <View style={styles.loadingView}>
                    <Loading
                        size='large'
                        themeColor='sidebarText'
                    />
                </View>
            )}
        </>
    );
};

export default Categories;
