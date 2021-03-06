import WeeklyGamesToWatch from '../../../api/emails/server/weekly-games-to-watch';

export default {
  name: 'weekly-games-to-watch-email',
  path: 'weekly-games-to-watch-email/template.html', // Relative to the 'private' dir.

  helpers: {
    preview() {
      return `Games to watch for ${this.poolName}`;
    },
  },

  route: {
    path: '/weekly-games-to-watch-email/pools/:poolId',
    data(params) {
      const { poolId } = params;

      return WeeklyGamesToWatch.getEmailData(poolId);
    },
  },
};
