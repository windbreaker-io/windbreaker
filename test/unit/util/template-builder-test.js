require('marko/node-require')

const test = require('ava')
const templateBuilder = require('~/src/util/template-builder')

test('should allow building templates', async (t) => {
  const built = await templateBuilder.build('pr', {
    package: {
      name: 'koa',
      version: '1.0.0'
    }
  })

  t.is(built.includes('koa'), true)
  t.is(built.includes('1.0.0'), true)
})

test('should throw error when building and invalid template name', async (t) => {
  const error = await t.throws(templateBuilder.build('INVALID_TEMPLATE_NAME'))
  t.is(error.message, 'Invalid template type: "INVALID_TEMPLATE_NAME"')
})
