# nr1-alerts-overview

## Usage
Create a single dashboard to track the heatlh of entire business units or regions. Alert-Overview lets you monitor current status of alert based on New Relic alert status.

## Getting started

First, ensure that you have Git and NPM installed. If you're unsure whether you have one or both of them installed, run the following command(s) (If you have them installed these commands will return a version number, if not, the commands won't be recognized):

Configure webhook to send alert data to insights,For more details- https://blog.newrelic.com/product-news/sending-alerts-data-to-insights/

```
git --version
npm -v
```
Next, clone this repository and run the following scripts:

```
nr1 nerdpack:clone -r https://source.datanerd.us/dts/nr1-alerts-overview
cd nr1-alerts-overview
nr1 nerdpack:uuid -gf
```
##### Update AccountID, and alert event name in /nr1-alerts-overview/nerdlets/nr1-alert-overview-nerdlet/index.js  
```
config.set({ accountId: 1234, eventName: 'alert', days: 7 });
```

### Run below command to start the app 
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

Visit https://one.newrelic.com/ and :sparkles:
