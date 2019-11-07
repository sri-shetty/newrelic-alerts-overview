# @REPO@

## Getting started

Update 
Run the following scripts:

```
nr1 nerdpack:clone -r https://github.com/newrelic/nr1-status-pages.git
cd nr1-status-pages
nr1 nerdpack:uuid -gf
npm install
npm start
```

Visit https://one.newrelic.com/?nerdpacks=local and :sparkles:

## Creating new artifacts

If you want to create new artifacts run the following command:

```
nr1 create
```

> Example: `nr1 create --type nerdlet --name my-nerdlet`.
