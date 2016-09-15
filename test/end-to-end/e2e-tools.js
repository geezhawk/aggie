'use strict';

var dbTools = require('../database-tools');
var _ = require('lodash');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var Report = require('../../models/report');

chai.use(chaiAsPromised);
var expect = chai.expect;
var promise = protractor.promise;

module.exports = _.clone(dbTools);

module.exports.resetBrowser = function() {
  browser.manage().deleteAllCookies();
};

module.exports.init = function() {
  browser.get(browser.baseUrl);
};

module.exports.initAdmin = function(password) {
  module.exports.init();
  var e1 = expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + 'login');

  element(by.model('user.username')).sendKeys('admin');
  element(by.model('user.password')).sendKeys('letmein1');
  element(by.css('[type="submit"]')).click();
  var e2 = expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + 'reset_admin_password');

  element(by.model('user.password')).sendKeys(password);
  element(by.model('user.passwordConfirmation')).sendKeys(password);
  element(by.css('[type="submit"]')).click();
  var e3 = expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + 'reports');

  return promise.all([e1, e2, e3]);
};

module.exports.logOut = function() {
  // Note: it would be nice if there were a more reliable way to get the logout
  // button.
  element(by.cssContainingText('li a', 'Log out')).click();
  return expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + 'login');
};

module.exports.logIn = function(username, password) {
  element(by.model('user.username')).sendKeys(username);
  element(by.model('user.password')).sendKeys(password);
  element(by.css('[type="submit"]')).click();
  return expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + 'reports');
};

module.exports.makeReports = function(n) {
  return function(done) {
    Report.create(_.map(_.range(n), function(i) {
      return {
        authoredAt: new Date(),
        content: i
      };
    }), done);
  };
};
