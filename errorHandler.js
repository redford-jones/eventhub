/**
 * Created by robjo on 12/04/2016.
 */
var fs = require('fs');
var path = require('path');
var logDirectory = path.join(__dirname, 'log');

var randErrNum = Math.floor(Math.random() * 20);
var now = new Date();
var exports = function generateError(req, err) {
    
    return randErrNum;
}

module.exports(exports);