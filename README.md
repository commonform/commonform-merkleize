```javascript
var merkleize = require('commonform-merkleize')
var assert = require('assert')

assert.deepEqual(
  merkleize({content: ['This is a test']}),
  {
    digest:
    'a4b1cdbb7425a4a195f3dfe748fe7ae7' +
    'da59d6ddb83ae7a46ffde9d8a7e86450'
  }
)

assert.deepEqual(
  merkleize({content: [{form: {content: ['This is a test']}}]}),
  {
    digest:
      '7783a0c438b8ad057806890d040d06b8' +
      '69bdcd04bef4ea01cd2e35257631b823',
    content: {
      0: {
        digest:
          'a4b1cdbb7425a4a195f3dfe748fe7ae7' +
          'da59d6ddb83ae7a46ffde9d8a7e86450'
      }
    }
  }
)
```
