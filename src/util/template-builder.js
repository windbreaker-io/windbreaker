
const templateTypeToTemplateMap = {
  pr: require('~/src/util/templates/pr-template')
}

function renderToStringAsync (template, data) {
  return new Promise((resolve, reject) => {
    template.renderToString(data, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

exports.build = async function (typeName, data) {
  let template
  if (!(template = templateTypeToTemplateMap[typeName])) {
    throw new Error(`Invalid template type: "${typeName}"`)
  }

  return renderToStringAsync(template, data)
}
