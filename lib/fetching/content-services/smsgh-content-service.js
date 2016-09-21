'use strict';

var express = require('express');
var ContentService = require('../content-service');
var util = require('util');

function SMSGhContentService(port) {
  this.fetchType = 'subscribe';
  this._isListening = false;
  this._app = express();
  var self = this;

  var getKeyword = function(req) {
    return 'sms_ghana:' + req.query.keyword;
  };

  this._app.get('/smsghana', function(req, res) {

    var _params = req.query;
    res.send(200);
    var reportData = self._parse(_params);
    self.emit(getKeyword(req), reportData);

  });

  this.port = port || 1111;
}


util.inherits(SMSGhContentService, ContentService);

SMSGhContentService.prototype.subscribe = function(identifier) {
  if (this._isListening) {
    return 'sms_ghana:' + identifier;
  }
  this._isListening = true;
  this.server = this._app.listen(this.port);
  return 'sms_ghana:' + identifier;

// TODO: Modify to have a list of sources subscribed, so double unsubscribe doesn't happen
};

SMSGhContentService.prototype.unsubscribe = function() {
  return;

// TODO: Add server.close() when all sources unsubscribe.

};

SMSGhContentService.prototype._parse = function(query) {
  var returnObject = {};

  if (!this._validate(query)) {
    this.emit('error', new Error('Validation error, something was missing.'));
    return returnObject; // What's this?
  }

  returnObject.authoredAt = new Date(query.date);
  returnObject.fetchedAt = new Date();
  returnObject.url = ''; // since url is part of the schema
  returnObject.author = query.from;
  returnObject.keyword = query.keyword.toLowerCase(); // This may need to change
  returnObject.content = query.fulltext.toLowerCase(); // This may need to change
  return returnObject;
};

SMSGhContentService.prototype._validate = function(data) {
  if (!data.hasOwnProperty('from')) {
    this.emit('warning', new Error('Parse warning: SMSGh element is missing the "from" field'));
    return false;
  }
  if (!data.hasOwnProperty('keyword')) {
    this.emit('warning', new Error('Parse warning: SMSGh element is missing the "keyword" field'));
    return false;
  }
  if (!data.hasOwnProperty('fulltext')) {
    this.emit('warning', new Error('Parse warning: SMSGh element is missing the "fulltext" field'));
    return false;
  }
  return true;
};

module.exports = new SMSGhContentService();