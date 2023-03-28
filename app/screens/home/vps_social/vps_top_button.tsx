// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {StyleSheet, TouchableOpacity} from 'react-native';

import CompassIcon from '@app/components/compass_icon';
import {changeOpacity} from '@app/utils/theme';

export type TVPSTopButtonProps = {
    theme: Theme;
    onPress: () => void;
};

export const VPSTopButton = ({theme, onPress}: TVPSTopButtonProps) => {
    const styles = StyleSheet.create({
        icon: {
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 10,
            top: 3,
            left: 12,
            width: 45,
            height: 45,
            backgroundColor: theme.sidebarTextHoverBg,
            borderRadius: 8,
        },
    });

    return (
        <TouchableOpacity
            style={styles.icon}
            onPress={onPress}
        >
            <CompassIcon
                color={changeOpacity(theme.sidebarText, 0.48)}
                name={'arrow-expand'}
                size={20}
            />
        </TouchableOpacity>
    );
};
