# SmartWeave transaction tags encoding

Testing `SmartWeave.transaction.tags` encoding within the contract\
Motivation: sometimes the result comes in base64 and sometimes it's already decoded, which may give a non deterministic contract outcome

## Install dependencies

```
yarn install
```

## Run test

```
npm test -- tags.test.js
```

## Result logs
```
[
  Tag { name: 'QXBwLU5hbWU', value: 'U21hcnRXZWF2ZUFjdGlvbg' },
  Tag { name: 'QXBwLVZlcnNpb24', value: 'MC4zLjA' },
  Tag {
    name: 'Q29udHJhY3Q',
    value: 'b09WcGJwbG0tU3otZXRtcFVQZTlEUGs4cFR0clJGRDJiSXJiWHFBR2plbw'
  },
  Tag { name: 'SW5wdXQ', value: 'eyJmdW5jdGlvbiI6InJlZ2lzdGVyIn0' }
]

[
  { name: 'App-Name', value: 'SmartWeaveAction' },
  { name: 'App-Version', value: '0.3.0' },
  {
    name: 'Contract',
    value: 'oOVpbplm-Sz-etmpUPe9DPk8pTtrRFD2bIrbXqAGjeo'
  },
  { name: 'Input', value: '{"function":"register"}' }
]
```