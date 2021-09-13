const axios = require("axios");
var express = require("express");
const router = express.Router();
const config = require("../config.json");
var parser = require("fast-xml-parser");

/* GET 20 newest articles containing information relevant to psychiatry, therapy, data science, or machine learning. */
router.get("/", async (req, res, next) => {
	try {
		/* we could have any number of max results. I just chose 20 because that seemed like a good number for one page of results.
        I did not want to implement pagination because I felt that would have monopolized too much of my time.
        however, it seems like an obvious candidate for improving the app */

		const staticQueryParamsPrefix = "?search_query=ti:";
		const staticQueryParamsSuffix =
			"&max_results=5&sortBy=submittedDate&sortOrder=descending";

		const psychiatryArxivResponse = await axios.get(
			/* some kind of helper function to abstract out query creation would be a good improvement to make.
		    then we would have flexibility as we added new endpoints with new ways to search the article archives.
		    otherwise we would quickly find ourselves with hardcoded strings all over the place.
		    if the arxiv api were ever to change its interface we would be faced with a big headache updating our app to be in compliance with it */
			`${config.arxivDomain}${staticQueryParamsPrefix}psychiatry${staticQueryParamsSuffix}`,
			config.arxivRequestConfig
		);

		const therapyArxivResponse = await axios.get(
			`${config.arxivDomain}${staticQueryParamsPrefix}therapy${staticQueryParamsSuffix}`,
			config.arxivRequestConfig
		);

		const machineLearningArxivResponse = await axios.get(
			`${config.arxivDomain}${staticQueryParamsPrefix}"machine learning"${staticQueryParamsSuffix}`,
			config.arxivRequestConfig
		);

		const dataScienceArxivResponse = await axios.get(
			`${config.arxivDomain}${staticQueryParamsPrefix}"data science"${staticQueryParamsSuffix}`,
			config.arxivRequestConfig
		);

		const psychiatryJson = parser.parse(psychiatryArxivResponse.data);
		const therapyJson = parser.parse(therapyArxivResponse.data);
		const machineLearningJson = parser.parse(machineLearningArxivResponse.data);
		const dataScienceJson = parser.parse(dataScienceArxivResponse.data);

		const responseObj = {
			psychiatry: psychiatryJson,
			therapy: therapyJson,
			machineLearning: machineLearningJson,
			dataScience: dataScienceJson,
		};

		res.send(responseObj);
	} catch (e) {
		/* This would be better off being sent to the client so that the client could display an error message informing
        the user of what went wrong and that they should try again. However, it makes my life easier in testing locally to leave it like this */
		throw e;
	}
});

module.exports = router;
