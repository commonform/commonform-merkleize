var Immutable = require('immutable')
var hash = require('commonform-hash')
var isSubForm = require('commonform-predicate').subForm

var isMap = Immutable.Map.isMap.bind(Immutable.Map)
var emptyMap = Immutable.Map()

module.exports = function merkleize(form, prior, priorResult) {
  if (
    prior !== false &&
    priorResult !== false &&
    Immutable.is(form, prior)) {
      return priorResult}

  else {
    var merkleizedContent =
      form
        .get('content')
        .map(function(element, index) {
          return isSubForm(element) ?
            // A sub-form that needs a hash
            element.update('form', function(subForm) {
              if (prior && priorResult) {
                var keyArray = ['content', '' + index, 'form']
                return merkleize(
                  subForm,
                  prior.getIn(keyArray, false),
                  priorResult.getIn(keyArray, false))}
              else {
                return merkleize(subForm, false, false)}}) :
            // Not a sub-form that needs a hash
            element})

    var normalized =
      form.set(
        'content',
        merkleizedContent
          .map(function(element) {
            return isSubForm(element) ?
              element.set('form', element.getIn(['form', 'digest'])) :
              element}))

    return emptyMap.withMutations(function(returned) {

      returned.set('digest', hash(normalized))

      var contentMap =
        merkleizedContent.reduce(
          function(reduction, element, index) {
            return isMap(element) && element.has('form') ?
              reduction.set(index, element) :
              reduction},
          emptyMap)

      if (contentMap.count() > 0) {
        returned.set('content', contentMap)}})}}

module.exports.version = '0.1.0'
