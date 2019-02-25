import SMBase64 from 'smbase64';
const utils = require('../../js/utils');

let base64 = new SMBase64();
const initialSimhash = 'p52rLL+Hi2o=';
const fourDiffs = 'ox2rLL2Xi2o=';

// The Tanimoto method returns percentage of similarity (1 means they are 100% the same)
// where Simhash Distance returns number of differences (0 means they are 100% the same)

test('same simhash in Tanimoto', () => {
  expect(utils.similarityWithTanimoto(1 - base64.toNumber(initialSimhash), base64.toNumber(initialSimhash))).toBe(0);
});

test('same simhash in Simhash distance', () => {
  expect(utils.similarityWithDistance(base64.toNumber(initialSimhash), base64.toNumber(initialSimhash))).toBe(0);
});

test('4 differences in Tanimoto', () => {
  expect(utils.similarityWithTanimoto(1 - base64.toNumber(initialSimhash), base64.toNumber(fourDiffs))).toBe(0.04);
});

test('4 differences in Simhash distance', () => {
  expect(utils.similarityWithDistance(base64.toNumber(initialSimhash), base64.toNumber(fourDiffs))).toBe(0.04);
});
