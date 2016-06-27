var normalize = require('commonform-normalize')

function isChild (object) {
  return typeof object === 'object' && 'digest' in object
}

function recurse (normalized, digest) {
  var form = normalized[digest]
  if (form.content.some(isChild)) {
    return {
      digest: digest,
      content: form.content.reduce(function (content, element, index) {
        if (isChild(element)) content[index] = recurse(normalized, element.digest)
        return content
      }, {})
    }
  } else return {digest: digest}
}

function merkleize (form) {
  var normalized = normalize(form)
  return recurse(normalized, normalized.root)
}

module.exports = merkleize
