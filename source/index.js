var Immutable = require('immutable')
var hash = require('commonform-hash')
var isInclusion = require('commonform-predicate').inclusion

var isMap = Immutable.Map.isMap
var emptyMap = Immutable.Map()

module.exports = function merkleize(form, priorForm, priorResult) {
  if (
    priorForm !== false &&
    priorResult !== false &&
    Immutable.is(form, priorForm)) {
      return priorResult}

  else {
    // Compute a map of the form's content in which each sub-form's form
    // object is decorated with its digest.
    var merkleizedContent =
      form
        .get('content')
        .map(function(element, index) {
          return isInclusion(element) ?
            // A sub-form that needs a hash
            element.update('form', function(subForm) {
              if (priorForm && priorResult) {
                var keyArray = ['content', '' + index, 'form']
                return merkleize(
                  subForm,
                  priorForm.getIn(keyArray, false),
                  priorResult.getIn(keyArray, false))}
              else {
                return merkleize(subForm, false, false)}}) :
            // Not a sub-form that needs a hash
            element})

    // Starting from the Merkle-ized content array, strip away all
    // embeeded content, creating the content array of a normalized
    // form suitable for hashing.
    var normalized =
      form.set(
        'content',
        merkleizedContent
          .map(function(element) {
            return isInclusion(element) ?
              element.set('form', element.getIn(['form', 'digest'])) :
              element}))

    // Return an object containing the digest of this form, as well as a
    // map of sub-forms' hashes, if any.
    return emptyMap.withMutations(function(returned) {

      returned.set('digest', hash(normalized))

      var contentMap =
        merkleizedContent.reduce(
          function(reduction, element, index) {
            return isMap(element) && element.has('form') ?
              reduction.set(index, element) :
              reduction},
          emptyMap)

      // Add the map of sub-forms' digests only if there actually are
      // sub-forms.
      if (contentMap.count() > 0) {
        returned.set('content', contentMap)}})}}

module.exports.version = '0.2.0'
