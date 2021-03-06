import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';

import { PoolTeamWeeks } from '../../api/pool_team_weeks/pool_team_weeks';

import './pools-records-pool-teams-most-week.html';

Template.Pools_records_pool_teams_most_week.helpers({
  poolTeamWeeks: () => {
    const { metricField, sort } = Template.currentData();
    const filter = { sort: {}, limit: 5 };
    filter.sort[metricField] = sort;
    return PoolTeamWeeks.find(
      {
        poolId: Template.currentData().poolId,
      },
      filter,
    );
  },

  getMetric: (poolTeamWeek) => _.get(poolTeamWeek, Template.currentData().metricField),
});

Template.Pools_records_pool_teams_most_week.onCreated(function () {
  new SimpleSchema({
    poolId: { type: String },
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: SimpleSchema.Integer, allowedValues: [1, -1] },
    tableId: { type: String },
  }).validate(this.data);

  this.autorun(() => {
    this.subscribe('poolTeamWeeks.ofPool', this.data.poolId);
  });
});
