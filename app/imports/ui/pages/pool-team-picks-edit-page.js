import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import log from '../../utils/log';

import './pool-team-picks-edit-page.html';

import { PoolTeamPicks } from '../../api/pool_team_picks/pool_team_picks';
import { Pools } from '../../api/pools/pools';
import { LeagueTeams } from '../../api/league_teams/league_teams';

Template.PoolTeamPicks_edit_page.helpers({
  poolTeamPicks: () => PoolTeamPicks,

  poolId: () => Template.instance().getPoolId(),

  poolTeamId: () => Template.instance().getPoolTeamId(),

  poolTeamPickDoc: () => Template.instance().getPoolTeamPickDoc(),

  onRemoveSuccess: () => {
    return () => {
      $('.modal-backdrop').hide(); // https://github.com/yogiben/meteor-autoform-modals/issues/65
      FlowRouter.go('PoolTeams.show', {
        poolId: FlowRouter.getParam('poolId'),
        poolTeamId: FlowRouter.getParam('poolTeamId'),
      });
    };
  },
});

Template.PoolTeamPicks_edit_page.onCreated(function () {
  this.getPoolId = () => FlowRouter.getParam('poolId');

  this.getPoolTeamId = () => FlowRouter.getParam('poolTeamId');

  this.getPoolTeamPickId = () => FlowRouter.getParam('poolTeamPickId');

  this.getLeagueId = () => Pools.findOne(this.getPoolId(), { fields: { leagueId: 1 } }).leagueId;

  this.getPoolTeamPickDoc = () => PoolTeamPicks.findOne(this.getPoolTeamPickId());

  this.autorun(() => {
    this.subscribe('pools.single', this.getPoolId(), () => {
      log.debug(`pools.single subscription ready: ${Pools.find(this.getPoolId()).count()} pools`);
      if (Pools.find(this.getPoolId()).count() === 0) {
        log.warn('poolTeamsEdit: redirecting to / because no Pools found for', this.getPoolId());
        FlowRouter.go('/');
        return;
      }

      this.subscribe('leagueTeams.ofLeague', this.getLeagueId(), () => {
        log.debug(`leagueTeams subscription ready: ${LeagueTeams.find().count()} teams`);
      });
    });

    this.subscribe('poolTeamPicks.single', this.getPoolTeamPickId(), () => {
      log.debug('poolTeamPicks.single subscription ready');
    });
  });
});


AutoForm.hooks({
  updatePoolTeamPickForm: {
    onSuccess: () => {
      log.debug('updatePoolTeamPickForm.onSuccess() ==> redirect to poolTeamsShow/',
        FlowRouter.getParam('poolTeamId'));
      FlowRouter.go('PoolTeams.show', {
        poolId: FlowRouter.getParam('poolId'),
        poolTeamId: FlowRouter.getParam('poolTeamId'),
      });
    },
  },
});