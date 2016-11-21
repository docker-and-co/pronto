'use strict';

const https = require('https');
const GITLAB_PROJECT_ID = process.env.CI_PROJECT_ID;
const GITLAB_USER_PRIVATE_TOKEN = process.env.GITLAB_USER_PRIVATE_TOKEN;
const GITLAB_DOMAIN = process.env.GITLAB_DOMAIN;
const CI_BUILD_REF_NAME = process.env.CI_BUILD_REF_NAME;

function apiRequest(request) {
  return new Promise((resolve, reject) => {
    //console.log(`/api/v3/${request}`)
    const req = https.request({
      hostname: GITLAB_DOMAIN,
      port:     443,
      path:     `/api/v3/${request}`,
      method:   'GET',

      headers: {
        'PRIVATE-TOKEN': GITLAB_USER_PRIVATE_TOKEN
      }
    }, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        try {
          //console.log(chunk)
          resolve(JSON.parse(chunk));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}


apiRequest(`projects/${GITLAB_PROJECT_ID}/merge_requests?state=opened`)
  .then((body) => {
    const currentMergeRequest = body.filter((v) => v.source_branch === CI_BUILD_REF_NAME).pop();
    if (!currentMergeRequest) {
      return promise.reject('merge request not found');
    }
    console.log(currentMergeRequest.id);//??
    return currentMergeRequest.id;
  })
  .then((mrid) => apiRequest(`projects/${GITLAB_PROJECT_ID}/merge_requests/${mrid}/commits`))
  .then((commits) => console.log(commits.pop().id))
  .catch((e) => console.error(e, e.stack));
// env CI_PROJECT_ID=445 GITLAB_USER_PRIVATE_TOKEN=kh1 GITLAB_DOMAIN=code.branderstudio.com CI_BUILD_REF_NAME=bad-search node mergeRequestGuesser.js
