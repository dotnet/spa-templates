This repo is home for the SPA (Single Page Application) project templates which ship as part of the ASP.NET Core.
At the moment, those are `Angular` and `React` templates.

Besides these two templates, we also want this repo to serve as a knowledge-base for all community-owned SPA project templates out there.
We expect to maintain that list in the `spaProjectTempltes.md` file. If you know of any such project templates, which are popular, send us a PR with added information in that file, and we'll include it, it it meets the popularity bar.

We try to keep the list of community owned SPA project templates up to date as well as want to make sure it is a good quality list for everyone to refer to.
To keep the quality high, we have some requirements each proposed project template should comply to:
- The project templates hould be available as a NuGet package
- The number of downloads for the package should be above 5000
- There should be at least three blog posts / articles referring to those packages

We believe that these requirements will enable us to have a high quality list that the community will value and praise.

## How to propose a new SPA project template reference

We've created a new PR template, to help with new project template proposals.
The format of each project template in the file should follow existing pattern, which goes as follows:

```
- [Template Name](Link to NuGet.org package): Description
```

When you're ready to propose your changes prepared in your fork, use the following PR template when submitting a new PR. To do so, append the additional `?template=template.md` parameter to the PR creation page link, and you'll get all the info we need to fill in for the PR.