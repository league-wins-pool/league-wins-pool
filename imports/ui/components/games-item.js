import { Template } from 'meteor/templating';
import SimpleSchema from 'simpl-schema';
import { _ } from 'lodash';

import { Games } from '../../api/games/games';

import './games-item.html';

function myTeamClassHelper(myLeagueTeamIds, leagueTeamId, myScore, theirScore) {
  if (_.includes(myLeagueTeamIds, leagueTeamId)) {
    if (myScore > theirScore) {
      return 'success';
    }
    if (myScore < theirScore) {
      return 'danger';
    }
    return 'info';
  }
  return '';
}

Template.Games_item.helpers({
  game: () => Template.instance().getGame(),

  seasonId: () => Template.currentData().seasonId,

  poolId: () => Template.currentData().poolId,

  homePoolTeamId: () => {
    const { poolId, seasonId } = Template.currentData();
    const game = Template.instance().getGame();
    return game.homePoolTeamId(poolId, seasonId);
  },

  awayPoolTeamId: () => {
    const { poolId, seasonId } = Template.currentData();
    const game = Template.instance().getGame();
    return game.awayPoolTeamId(poolId, seasonId);
  },

  homeTeamPickId: () => {
    const { poolId, seasonId } = Template.currentData();
    const game = Template.instance().getGame();
    return game.homeTeamPickId(poolId, seasonId);
  },

  awayTeamPickId: () => {
    const { poolId, seasonId } = Template.currentData();
    const game = Template.instance().getGame();
    return game.awayTeamPickId(poolId, seasonId);
  },

  myTeamClass: (game, isHomeTeam) => {
    if (isHomeTeam) {
      return myTeamClassHelper(Template.currentData().myLeagueTeamIds, game.homeTeamId, game.homeScore, game.awayScore);
    }
    return myTeamClassHelper(Template.currentData().myLeagueTeamIds, game.awayTeamId, game.awayScore, game.homeScore);
  },
});

Template.Games_item.onCreated(function () {
  new SimpleSchema({
    gameId: { type: String },
    seasonId: { type: String },
    poolId: { type: String },
    poolTeamId: { type: String, optional: true },
    myLeagueTeamIds: { type: Array, optional: true, defaultValue: [] },
    'myLeagueTeamIds.$': { type: String },
    includeInterestRatings: { type: Boolean, optional: true, defaultValue: true },
  }).validate(Template.currentData());

  this.getGame = () => Games.findOne(this.data.gameId);

  this.autorun(() => {
    this.subscribe('games.single', this.data.gameId);
  });
});
