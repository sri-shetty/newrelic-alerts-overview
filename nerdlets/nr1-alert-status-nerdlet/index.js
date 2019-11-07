import React from 'react';
import App from './components/App';
import { AutoSizer, NerdletStateContext, PlatformStateContext } from "nr1";
import config from 'react-global-configuration';

config.set({ accountId: 1966971, eventName: 'alert', days: 7 });

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