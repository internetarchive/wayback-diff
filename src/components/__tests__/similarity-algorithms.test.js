import SMBase64 from 'smbase64';
import { similarityWithTanimoto, similarityWithDistance, b64ToArray } from '../../js/utils';

// The Tanimoto method returns percentage of similarity (1 means they are 100% the same)
// where Simhash Distance returns number of differences (0 means they are 100% the same)

// 1 byte simhashes
const base64 = new SMBase64();
const initialSimhash = 'AA==';
const oneDiff = 'AQ==';
const fourDiffs = 'Dw==';

test('same simhash Distance', function () {
  expect(similarityWithDistance(oneDiff, oneDiff)).toBe(0);
});

test('same simhash Tanimoto', function () {
  expect(1 - similarityWithTanimoto(base64.toNumber(oneDiff.replace(/=/, '')), base64.toNumber(oneDiff.replace(/=/, '')))).toBe(0);
});

test('1 difference Distance', function () {
  expect(similarityWithDistance(initialSimhash, oneDiff)).toBe(1 / 8);
});

test('1 difference Tanimoto', function () {
  expect(1 - similarityWithTanimoto(base64.toNumber(initialSimhash.replace(/=/, '')), base64.toNumber(oneDiff.replace(/=/, '')))).not.toBe(1 / 8);
});

test('4 differences Distance', function () {
  expect(similarityWithDistance(initialSimhash, fourDiffs)).toBe(4 / 8);
});

test('4 differences Tanimoto', function () {
  expect(1 - similarityWithTanimoto(base64.toNumber(initialSimhash.replace(/=/, '')), base64.toNumber(fourDiffs.replace(/=/, '')))).not.toBe(4 / 8);
});

// 8 byte simhashes
const initial8ByteSimhash = 'AAAAAAAAAAA=';
const one8ByteDiff = 'AAAAAAAAAAE=';
const four8ByteDiffs = 'AAAAAAAAAA8=';

test('8Byte same simhash Distance', function () {
  expect(similarityWithDistance(one8ByteDiff, one8ByteDiff)).toBe(0);
});

test('8Byte same simhash Tanimoto', function () {
  expect(1 - similarityWithTanimoto(b64ToArray(one8ByteDiff.replace(/=/, '')), b64ToArray(one8ByteDiff.replace(/=/, '')))).toBe(0);
});

test('8Byte 1 difference Distance', function () {
  expect(similarityWithDistance(initialSimhash, one8ByteDiff)).toBe(1 / 64);
});

test('8Byte 1 difference Tanimoto', function () {
  expect(1 - similarityWithTanimoto(b64ToArray(initial8ByteSimhash.replace(/=/, '')), b64ToArray(one8ByteDiff.replace(/=/, '')))).not.toBe(1 / 64);
});

test('8Byte 4 differences Distance', function () {
  expect(similarityWithDistance(initialSimhash, four8ByteDiffs)).toBe(4 / 64);
});

test('8Byte 4 differences Tanimoto', function () {
  expect(1 - similarityWithTanimoto(b64ToArray(initial8ByteSimhash.replace(/=/, '')), b64ToArray(four8ByteDiffs.replace(/=/, '')))).not.toBe(4 / 64);
});
