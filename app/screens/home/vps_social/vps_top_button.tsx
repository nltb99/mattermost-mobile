// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {StyleSheet, TouchableOpacity} from 'react-native';

import CompassIcon from '@app/components/compass_icon';

const styles = StyleSheet.create({
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 10,
        top: 10,
        left: 16,
        width: 40,
        height: 40,
    },
});

export type TVPSTopButtonProps = {
    onPress: () => void;
};

export const VPSTopButton = ({onPress}: TVPSTopButtonProps) => {
    return (
        <TouchableOpacity
            style={styles.icon}
            onPress={onPress}
        >
            <CompassIcon
                color={'white'}
                name={'console'}
                size={20}
            />
        </TouchableOpacity>
    );
};
