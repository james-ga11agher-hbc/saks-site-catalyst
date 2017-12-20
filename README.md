# Saks Site Catalyst Library
---

This repository contains code for Saks' Site Catalyst implementation.

### Testing

```
npm run test
```

### Building

```
webpack
```

## Releasing

```
npm run release
```
_Note: This command will only release patch versions. Major and Minor versions
must be built manually._

### Deployment

**WARNING! READ ME FIRST!** This process bypasses our normal procedures. Whatever changes you put into STQA or production will go into effect **immediately.** ...So be careful :).

This library is deployed to production and STQA environments via Signal, so access to the [signal hub](https://hub.signal.co/) is required. Signal fetches the code from [rawgit](https://rawgit.com) and injects it onto the page.  

To deploy, take the following steps:

**STQA**
* Create a new build file on your branch.
* Go to [rawgit](https://rawgit.com) and paste in the URL to the build file. Rawgit will generate two URLS, one for production and one for development. Use the development one.
* Log into [signal hub](https://hub.signal.co/) and in the left navbar, select "Tags". Select "Adobe Analytics (SiteCatalyst): QA", then select the "Web Settings" tab and then "QA: Saks Site Catalyst CDN."
* Under the 'Library Hosting' section make sure external is selected and paste in the rawgit URL you generated in step 2.

**Production**
* Create a new release.
* Paste the path to the release build file into rawgit. Select the production URL.
* Follow step 3 from above, except select Site Catalyst CDN under web settings.
* Follow step 4 from above.


## Contributing

To contribute to this repo, please clone the repo and file a pull request.
