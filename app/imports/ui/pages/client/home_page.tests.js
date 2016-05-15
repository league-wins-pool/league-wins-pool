/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { sinon } from 'meteor/practicalmeteor:sinon';


import { withRenderedTemplate } from '../../test-helpers.js';
import '../home_page.js';

describe('Home_page', function () {
  beforeEach(function () {
    Template.registerHelper('_', key => key);
    sinon.stub(Meteor, 'subscribe', () => ({
      subscriptionId: 0,
      ready: () => true,
    }));
  });

  afterEach(function () {
    Template.deregisterHelper('_');
    Meteor.subscribe.restore();
  });

  it('renders correctly with simple data', function () {
    withRenderedTemplate('Home_page', {}, el => {
      const renderedText = $(el).find('.list-items input[type=text]')
        .map((i, e) => $(e).val())
        .toArray();
      chai.assert.deepEqual(renderedText, 'hi');
    });
  });
});
