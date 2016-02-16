PoolTeams = new Mongo.Collection('pool_teams');

PoolTeams.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert) {
        return Pools.findOne(this.field('poolId').value).leagueId;
      }
    },
  },
  seasonId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue() {
      if (this.isInsert && ! this.isSet) {
        // select latest season for league
        const leagueIdField = this.field('leagueId');
        if (leagueIdField.isSet) {
          const leagueId = leagueIdField.value;
          const latestSeason = Modules.seasons.getLatestByLeagueId(leagueId);
          if (latestSeason) return latestSeason._id;
          throw new Error(`No season found for leagueId ${leagueId}`);
        }
        this.unset();
      }
    },
  },
  seasonYear: {
    type: Number,
    autoValue() {
      if (this.isInsert && ! this.isSet) {
        const seasonIdField = this.field('seasonId');
        if (seasonIdField.isSet) {
          const seasonId = seasonIdField.value;
          const season = Seasons.findOne(seasonId);
          if (season) return season.year;
          throw new Error(`No season found for seasonId ${seasonId}`);
        }
      }
    },
  },
  poolId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userTeamName: {
    label: 'Team name',
    type: String,
  },
  leagueTeamIds: {
    label: 'Drafted teams',
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      minCount: 1,
      maxCount: 4,
      initialCount: 4,
    },
  },
  'leagueTeamIds.$': {
    autoform: {
      afFieldInput: {
        options() {
          return LeagueTeams.find({}, { sort: ['cityName', 'asc'] }).map(leagueTeam => {
            return { label: leagueTeam.fullName(), value: leagueTeam._id };
          });
        },
      },
    },
  },
  pickNumbers: {
    type: [Number],
  },
  leagueTeamMascotNames: {
    type: [String],
    autoValue() {
      if (this.field('leagueTeamIds').isSet) {
        let mascots = [];
        for (let leagueTeamId of this.field('leagueTeamIds').value) {
          const leagueTeam = LeagueTeams.findOne(leagueTeamId);
          mascots.push(leagueTeam.mascotName);
        }
        return mascots;
      }
    },
  },
  totalWins: { type: Number, defaultValue: 0 },
  totalLosses: { type: Number, defaultValue: 0 },
  totalGames: { type: Number, defaultValue: 0 },
  totalPlusMinus: { type: Number, defaultValue: 0 },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();  // Prevent user from supplying their own value
    },
  },
  updatedAt: {
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
});
PoolTeams.attachSchema(PoolTeams.schema);

PoolTeams.formSchema = new SimpleSchema({
  poolId: { type: String, regEx: SimpleSchema.RegEx.Id },
  userTeamName: { label: 'Team name', type: String },
  userEmail: { label: 'Email', type: String, regEx: SimpleSchema.RegEx.Email },
  leagueTeamIds: {
    label: 'Drafted teams',
    type: [String],
    autoform: {
      minCount: 1,
      maxCount: 4,
      initialCount: 4,
    },
  },
  'leagueTeamIds.$': {
    autoform: {
      afFieldInput: {
        options() {
          return LeagueTeams.find({}, { sort: ['cityName', 'asc'] }).map(function (leagueTeam) {
            return { label: leagueTeam.fullName(), value: leagueTeam._id };
          });
        },
      },
    },
  },
  pickNumbers: {
    type: [Number],
    label: 'Draft pick numbers',
    autoform: {
      minCount: 1,
      maxCount: 4,
      initialCount: 4,
    },
  },
  'pickNumbers.$': {
    autoform: {
      afFieldInput: {
        options() {
          return _.range(1, LeagueTeams.find().count() + 1).map(function (number) {
            return { label: number, value: number };
          });
        },
      },
    },
  },
});


/* Helpers */
PoolTeams.helpers({
  teamSummary() {
    let string = '';
    for (let i = 0; i < this.leagueTeamMascotNames.length; i++) {
      string += `${this.leagueTeamMascotNames[i]} #${this.pickNumbers[i]}, `;
    }
    if (string.length > 0) string = string.substr(0, string.length - 2);
    return string;
  },
});


/* Access control */
if (Meteor.isServer) {
  PoolTeams.allow({
    insert(userId, doc) {
      return false;
    },

    update(userId, doc, fieldNames, modifier) {
      // verify userId either owns PoolTeam or is commissioner of pool
      const poolId = doc.poolId;
      const pool = Pools.findOne(poolId);
      return (userId === doc.userId ||
        userId === pool.commissionerUserId);
    },

    remove(userId, doc) {
      // verify userId either owns PoolTeam or is commissioner of pool
      const poolId = doc.poolId;
      const pool = Pools.findOne(poolId);
      return (userId === doc.userId ||
      userId === pool.commissionerUserId);
    },
  });
}
