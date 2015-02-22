/* jshint mocha: true */
var Immutable = require('immutable');
var expect = require('chai').expect;
var merkleize = require('..');

describe('merkleize', function() {

  it('is a function', function() {
    expect(
      merkleize)
      .to.be.a('function')})

  it('decorates a form with its digest', function() {
    expect(
      merkleize(Immutable.fromJS({content: ['A']})).toJS())
      .to.eql({
        content: ['A'],
        digest:
          'eb94d16f10023fe29cb75d02a60eb531' +
          'ffedcc7bdf7cc9aba8c25c962116b1f9'})})

  it('decorates sub-forms with their digests', function() {
    expect(
      merkleize(
        Immutable.fromJS({
          content: [
            {form: {content: ['A']}},
            {form: {content: ['B']}}]})).toJS())
      .to.eql({
        content: [
          {
            form: {
              content: ['A'],
              digest:
                'eb94d16f10023fe29cb75d02a60eb531' +
                'ffedcc7bdf7cc9aba8c25c962116b1f9'}},
          {
            form: {
              content: ['B'],
              digest:
                '5e5d60591967ee74ef2d324abc4b4485'+
                '78a186f26647f2aaa7249298696e6f22'}}],
        digest:
          '84fd358ac5b0109eaca10d1224e1c52a' +
          'a1d2de4f0b6a741303c05b318c55b326'})})})
