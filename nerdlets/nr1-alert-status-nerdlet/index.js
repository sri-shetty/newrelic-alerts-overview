import React, { Component } from 'react';
import App from './components/App';
import { AutoSizer, NerdletStateContext, PlatformStateContext } from "nr1";

export default class Nr1AlertStatus extends React.Component {

    render() {
        return (
            <PlatformStateContext.Consumer>
                {platformUrlState => (
                    <NerdletStateContext.Consumer>
                        {nerdletUrlState => (
                            <AutoSizer>
                                {({ width, height }) => (
                                    <App
                                        height={height}
                                        launcherUrlState={platformUrlState}
                                        nerdletUrlState={nerdletUrlState}
                                        width={width}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </NerdletStateContext.Consumer>
                )}
            </PlatformStateContext.Consumer>
        );
    }

}