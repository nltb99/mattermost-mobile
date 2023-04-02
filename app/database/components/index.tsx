// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {ComponentType, useEffect, useState} from 'react';

import JwtVPSSocialProvider from '@app/context/jwt_social';
import ServerProvider from '@context/server';
import ThemeProvider from '@context/theme';
import UserLocaleProvider from '@context/user_locale';
import DatabaseManager from '@database/manager';
import {subscribeActiveServers} from '@database/subscription/servers';

import type {Database} from '@nozbe/watermelondb';
import type ServersModel from '@typings/database/models/app/servers';

type State = {
    database: Database;
    serverUrl: string;
    serverDisplayName: string;
};

export function withServerDatabase<T extends JSX.IntrinsicAttributes>(
    Component: ComponentType<T>,
): ComponentType<T> {
    return function ServerDatabaseComponent(props: T) {
        const [state, setState] = useState<State | undefined>();
        const [jwtToken, setJwtToken] = useState<string>('');

        const observer = (servers: ServersModel[]) => {
            const server = servers?.length ? servers.reduce((a, b) =>
                (b.lastActiveAt > a.lastActiveAt ? b : a),
            ) : undefined;

            if (server) {
                const database =
                    DatabaseManager.serverDatabases[server.url]?.database;

                if (database) {
                    setState({
                        database,
                        serverUrl: server.url,
                        serverDisplayName: server.displayName,
                    });
                }

                setTimeout(async () => {
                    const jwtString = await AsyncStorage.getItem('jwtToken');
                    setJwtToken(jwtString || '');
                }, 500);
            } else {
                setState(undefined);
            }
        };

        useEffect(() => {
            const subscription = subscribeActiveServers(observer);

            return () => {
                subscription?.unsubscribe();
            };
        }, []);

        if (!state?.database) {
            return null;
        }

        return (
            <DatabaseProvider
                database={state.database}
                key={state.serverUrl}
            >
                <UserLocaleProvider database={state.database}>
                    <ServerProvider
                        server={{
                            displayName: state.serverDisplayName,
                            url: state.serverUrl,
                        }}
                    >
                        <JwtVPSSocialProvider token={{jwtToken}}>
                            <ThemeProvider database={state.database}>
                                <Component {...props}/>
                            </ThemeProvider>
                        </JwtVPSSocialProvider>
                    </ServerProvider>
                </UserLocaleProvider>
            </DatabaseProvider>
        );
    };
}
