import React from 'react';
import PropTypes from 'prop-types';
import { BillboardChart, BarChart, AreaChart, Stack, StackItem } from 'nr1';
import ReactTable from "react-table";
import sortBy from 'lodash/sortBy';


export default class IncidentsList extends React.Component {
  static propTypes = {
    nerdletUrlState: PropTypes.object,
    launcherUrlState: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.accountId = 1966971;
  }

  render() {
    console.log("O"+ this.props.accountId);
    const statusOpen = "'open'";
    const statusClosed = "'closed'";
    const days = 30;
    const alertTrend = 'SELECT count(*) FROM alert timeseries Since ' + days + ' days ago facet  current_state';
    const alertCountByPolicy = 'SELECT count(*) FROM alert where current_state=' + statusOpen + ' FACET policy_name Since ' + days + ' days ago';
    const averageDurationByPolicy = 'SELECT average(duration)/1000/60  FROM alert WHERE current_state = ' + statusClosed + ' SINCE ' + days + ' days ago FACET policy_name';
    const alertCountWOW = 'SELECT count(*) FROM alert WHERE current_state = ' + statusOpen + ' SINCE 1 week ago COMPARE WITH 1 week ago';
    const final = {}

    this.props.incidentsList.map(incident => {
      let inc = final[incident.incident_id]
      if (!inc) {
        inc = []
      }
      inc.push({
        incidentNumber: incident.incident_id,
        accountId: incident.account_id,
        accountName: incident.account_name,
        conditionName: incident.condition_name,
        currentState: incident.current_state,
        duration: ((incident.duration) / 1000 / 60).toFixed(0),
        incidentUrl: incident.incident_url,
        policyName: incident.policy_name,
        time: incident.timestamp,
        timestamp: new Date(incident.timestamp).toISOString().slice(0, 19)
      });
      inc = sortBy(inc, function (inc) {
        return inc.time
      }).reverse();
      final[incident.incident_id] = inc
    })

    var value = [];
    Object.keys(final).forEach(function (key) {
      let array = final[key];
      value.push(array[0])
    });

    return (

      <div>
        <h2>Current Alert Status</h2>
        <div>
          <ReactTable
            data={value}
            filterable
            defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toString().toLowerCase()) }}
            columns={[
              {
                Header: () => <strong>AccountId #</strong>,
                accessor: "accountId",
                width: 125,
              },
              {
                Header: () => <strong>Account Name</strong>,
                accessor: "accountName",
                width: 125,
              },
              {
                Header: () => <strong>Incident #</strong>,
                accessor: "incidentNumber",
                width: 125,
              },
              {
                Header: () => <strong>Condition Name</strong>,
                accessor: "conditionName",
                //width: 200,
              },
              {
                Header: () => <strong>Status</strong>,
                accessor: "currentState",
                width: 125,
                id: "currentState",
                Cell: row => (
                  <span>
                    <span style={{
                      color: row.value === 'open' ? '#ff2e00'
                        : row.value === 'closed' ? '#57d500'
                          : row.value === 'acknowledged' ? '#ffbf00'

                            : '#5',
                      transition: 'all .3s ease'
                    }}>
                      &#x25cf;
                  </span> {
                      row.value === 'open' ? 'open'
                        : row.value === 'closed' ? `closed`
                          : row.value === 'acknowledged' ? `acknowledged`
                            : 'closed'
                    }
                  </span>
                ),
                Filter: ({ filter, onChange }) =>
                  <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: "100%" }}
                    value={filter ? filter.value : ""}
                  >
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="acknowledged">Acknowledged</option>

                  </select>
              },
              {
                Header: () => <strong>Duration(min)</strong>,
                accessor: "duration",
                width: 125,
              },
              {
                Header: () => <strong>Policy Name</strong>,
                accessor: "policyName",
                width: 200,
              },
              {
                Header: () => <strong>Created At</strong>,
                accessor: "timestamp",
                width: 150,
              },
              {
                Header: () => <strong>Incident Url</strong>,
                accessor: "incidentUrl",
                Cell: e => <a href={e.value} target="_blank"> {e.value}  </a>
              }

            ]}
            defaultPageSize={10}
            className="-striped -highlight"

          />
        </div>
        <Stack horizontalType={Stack.HORIZONTAL_TYPE.FILL_EVENLY} fullWidth>
          <StackItem grow>
            <h3>Incident Count (Compared With Last Week)</h3>
            <BillboardChart fullWidth
              accountId={this.accountId}
              query={alertCountWOW}
            />
          </StackItem>
          <StackItem grow>
            <h3>Incident Trend - 30 days</h3>
            <AreaChart fullWidth
              accountId={this.accountId}
              query={alertTrend}
            />
          </StackItem>
        </Stack>
        <Stack horizontalType={Stack.HORIZONTAL_TYPE.FILL_EVENLY} fullWidth>
          <StackItem grow>
            <h3>Alert Count By Policy - 30 days</h3>
            <BarChart fullWidth
              accountId={this.accountId}
              query={alertCountByPolicy}
            />
          </StackItem>
          <StackItem grow>
            <h3>Average Incident Duration By Policy - 30 days</h3>
            <BarChart fullWidth
              accountId={this.accountId}
              query={averageDurationByPolicy}
            />
          </StackItem>
        </Stack>
      </div>
    )
  };

}