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
        content: {
          0: {
            form: {
              digest:
                'eb94d16f10023fe29cb75d02a60eb531' +
                'ffedcc7bdf7cc9aba8c25c962116b1f9'}},
          1: {
            form: {
              digest:
                '5e5d60591967ee74ef2d324abc4b4485'+
                '78a186f26647f2aaa7249298696e6f22'}}},
        digest:
          '84fd358ac5b0109eaca10d1224e1c52a' +
          'a1d2de4f0b6a741303c05b318c55b326'})})

  it('accepts an a prior input-output pair to start from', function() {
    expect(
      merkleize(
        // Updated form with one different sub-form
        Immutable.fromJS({
          content: [
            {form: {content: ['A']}},
            {form: {content: ['B']}}]}),
        // Prior form with the same sub-form twice
        Immutable.fromJS({
          content: [
            {form: {content: ['A']}},
            {form: {content: ['A']}}]}),
        // merkleize() result for a different form, with the same
        // sub-form appearing twice
        Immutable.fromJS({
          // This parent digest should not be reused, since a sub-form
          // has changed.
          digest:
            '9b95d3e47c2233b2c7c4fce356ff01ab' +
            'f1eb85cc1fffc2710f52ea26dbfcd20b',
          content: {
            0: {
              form: {
                // This digest should be reused, since the same sub-form
                // appears in the same position within its parent's
                // content list.
                digest:
                  // The actual digest for this form would be:
                  //
                  // 'eb94d16f10023fe29cb75d02a60eb531' +
                  // 'ffedcc7bdf7cc9aba8c25c962116b1f9',
                  //
                  // Here, we use a dummy value, so we check to make
                  // sure can sure the algorithm reuses the value we
                  // provide.
                  'previously computed digest'}},
            1: {
              form: {
                // This digest should not be reused.
                digest:
                  'eb94d16f10023fe29cb75d02a60eb531' +
                  'ffedcc7bdf7cc9aba8c25c962116b1f9'}}}})).toJS())
      .to.eql({
        content: {
          0: {
            form: {
              digest: 'previously computed digest'}},
          1: {
            form: {
              digest:
                '5e5d60591967ee74ef2d324abc4b4485'+
                '78a186f26647f2aaa7249298696e6f22'}}},
        digest:
          // The actual digest would be:
          //
          // '84fd358ac5b0109eaca10d1224e1c52a' +
          // 'a1d2de4f0b6a741303c05b318c55b326'
          //
          // Since we're using a fake digest to ensure its value is
          // reused, the digest we expect is different:
          '66ece68994b874e627c34bd33333d00cf' +
          '6ea4a651ab2a4fe471fca2ed84bdc27'})})})
