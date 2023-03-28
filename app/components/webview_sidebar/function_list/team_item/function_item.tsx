// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {View} from 'react-native';

import Badge from '@components/badge';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

import FunctionIcon from './function_icon';

type Props = {
    myTeam: any;
    hasUnreads: boolean;
    mentionCount: number;
    selected: boolean;
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            height: 54,
            width: 54,
            flex: 0,
            padding: 3,
            borderRadius: 10,
            marginVertical: 3,
            overflow: 'hidden',
        },
        containerSelected: {
            borderWidth: 3,
            borderRadius: 14,
            borderColor: theme.sidebarTextActiveBorder,
        },
        unread: {
            left: 43,
            top: 3,
        },
        mentionsOneDigit: {
            top: 1,
            left: 31,
        },
        mentionsTwoDigits: {
            top: 1,
            left: 30,
        },
        mentionsThreeDigits: {
            top: 1,
            left: 28,
        },
    };
});

export default function FunctionItem({
    myTeam,
    hasUnreads,
    mentionCount,
    selected,
}: Props) {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    const hasBadge = Boolean(mentionCount || hasUnreads);
    let badgeStyle = styles.unread;
    let value = mentionCount;
    if (!mentionCount && hasUnreads) {
        value = -1;
    }

    switch (true) {
        case value > 99:
            badgeStyle = styles.mentionsThreeDigits;
            break;
        case value > 9:
            badgeStyle = styles.mentionsTwoDigits;
            break;
        case value > 0:
            badgeStyle = styles.mentionsOneDigit;
            break;
    }

    return (
        <>
            <View
                style={[
                    styles.container,
                    selected ? styles.containerSelected : undefined,
                ]}
            >
                <TouchableWithFeedback

                    // onPress={() => handleTeamChange(serverUrl, team.id)}
                    onPress={() => {
                        //
                    }}
                    type='opacity'
                >
                    <FunctionIcon
                        item={myTeam}
                        selected={selected}
                    />
                </TouchableWithFeedback>
            </View>
            <Badge
                borderColor={theme.sidebarHeaderBg}
                visible={hasBadge && !selected}
                style={badgeStyle}
                value={value}
            />
        </>
    );
}
