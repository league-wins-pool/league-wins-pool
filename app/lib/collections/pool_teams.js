PoolTeams = new Mongo.Collection('pool_teams');

PoolTeams.schema = new SimpleSchema({
  leagueId: { type: String, regEx: SimpleSchema.RegEx.Id },
  seasonId: { type: String, regEx: SimpleSchema.RegEx.Id },
  poolId: { type: String, regEx: SimpleSchema.RegEx.Id },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  userTeamName: {
    label: "Team name",
    type: String
  },
  leagueTeamIds: {
    label: "Drafted teams",
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    autoform: {
      minCount: 1,
      maxCount: 4,
      initialCount: 4
    }
  },
  'leagueTeamIds.$': {
    autoform: {
      afFieldInput: {
        options: function() {
          return LeagueTeams.find({}).map( function(leagueTeam) {
            return { label: leagueTeam.fullName(), value: leagueTeam._id }
          } );
        }
      }
    }
  },
  pickNumbers: { type: [Number], optional: true },
  leagueTeamMascotNames: {
    type: [String],
    autoValue: function() {
      let mascots = [];
      for (var leagueTeamId of this.field("leagueTeamIds").value) {
        const leagueTeam = LeagueTeams.findOne({ _id: leagueTeamId });
        mascots.push(leagueTeam.mascotName);
      }
      return mascots;
    }
  },
  totalWins: { type: Number, defaultValue: 0 },
  totalGames: { type: Number, defaultValue: 0 },
  totalPlusMinus: { type: Number, defaultValue: 0 },
  createdAt: {
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  updatedAt: {
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});
PoolTeams.attachSchema(PoolTeams.schema);

PoolTeams.helpers({
  teamSummary: function () {
    let string = '';
    for (var i = 0; i < this.leagueTeamMascotNames.length; i++) {
      string += `${this.leagueTeamMascotNames[i]} #${this.pickNumbers[i]}, `;
    }
    if (string.length > 0)
      string = string.substr(0, string.length - 2);
    return string;
  }
});

if (Meteor.isServer) {
  PoolTeams.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  PoolTeams.deny({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}