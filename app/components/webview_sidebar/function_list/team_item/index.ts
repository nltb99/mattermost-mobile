// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import {of as of$} from 'rxjs';
import {switchMap, distinctUntilChanged} from 'rxjs/operators';

import {observeCurrentTeamId} from '@queries/servers/system';
import {observeMentionCount, observeTeam} from '@queries/servers/team';

import FunctionItem from './function_item';

import type {TVPSSocialFunction} from '../function_list';
import type {WithDatabaseArgs} from '@typings/database/database';

type WithTeamsArgs = WithDatabaseArgs & {
    myTeam: TVPSSocialFunction;
};

const enhance = withObservables(
    ['myTeam'],
    ({myTeam, database}: WithTeamsArgs) => {
        const selected = observeCurrentTeamId(database).pipe(
            switchMap((ctid) => of$(ctid === myTeam.id)),
            distinctUntilChanged(),
        );

        return {
            selected,
            team: observeTeam(database, myTeam.id),
            mentionCount: observeMentionCount(database, myTeam.id, false),
        };
    },
);

export default withDatabase(enhance(FunctionItem));
