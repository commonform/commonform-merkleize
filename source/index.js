var hash = require('commonform-hash')
var isSubForm = require('commonform-predicate').subForm

module.exports = function merkleize(form) {
  return form.withMutations(function(mutableForm) {

    var merkleizedContent =
      form
        .get('content')
        .map(function(element) {
          return isSubForm(element) ?
            element.update('form', merkleize) :
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
      .set('digest', hash(normalized))})}

module.exports.version = '0.1.0';
