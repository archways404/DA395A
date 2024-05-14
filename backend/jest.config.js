module.exports = {
	reporters: [
		'default',
		['jest-silent-reporter', { useDots: true }],
		[
			'jest-summary-reporter',
			{
				failuresOnly: false,
				includeSuiteFailure: true,
				summaryThreshold: 0,
			},
		],
	],
};
