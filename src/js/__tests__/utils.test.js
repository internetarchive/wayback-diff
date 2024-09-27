import { twoDigits } from '../utils.js';

test('twoDigits', function () {
  expect(twoDigits(5) === '05');
  expect(twoDigits('5') === '05');
  expect(twoDigits('11') === '11');
});
