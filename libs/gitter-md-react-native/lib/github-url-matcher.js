/*jshint globalstrict:true, trailing:false, unused:true, node:true */
"use strict";

var url = require('url');

function isValidIssueNumber(val) {
  var number = Number(val);
  return number > 0 && number < Infinity;
}

function isValidCommitHash(val) {
  var hash = val.match(/[a-f0-9]*/)[0] || '';
  return val.length === hash.length;
}

module.exports = function(href) {
  var urlObj = url.parse(href);

  if(urlObj.hostname === 'github.com' && !urlObj.hash) {
    // [ '', 'trevorah', 'test-repo', 'issues', '1' ]
    var pathParts = urlObj.pathname.split('/');

    if(pathParts.length != 5) return;

    var user = pathParts[1];
    var project = pathParts[2];
    var type = pathParts[3];
    var id = pathParts[4];

    if((type === 'issues' || type === 'pull') && id && isValidIssueNumber(id)) {
      return {
        type: 'issue',
        repo: user+'/'+project,
        id: id,
        text: user+'/'+project+'#'+id
      };
    } else if(type === 'commit' && id && isValidCommitHash(id)) {
      return {
        type: 'commit',
        repo: user+'/'+project,
        id: id,
        text: user+'/'+project+'@'+id.substring(0,7)
      };
    }
  }

};
