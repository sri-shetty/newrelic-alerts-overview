import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NerdGraphQuery } from 'nr1';
import IncidentsList from './IncidentsList';

export default class App extends React.Component {

    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.accountId = 1966971;
    }
    intervalID;
    state = {
        incidentsList: []
    }
    componentDidMount() {
        var duration = this.props.launcherUrlState.timeRange.duration;
        const customRange = 0;
        this.getData(customRange, duration);
        //this.intervalID = setInterval(this.getData.bind(this), 5000);
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    componentDidUpdate(prevProps) {
        if (this.props.launcherUrlState.timeRange !== prevProps.launcherUrlState.timeRange) {
            var duration = this.props.launcherUrlState.timeRange.duration;
            if (duration != null) {
                const customRange = 0;
                this.getData(customRange, duration);
            }
            else {
                const customRange = 1;
                const range = 0;
                this.getData(customRange, range);
            }
        }
    }

    getData = (customRange, range) => {
        var query = `SELECT * FROM alert`;
        var since = ` SINCE ${range / 1000 / 60} MINUTES AGO `;
        if (customRange > 0) {
            const beginTime = new Date(this.props.launcherUrlState.timeRange.begin_time).toISOString().slice(0, 19);
            const endTime = new Date(this.props.launcherUrlState.timeRange.end_time).toISOString().slice(0, 19);
            since = ` SINCE '${beginTime}' ` + ` UNTIL '${endTime}' `;
            query = query + since;
        }
        else {
            since = ` SINCE ${range / 1000 / 60} MINUTES AGO `;
            query = query + since;
        }
        const q = NerdGraphQuery.query({
            query: `{
            actor {
                account(id: ${this.accountId}) {
                  nrql(query: "${query}") {
                    results
                  }
                }
              }
          }` });
        q.then(results => {
            this.setState({ incidentsList: results.data.actor.account.nrql.results, isLoading: false })
        }).catch((error) => { console.log(error); })
    }

    render() {
        const { incidentsList, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return (
            <IncidentsList incidentsList={this.state.incidentsList} />
        );
    }
}
