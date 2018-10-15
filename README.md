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

This library is deployed to production and STQA environments via Signal, so access to the [signal hub](https://hub.signal.co/) is required. Signal fetches the code from [jsdelivr](https://www.jsdelivr.com/?docs=gh) and injects it onto the page.

To deploy, take the following steps:

**STQA**
* Create a new build file on your branch. Make your changes. Then `npm run release` and push your changes. Take note of the new version number.
* Log into [signal hub](https://hub.signal.co/) and in the left navbar, select "Tags". Select "Adobe Analytics (SiteCatalyst): QA", then select the "Web Settings" tab and then "QA: Saks Site Catalyst CDN."
* Under the 'Library Hosting' section make sure external is selected and update the URL with your new version number. For example: `https://cdn.jsdelivr.net/gh/saksdirect/saks-site-catalyst@0.1.23/dist/site-catalyst.js`.

**Production**
* Follow step 3 from above, except select Site Catalyst CDN under web settings.
* Follow step 4 from above, replacing `.js` with `.min.js`. For example: `https://cdn.jsdelivr.net/gh/saksdirect/saks-site-catalyst@0.1.23/dist/site-catalyst.min.js`.


## Contributing

To contribute to this repo, please clone the repo and file a pull request.
