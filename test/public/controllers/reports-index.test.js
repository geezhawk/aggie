'use strict';

var expect = chai.expect;

describe('ReportsIndexController', function() {
  var scope, httpBackend;

  beforeEach(module('Aggie'));
  beforeEach(module('aggie.templates'));

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    $controller('ReportsIndexController', { $scope: scope });

    httpBackend.when('GET', '/translations/locale-en.json').respond(200, {});
    httpBackend.when('GET', '/translations/locale-debug.json').respond(200, {});
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  // For each of these, expect the right http requests, state transitions, and
  // values changed on scope
  it('grabBatch');
  it('cancelBatch');
  it('markAllReadAndGrabAnother');
  it('markAllReadAndDone');
});
