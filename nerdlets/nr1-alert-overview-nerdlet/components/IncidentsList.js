import React from 'react';
import PropTypes from 'prop-types';
import { BillboardChart, BarChart,PieChart, AreaChart, Stack, StackItem } from 'nr1';
import ReactTable from "react-table";
import sortBy from 'lodash/sortBy';
import config from 'react-global-configuration';

export default class IncidentsList extends React.Component {
  static propTypes = {
    nerdletUrlState: PropTypes.object,
    launcherUrlState: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.accountId = config.get('accountId')
    this.eventName = config.get('eventName')
    this.days = config.get('days')
  }

  render() {

    const statusOpen = "'open'";
    const statusClosed = "'closed'";
    const alertTrend = 'SELECT count(*) FROM ' + this.eventName + ' timeseries Since ' + this.days + ' days ago facet  current_state';
    const alertCountByAccount = 'SELECT count(*) FROM ' + this.eventName + '  where current_state=' + statusOpen + ' FACET account_name Since ' + this.days + ' days ago';
    const alertCountByCondition = 'SELECT count(*)  FROM ' + this.eventName + '  WHERE current_state = ' + statusOpen + ' SINCE ' + this.days + ' days ago FACET condition_name';
    const averageDurationByCondition = 'SELECT average(duration)/1000/60  FROM ' + this.eventName + '  WHERE current_state = ' + statusClosed + ' SINCE ' + this.days + ' days ago FACET condition_name';
    const alertCountByPolicy = 'SELECT count(*)  FROM ' + this.eventName + '  WHERE current_state = ' + statusOpen + ' SINCE ' + this.days + ' days ago FACET policy_name';
    const alertCountWOW = 'SELECT count(*) FROM ' + this.eventName + '  WHERE current_state = ' + statusOpen + ' SINCE 1 week ago COMPARE WITH 1 week ago';
    
    const final = {}

    this.props.incidentsList.map(incident => {
      let incidentData = final[incident.incident_id]
      if (!incidentData) {
        incidentData = []
      }
      incidentData.push({
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
      incidentData = sortBy(incidentData, function (incidentData) {
        return incidentData.time
      }).reverse();
      final[incident.incident_id] = incidentData
    })

    var sortedData = [];
    Object.keys(final).forEach(function (key) {
      let array = final[key];
      sortedData.push(array[0])
    });

    return (

      <div>
        <h2>Current Alert Status</h2>
        <div>
          <ReactTable
            data={sortedData}
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
            <h3>Alert Count By Account - {this.days} day</h3>
            <PieChart fullWidth
              accountId={this.accountId}
              query={alertCountByAccount}
            />
          </StackItem>
          <StackItem grow>
            <h3>Incident Trend - {this.days} day</h3>
            <AreaChart fullWidth
              accountId={this.accountId}
              query={alertTrend}
            />
          </StackItem>
          <StackItem grow>
            <h3>Incident Count (Compared With Last Week)</h3>
            <BillboardChart fullWidth
              accountId={this.accountId}
              query={alertCountWOW}
            />
          </StackItem>
        </Stack>
        <Stack horizontalType={Stack.HORIZONTAL_TYPE.FILL_EVENLY} fullWidth>
          <StackItem grow>
            <h3>Alert Count By Poilcy - {this.days} day</h3>
            <PieChart fullWidth
              accountId={this.accountId}
              query={alertCountByPolicy}
            />
          </StackItem>
          <StackItem grow>
            <h3>Alert Count By Condition - {this.days} day</h3>
            <PieChart fullWidth
              accountId={this.accountId}
              query={alertCountByCondition}
            />
          </StackItem>
          <StackItem grow>
            <h3>Average Incident Duration By Condition  - {this.days} day</h3>
            <BarChart fullWidth
              accountId={this.accountId}
              query={averageDurationByCondition}
            />
          </StackItem>
          
        </Stack>
      </div>
    )
  };

}