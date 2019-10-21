## Description

Log subscriber.
Logs are tagged with "<application>.<severity>" format by publisher.
Each subscriber can listen for one or more tag(s).
Applications:
  - gateway
  -

Severities:
  - fatal
  - error
  - warning
  - info
  - debug
  - trace

Wildcard chars can be used while specifiying tag to listen. Wild chars:
  * (star) can substitute for exactly one word.
  # (hash) can substitute for zero or more words.

So if you run script with "gateway.error" script wil listen for only gateway error logs.
But if you run with "gateway.*", it will listen for all gateway logs.
Or with "*.trace" listen for all tracing logs.
Calling script with "#" makes it listen for every published log.

Tags can be added to the end of script like: npm run start "*.fatal" "*.error"
or they can be specified by env variables: LISTEN="gateway.warning gateway.info" npm run start

## Installation

.env file must be added before starting.

* for dev env:
```bash
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

* for prod env:
```bash
$ docker-compose up --build
```
