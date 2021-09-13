# The Back End of the App

## Running Locally

- This app will run locally on port 3001. Just run `npm i` and then `npm run start` to get it going

## The Secret Config File

- You'll note that the `config.json` is gitignored. There's nothing secret in there, but in case we were storing any sensitive information I wouldn't want it to be accessible to anyone who stumbled across this repo. We could store a source of truth copy of this file someplace secure and only accessible to fellow employees, such as an s3 bucket that is locked down to specific iam users under the company's AWS account. Or really anywhere other than directly in the git repo. Just to help you run this app locally I will write out the contents of `config.json` here:

`{ "arxivDomain": "https://export.arxiv.org/api/query", "arxivRequestConfig": { "headers": { "Content-Type": "application/atom+xml" } } } `

## Testing

- There is no testing. This is what I would want to test in an api. fill this out later

## Improvements worth making

### Timeouts on our api calls

- Arxiv asks that you wait at least 3 seconds between api calls if your app needs to make sequential ones. I did not want to go down that rabbit hole and lose the chance to flesh out an MVP. However, this is a limitation we would have to work around if we were going to make a production worthy app that many people would use. Perhaps we could just make a separate endpoint for each arxiv request, rather than bundle related arxiv requests together as I have done here. Then we could enforce timers on the front end. I know that express also allows you to set a timer on all endpoints in the app.js file. That's an option as well. Either way, I don't like this restriction and I think we would probably need to bump up to whatever the commercial version of their api is to avoid it.

### Allowing users to input the authors they are interested in ranking

- I think users should be allowed to choose the authors whose publishing stats they are interested in comparing and contrasting. To me it makes the most sense since we can't just query arxiv itself for a list of prolific authors. Presumably our users are academics themselves. They probably have specific colleagues in mind that they want to size up. But for the purposes of this MVP, I hardcoded 10 random author names.

### Using a more fleshed out framework rather than barebones express

- I ended up using express-generator to make a bare bones app to save time. I took a look at the Sails documentation and it seems pretty cool. I just wanted to avoid the overhead of learning a new framework so I could focus on the MVP. However, in a real production setting I think the feature set offered by the framework and the level of support/adoption in the community is a better guide to choosing rather than pure expedience.

### Error handling

- Right now errors are not being sent to the client and the client is not doing anything to alert users of what went wrong and how to rectify the situation. This is obviously quite bad. Users need to know. Further, we could set up logging with alerts to let us know via pager duty or what-have-you when we've made a bad prod release and broken an endpoint (or more).
