// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {createContext} from 'react';

type Props = {
    token: JwtSocialContext;
    children: React.ReactNode;
};

type WithServerUrlProps = {
    jwtToken: string;
};

type GetProps<C> = C extends React.ComponentType<infer P & WithServerUrlProps>
    ? P
    : never;

type JwtSocialContext = {
    jwtToken: string;
};

const JwtSocialContext = createContext<JwtSocialContext>({jwtToken: ''});
const {Provider, Consumer} = JwtSocialContext;

function JwtVPSSocialProvider({token, children}: Props) {
    return <Provider value={token}>{children}</Provider>;
}

export function withServerUrl<
    C extends React.ComponentType<P>,
    P = GetProps<C>
>(Component: C) {
    return function ServerUrlComponent(
        props: JSX.LibraryManagedAttributes<C, P>,
    ) {
        return (
            <Consumer>
                {(jwtToken: JwtSocialContext) => (
                    <Component
                        {...props}
                        jwtToken={jwtToken.jwtToken}
                    />
                )}
            </Consumer>
        );
    };
}

export function useJwtVPSSocial(): string {
    const data = React.useContext(JwtSocialContext);
    return data.jwtToken || '';
}

export default JwtVPSSocialProvider;
