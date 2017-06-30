// Heavily inspired by https://github.com/greenkeeperio/greenkeeper/blob/8be4bfc45dc991ec0c3331ac15b688728f5938a5/test/lib/diff-package-json.js

require('require-self-ref')
const test = require('ava')

const diff = require('~/src/diffs/package-json')

test('no change', function (t) {
  const oldPkg = {
    name: 'before',
    dependencies: {
      lodash: '^1.0.0'
    }
  }
  const newPkg = {
    name: 'after',
    dependencies: {
      lodash: '^1.0.0'
    }
  }
  t.deepEqual(diff(oldPkg, newPkg), {})
})

test('update dependency', function (t) {
  const oldPkg = {
    dependencies: {
      lodash: '^1.0.0'
    }
  }
  const newPkg = {
    dependencies: {
      lodash: '^2.0.0'
    }
  }
  t.deepEqual(diff(oldPkg, newPkg), {
    dependencies: {
      lodash: {
        change: 'modified',
        before: '^1.0.0',
        after: '^2.0.0'
      }
    }
  })
})

test('add dependency', function (t) {
  const oldPkg = {
    dependencies: {
      lodash: '^1.0.0'
    }
  }
  const newPkg = {
    dependencies: {
      lodash: '^1.0.0',
      async: '^1.0.0'
    }
  }
  t.deepEqual(diff(oldPkg, newPkg), {
    dependencies: {
      async: {
        change: 'added',
        before: undefined,
        after: '^1.0.0'
      }
    }
  })
})

test('remove dependency', function (t) {
  const oldPkg = {
    dependencies: {
      lodash: '^1.0.0',
      async: '^1.0.0'
    }
  }
  const newPkg = {
    dependencies: {
      lodash: '^1.0.0'
    }
  }
  t.deepEqual(diff(oldPkg, newPkg), {
    dependencies: {
      async: {
        change: 'removed',
        before: '^1.0.0',
        after: undefined
      }
    }
  })
})

test('mixed add, remove, modify multiple dependency types', function (t) {
  const oldPkg = {
    dependencies: {
      lodash: '^1.0.0',
      async: '^2.0.0'
    },
    devDependencies: {
      argly: '^1.0.0'
    },
    optionalDependencies: {
      sinon: '^1.0.0'
    }
  }
  const newPkg = {
    dependencies: {
      lodash: '^2.0.0'
    },
    devDependencies: {
      argly: '^1.0.0',
      async: '^3.0.0'
    },
    optionalDependencies: {
      sinon: '^1.0.0'
    },
    peerDependencies: {
      bluebird: '^1.0.0',
      eslint: '^1.0.0'
    }
  }

  t.deepEqual(diff(oldPkg, newPkg), {
    dependencies: {
      lodash: {
        change: 'modified',
        before: '^1.0.0',
        after: '^2.0.0'
      },
      async: {
        change: 'removed',
        before: '^2.0.0',
        after: undefined
      }
    },
    devDependencies: {
      async: {
        change: 'added',
        before: undefined,
        after: '^3.0.0'
      }
    },
    peerDependencies: {
      bluebird: {
        change: 'added',
        before: undefined,
        after: '^1.0.0'
      },
      eslint: {
        change: 'added',
        before: undefined,
        after: '^1.0.0'
      }
    }
  })
})
