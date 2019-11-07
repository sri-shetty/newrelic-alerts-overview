# @REPO@

## Getting started

First, ensure that you have Git and NPM installed. If you're unsure whether you have one or both of them installed, run the following command(s) (If you have them installed these commands will return a version number, if not, the commands won't be recognized):

```
git --version
npm -v
```
Next, clone this repository and run the following scripts:

```
nr1 nerdpack:clone -r https://github.com/pavankumarck/nr1-alerts-overview.git
cd nr1-alerts-overview
nr1 nerdpack:uuid -gf
```
###Update AccountID, and new relic alert event name in  /nr1-alerts-overview/nerdlets/nr1-alert-overview-nerdlet/index.js  

```
config.set({ accountId: 1234, eventName: 'alert', days: 7 });
```

```
npm install
npm start
```

Visit https://one.newrelic.com/?nerdpacks=local and :sparkles:

## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```
# this is to create a new uuid for the nerdpack so that you can deploy it to your account
nr1 nerdpack:uuid -gf [--profile=your_profile_name]
# to see a list of APIkeys / profiles available in your development environment, run nr1 credentials:list
nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```
