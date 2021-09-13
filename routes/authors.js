const axios = require("axios");
var express = require("express");
const router = express.Router();
const config = require("../config.json");
var parser = require("fast-xml-parser");

/* Want to make sure that our loop over all the authors waits for all the various api calls.
So it needs to be broken out into an async function of its own */
const loopThroughAuthors = async (authors, authorStats, prefix, suffix) => {
	for (let i = 0; i < authors.length; i++) {
		let authorPublications = await axios.get(
			`${config.arxivDomain}${prefix}"${authors[i]}"${suffix}`,
			config.arxivRequestConfig
		);

		authorStats.push(await getStats(authors[i], authorPublications.data));
	}
};

/* Again, we need our looping over the author's publications to be waited on by the loop that makes the api calls so it's been broken out.
Besides, this better adheres to the SRP.
In here we are getting the most recent publication date so we can sort the authors by that and we are calculating the number of
publications within the last 6 months */
const getStats = async (author, data) => {
	const json = parser.parse(data);

	const mostRecentPublication = json.feed.entry[0].published;

	let totalPublications = 0;

	for (let j = 0; j < json.feed.entry.length; j++) {
		let convertedDate = new Date(json.feed.entry[j].published);
		let now = new Date();

		if (
			convertedDate.getMonth() >= now.getMonth() - 6 &&
			convertedDate.getFullYear() === now.getFullYear()
		) {
			totalPublications++;
		}
	}

	return {
		author,
		totalPublications,
		mostRecentPublication: new Date(mostRecentPublication),
	};
};

/* This is our sort function so that we can return the authors ordered by their most recent publication,
and failing that by the number of publications they've had in the past 6 months */
const authorStatsSort = (a, b) => {
	if (b.mostRecentPublication.getTime() === a.mostRecentPublication.getTime()) {
		// totalPublications is only important when mostRecentPublication is the same for both
		return b.totalPublications - a.totalPublications;
	}
	return b.mostRecentPublication.getTime() - a.mostRecentPublication.getTime();
};

/* GET 10 authors and display the number of articles they've written over the last 6 months. Sorted with the newest, most prolific ones first. */
router.get("/", async (req, res, next) => {
	try {
		/* we could have any number of authors. I just chose 10 because that seemed like a good number for one page of results.
        I did not want to implement pagination because I felt that would have monopolized too much of my time.
        however, it seems like an obvious candidate for improving the app */

		/* I chose some authors at random. Because the arxiv api is so oriented towards retrieving articles I don't think there is a way
        to just grab a list of authors. I think a better way to implement this feature would be to allow the user to input a list of
        authors they are interested in ranking by number and frequency of publications */

		const authors = [
			"Alexis Heitzmann",
			"Karen A. Collins",
			"Ares Osborn",
			"David J. Armstrong",
			"Malcolm Fridlund",
			"Diana Dragomir",
			"Mate Vass",
			"Fabio Pizzati",
			"Abhinav Ganesan",
			"Bitan Roy",
		];

		const authorStats = [];

		const staticQueryParamsPrefix = "?search_query=au:";
		const staticQueryParamsSuffix =
			"&sortBy=submittedDate&sortOrder=descending";

		await loopThroughAuthors(
			authors,
			authorStats,
			staticQueryParamsPrefix,
			staticQueryParamsSuffix
		);

		res.send(authorStats.sort(authorStatsSort));
	} catch (e) {
		/* This would be better off being sent to the client so that the client could display an error message informing
        the user of what went wrong and that they should try again. However, it makes my life easier in testing locally to leave it like this */
		throw e;
	}
});

module.exports = router;
