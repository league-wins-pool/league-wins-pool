Template.poolsRecordsPoolUsersMostAllTime.helpers({
  poolId: () => Template.instance().getPoolId(),

  poolUsers: () => {
    const collection = new Mongo.Collection(Template.currentData().collectionName);
    const sort = Template.currentData().sort;
    return collection.find({}, { sort: { metric: sort } });
  },

});

Template.poolsRecordsPoolUsersMostAllTime.onCreated(function() {
  new SimpleSchema({
    recordTitle: { type: String },
    metricTitle: { type: String },
    metricField: { type: String },
    sort: { type: Number, allowedValues: [1, -1] },
    collectionName: { type: String },
  }).validate(Template.currentData());

  this.getPoolId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('poolUsersMostAllTime.ofPool', this.getPoolId(), Template.currentData().metricField, Template.currentData().collectionName);
  });
});