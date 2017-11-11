exports.description = 'should return enabled false when a repo does not exist'

exports.buildEndpoint = function (t) {
  const { httpServerPort } = t.context
  return `:${httpServerPort}/v1/repository/github/some-random-user/some-random-repo/enabled`
}

exports.request = function (t) {
  const { request, endpoint } = t.context
  return request.get(endpoint)
}
