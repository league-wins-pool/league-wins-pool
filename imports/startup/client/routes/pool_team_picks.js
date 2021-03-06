import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// useraccounts:core using the older export method so we can't resolve path
// eslint-disable-next-line import/no-unresolved
import { AccountsTemplates } from 'meteor/useraccounts:core';

import log from '../../../utils/log';

import '../../../ui/pages/pool-team-picks-new-page';
import '../../../ui/pages/pool-team-picks-show-page';
import '../../../ui/pages/pool-team-picks-edit-page';

const group = FlowRouter.group({
  prefix: '/pools/:poolId/teams/:poolTeamId/picks',
});

// http://app.com/pools/:poolId/teams/:poolTeamId/picks/new
group.route('/new', {
  name: 'PoolTeamPicks.new',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're creating picks for a pool team: ${params.poolTeamId}`);
    BlazeLayout.render('App_body', { content: 'PoolTeamPicks_new_page' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId/picks/:poolTeamPickId
group.route('/:poolTeamPickId', {
  name: 'PoolTeamPicks.show',
  action(params) {
    log.debug(`We're showing a pool team pick: ${params.poolTeamId} and ${params.poolTeamPickId}`);
    BlazeLayout.render('App_body', { content: 'PoolTeamPicks_show_page' });
  },
});

// http://app.com/pools/:poolId/teams/:poolTeamId/picks/:poolTeamPickId/edit
group.route('/:poolTeamPickId/edit', {
  name: 'PoolTeamPicks.edit',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    log.debug(`We're editing a pool team pick: ${params.poolTeamId} and ${params.poolTeamPickId}`);
    BlazeLayout.render('App_body', { content: 'PoolTeamPicks_edit_page' });
  },
});
