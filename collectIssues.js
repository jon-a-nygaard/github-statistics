'use strict';
const request = require('request');
const fs = require('fs');
const c = require('./config.json');
const owner = 'highcharts';
const repo = 'highcharts';
const host = 'https://api.github.com';
const path = `/repos/${owner}/${repo}/issues?state=all&access_token=${c.token}`
console.log('Authorization: ' + c.token)
const getIsssues = (url, max, i, issues, token) => {
	let next = '';
	request({
		url: url,
		headers: {
			'User-Agent': 'jon-a-nygaard'
		}
	}, (error, response, body) => {
		const status = response.statusCode;
		if (!error && status === 200) {
			const json = JSON.parse(body);
			issues = issues.concat(json)
			next = response.headers.link.split(', ').reduce((prev, curr) => {
				let link = prev;
				if (curr.indexOf('rel="next"') > -1) {
					link = curr.split(';')[0];
					link = link.slice(1, -1);
				}
				return link;
			}, '');
		}
		if (next && (!max || i < max)) {
			console.log(i + '. Number of issues collected: ' + issues.length);
			getIsssues(next, max, i + 1, issues, token);
		} else {
			console.log(i + '. Number of issues collected: ' + issues.length);
			console.log('Completed on status: ' + status);
			if (status !== 200) {
				console.log(response.body)
			}
			if (error) {
				console.log(error);
			}
			fs.writeFileSync('issues.json', JSON.stringify(issues, null, '    '));
		}
	})
}
getIsssues(host + path, null, 1, [], c.token);
