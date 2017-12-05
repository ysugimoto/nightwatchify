# nightwatchify

`nightwatchify` makes your ES6 code executable on [nightwatch.js](http://nightwatchjs.org/).

## Usage

### nightwatchify(testcases)

Wrap nightwatch's testcases to ES5 testcase object

```js
const nightwatchify = require('nightwatchify');

module.exports = nightwatchify({

  '@tags': ['example'],

  "Google"(client) {
    client
      .url('https://google.com')
      .waitForElementVisible('body', 1000);
  },

  afterEach(client, done) {
    // do something
  }
});
```

### nightwatchify.Command

Wrap nightwatch's [Custom Commands](http://nightwatchjs.org/guide#writing-custom-commands) to executable by ES6 class.

This is example for Saucelabs update job:

```js
const nightwatchify = require('nightwatchify');
const Saucelabs = require('saucelabs');

// Define as ES6 class
class SaucelabsReporter {
  constructor() {
  }

  command(callback) {
    this.api.session(session => {
      const s = new Saucelabs({
        "username": "${SAUCE_USERNAME}",
        "password": "${SAUCE_ACCESS_KEY}"
      });
      const test = this.api.currentTest;
      s.updateJob(session.sessionId, {
        passed: test.failed === 0,
        name: `${test.name}: ${test.module}`
      }, () => {
        this.emit('complete');
        if (callback) {
          callback.call(this.client.api);
        }
      });
    });

    return this;
  }
}

module.exports = nightwatchify.Command(SaucelabsReporter);
```

The wrapped class extends `EventEmitter` automatically, so you can use `this.emit('complete')` without any extends.

__Note__: context of `command()` method is wrapped class, not `SaucelabsReporter`. If you want to access `SaucelabsReporter` instance itself, you can access it via `this.cmd` property.

### nightwatchify.Bdd()

Wrap BDD global functions to ES5

```js
const nightwatchify = require('nightwatchify');
nightwatchify.Bdd();

describe('Google', () => {
  it('Index', client => {
    client
      .url('https://google.com')
      .waitForElementVisible('body', 1000);
  });

  afterEach((client, done) => {
    // do something
  });
});
```

## Author

Yoshiaki Sugimoto

## License

MIT

