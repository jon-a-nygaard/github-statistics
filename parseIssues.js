'use strict';
const issues = require('./issues.json');
let openIssues = 0;
const data = issues.reduce((arr, issue) => {
	const isPullRequest = issue.pull_request !== undefined;
	// We are only interested in regular issues.
	if (!isPullRequest) {
		let time = +new Date(issue.created_at);
		arr.push({
			timestamp: time,
			event: 1
		});
		if (issue.state === 'closed') {
			time = +new Date(issue.closed_at);
			arr.push({
				timestamp: time,
				event: -1
			});
		}
	}
	return arr;
}, [])
.sort((a, b) => {
	return a.timestamp - b.timestamp;
}).map(d => {
	openIssues += d.event;
	return [d.timestamp, openIssues];
});
console.log(data);
const fs = require('fs');
fs.writeFileSync('data.json', JSON.stringify(data));
