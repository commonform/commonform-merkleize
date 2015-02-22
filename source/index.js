var Immutable = require('immutable');
var hash = require('commonform-hash')
var isSubForm = require('commonform-predicate').subForm

module.exports = function merkleize(form, prior, priorResult) {
  if (
    prior !== false &&
    priorResult !== false &&
    Immutable.is(form, prior)) {
      return priorResult}

  else {
    return form.withMutations(function(mutableForm) {

      var merkleizedContent =
        form
          .get('content')
          .map(function(element, index) {
            return isSubForm(element) ?
              // A sub-form that needs a hash
              element.update('form', function(subForm) {
                if (prior && priorResult) {
                  var keyArray = ['content', index, 'form']
                  return merkleize(
                    subForm,
                    prior.getIn(keyArray, false),
                    priorResult.getIn(keyArray, false))}
                else {
                  return merkleize(subForm, false, false)
                }
              }) :
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

      mutableForm
        .set('content', merkleizedContent)
        .set('digest', hash(normalized))})}}

module.exports.version = '0.1.0';
