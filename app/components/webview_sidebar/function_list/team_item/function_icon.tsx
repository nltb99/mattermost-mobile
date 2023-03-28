// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';

import CompassIcon from '@app/components/compass_icon';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {TVPSSocialFunction} from '../function_list';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.sidebarBg,
            borderRadius: 8,
        },
        containerSelected: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.sidebarBg,
            borderRadius: 6,
        },
        text: {
            color: theme.sidebarText,
            textTransform: 'uppercase',
        },
        image: {
            borderRadius: 8,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
        },
        nameOnly: {
            backgroundColor: changeOpacity(theme.sidebarText, 0.16),
        },
    };
});

type Props = {
    item: TVPSSocialFunction;
    selected: boolean;
    backgroundColor?: string;
    smallText?: boolean;
};

export default function FunctionIcon({
    item,
    selected,
    smallText = false,
    backgroundColor,
}: Props) {
    const [imageError, setImageError] = useState(false);
    const ref = useRef<View>(null);
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const serverUrl = useServerUrl();
    let client = null;
    try {
        client = NetworkManager.getClient(serverUrl);
    } catch (err) {
        // Do nothing
    }

    useEffect(() => setImageError(false), [item]);

    const nameOnly = imageError || !client;
    const containerStyle = useMemo(() => {
        if (selected) {
            return backgroundColor ? [styles.containerSelected, {backgroundColor}] : [styles.containerSelected, nameOnly && styles.nameOnly];
        }

        return backgroundColor ? [styles.container, {backgroundColor}] : [styles.container, nameOnly && styles.nameOnly];
    }, [styles, backgroundColor, selected, nameOnly]);

    const textTypography = typography(
        'Heading',
        smallText ? 200 : 400,
        'SemiBold',
    );
    textTypography.fontFamily = 'Metropolis-SemiBold';

    return (
        <View
            style={containerStyle}
            ref={ref}
        >
            <CompassIcon
                color={changeOpacity(theme.sidebarText, 0.48)}
                name={item?.iconName || ''}
                size={20}
            />
        </View>
    );
}
