# The Back End of the App

## Running Locally

This app will run locally on port 3001. Just run `npm i` and then `npm run start` to get it going

## The Secret Config File

You'll note that the `config.json` is gitignored. There's nothing secret in there, but in case we were storing any sensitive information I wouldn't want it to be accessible to anyone who stumbled across this repo. We could store a source of truth copy of this file someplace secure and only accessible to fellow employees, such as an s3 bucket that is locked down to specific iam users under the company's AWS account. Or really anywhere other than directly in the git repo. Just to help you run this app locally I will write out the contents of `config.json` here:

`{ "arxivDomain": "https://export.arxiv.org/api/query", "arxivRequestConfig": { "headers": { "Content-Type": "application/atom+xml" } } } `

## Testing

There is no testing. This is what I would want to test in an api. fill this out later

## Improvements worth making

### Timeouts on our api calls

- Arxiv asks that you wait at least 3 seconds between api calls if your app needs to make sequential ones. I did not want to go down that rabbit hole and lose the chance to flesh out an MVP. However, this is a limitation we would have to work around if we were going to make a production worthy app that many people would use. Perhaps we could just make a separate endpoint for each arxiv request, rather than bundle related arxiv requests together as I have done here. Then we could enforce timers on the front end. I know that express also allows you to set a timer on all endpoints in the app.js file. That's an option as well. Either way, I don't like this restriction and I think we would probably need to bump up to whatever the commercial version of their api is to avoid it.

### Example 2

Example 2 text
