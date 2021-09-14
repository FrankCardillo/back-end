# The Back End of the App

## Running Locally

- This app will run locally on port 3001. Just run `npm i` and then `npm run start` to get it going

## The Secret Config File

- You'll note that the `config.json` is gitignored. There's nothing secret in there, but in case we were storing any sensitive information I wouldn't want it to be accessible to anyone who stumbled across this repo. We could store a source of truth copy of this file someplace secure and only accessible to fellow employees, such as an s3 bucket that is locked down to specific iam users under the company's AWS account. Or really anywhere other than directly in the git repo. Just to help you run this app locally I will write out the contents of `config.json` here:

`{ "arxivDomain": "https://export.arxiv.org/api/query", "arxivRequestConfig": { "headers": { "Content-Type": "application/atom+xml" } } } `

## Testing

- There is no testing as you can see. While TDD is important, in this case I prioritized delivering an MVP within a time box. For the back end I'd love to help grow a test suite that checks atomic behaviors of the various helper functions in the routes. Validating our confidence in our answers to questions like, "does this function perform the action I expect in a consistent and predictable manner" and "are my use cases for the component covered (including edge cases)?" I would also like to bring it all together and test the actual endpoint handlers that ultimately return the data to the client. In this case, I think it would be prudent to stub out arxiv API responses (including errors) rather than call their API directly in my unit tests.

## Improvements worth making

### Timeouts on our api calls

- Arxiv asks that you wait at least 3 seconds between api calls if your app needs to make sequential ones. I did not want to go down that rabbit hole and lose the chance to flesh out an MVP. However, this is a limitation we would have to work around if we were going to make a production worthy app that many people would use. Perhaps we could just make a separate endpoint for each arxiv request, rather than bundle related arxiv requests together as I have done here. Then we could enforce timers on the front end. I know that express also allows you to set a timer on all endpoints in the app.js file. That's an option as well. Either way, I don't like this restriction and I think we would probably need to bump up to whatever the commercial version of their api is to avoid it.

### Allowing users to input the authors they are interested in ranking

- I think users should be allowed to choose the authors whose publishing stats they are interested in comparing and contrasting. To me it makes the most sense since we can't just query arxiv itself for a list of prolific authors. Presumably our users are academics themselves. They probably have specific colleagues in mind that they want to size up. But for the purposes of this MVP, I hardcoded 10 random author names.

### Using a more fleshed out framework rather than barebones express

- I ended up using express-generator to make a bare bones app to save time. I took a look at the Sails documentation and it seems pretty cool. I just wanted to avoid the overhead of learning a new framework so I could focus on the MVP. However, in a real production setting I think the feature set offered by the framework and the level of support/adoption in the community is a better guide to choosing rather than pure expedience.

### Error handling

- Right now errors are not being sent to the client and the client is not doing anything to alert users of what went wrong and how to rectify the situation. This is obviously quite bad. Users need to know. Further, we could set up logging with alerts to let us know via pager duty or what-have-you when we've made a bad prod release and broken an endpoint (or more).

### HTTPS

- A requisite for any web app in today's world. We definitely need to implement this if we want to be production ready. Goes for the app too, but I'll just note it here.

### Typescript

- I went the easy way and just used js. But I do prefer Typescript and would make the switch (with all the attendant interface defining) in a larger scale project.

### CI/CD

- I don't know to what extent it's even appropriate to talk about devops here, but if this were a production app we'd need a reliable way to deploy it so our users could access it. Maybe a Jenkins build process. Maybe Codeship. In any case, that's a whole other initiative and I didn't think it was within the scope of this project to start building that. I did want to make note of it though.
