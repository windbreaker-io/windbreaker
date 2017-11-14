exports.description = 'should handle valid github repo enabled payload'

exports.request = function (t) {
  const { request, endpoint } = t.context
  return request.get(endpoint)
}
