import scaleCluster from '../../js/scale-cluster';

describe('scaleCluster', function () {
  it('computes clusters correctly for well-separated groups', function () {
    const data = [1, 2, 10, 11, 20];
    const scale = scaleCluster().domain(data).range([1, 2, 3]);

    const clusters = scale.clusters();
    expect(clusters.length).toBe(2);
    expect(clusters).toEqual([10, 20]);

    expect(scale(1)).toBe(1);
    expect(scale(2)).toBe(1);
    expect(scale(10)).toBe(2);
    expect(scale(11)).toBe(2);
    expect(scale(20)).toBe(3);
  });

  it('handles the sunburst 5-range use case', function () {
    const data = [5, 12, 15, 30, 32, 60, 61, 80, 95];
    const scale = scaleCluster().domain(data).range([1, 2, 3, 4, 5]);
    const clusters = scale.clusters();

    expect(clusters.length).toBe(4);
    clusters.forEach(function (c) { expect(typeof c).toBe('number'); });

    for (const val of data) {
      const result = scale(val);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(5);
    }
  });

  it('returns single breakpoint-free cluster when all values identical', function () {
    const scale = scaleCluster().domain([7, 7, 7, 7]).range([1, 2, 3]);
    expect(scale.clusters()).toEqual([]);
    expect(scale(7)).toBe(1);
  });

  it('handles a single data point', function () {
    const scale = scaleCluster().domain([42]).range([1, 2, 3]);
    expect(scale.clusters()).toEqual([]);
    expect(scale(42)).toBe(1);
  });

  it('reduces cluster count when fewer unique values than range buckets', function () {
    const scale = scaleCluster().domain([1, 1, 50, 50]).range([1, 2, 3, 4, 5]);
    const clusters = scale.clusters();

    expect(clusters.length).toBe(1);
    expect(clusters).toEqual([50]);
    expect(scale(1)).toBe(1);
    expect(scale(50)).toBe(2);
  });

  it('works with unsorted input', function () {
    const scale = scaleCluster().domain([20, 1, 11, 2, 10]).range([1, 2, 3]);
    expect(scale.clusters()).toEqual([10, 20]);
    expect(scale(2)).toBe(1);
    expect(scale(11)).toBe(2);
    expect(scale(20)).toBe(3);
  });

  it('handles negative and mixed-sign values', function () {
    const data = [-50, -48, 0, 1, 100, 99];
    const scale = scaleCluster().domain(data).range([1, 2, 3]);
    const clusters = scale.clusters();

    expect(clusters.length).toBe(2);
    expect(scale(-50)).toBe(1);
    expect(scale(-48)).toBe(1);
    expect(scale(0)).toBe(2);
    expect(scale(1)).toBe(2);
    expect(scale(99)).toBe(3);
    expect(scale(100)).toBe(3);
  });

  it('handles floating-point similarity percentages', function () {
    const data = [0.5, 1.2, 1.3, 50.7, 51.1, 99.9];
    const scale = scaleCluster().domain(data).range([1, 2, 3]);
    const clusters = scale.clusters();

    expect(clusters.length).toBe(2);
    for (const val of data) {
      expect([1, 2, 3]).toContain(scale(val));
    }
  });

  it('preserves monotonicity: higher input never maps to lower range', function () {
    const data = [3, 7, 15, 22, 40, 55, 70, 88, 95];
    const scale = scaleCluster().domain(data).range([1, 2, 3, 4, 5]);
    const sorted = [...data].sort(function (a, b) { return a - b; });

    for (let i = 1; i < sorted.length; i++) {
      expect(scale(sorted[i])).toBeGreaterThanOrEqual(scale(sorted[i - 1]));
    }
  });

  it('domain and range getters return current values', function () {
    const d = [1, 2, 3];
    const r = [10, 20, 30];
    const scale = scaleCluster().domain(d).range(r);
    expect(scale.domain()).toEqual(d);
    expect(scale.range()).toEqual(r);
  });
});
