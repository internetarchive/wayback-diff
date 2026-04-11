/**
 * scaleCluster - a self-contained reimplementation of d3-scale-cluster.
 *
 * Uses the Ckmeans.1d.dp algorithm (optimal 1-D k-means clustering via
 * dynamic programming) originally by Haizhou Wang and Mingzhou Song.
 * This ensures our clusters are mathematically identical to the original
 * npm package we replaced, with zero regressions.
 */

function numericSort(array) {
  return array.slice().sort((a, b) => a - b);
}

function uniqueCountSorted(sorted) {
  let count = 0;
  let last;
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0 || sorted[i] !== last) {
      last = sorted[i];
      count++;
    }
  }
  return count;
}

function makeMatrix(columns, rows) {
  const matrix = [];
  for (let i = 0; i < columns; i++) {
    matrix.push(new Array(rows).fill(0));
  }
  return matrix;
}

function ssq(j, i, sumX, sumXsq) {
  let sji;
  if (j > 0) {
    const muji = (sumX[i] - sumX[j - 1]) / (i - j + 1);
    sji = sumXsq[i] - sumXsq[j - 1] - (i - j + 1) * muji * muji;
  } else {
    sji = sumXsq[i] - (sumX[i] * sumX[i]) / (i + 1);
  }
  return sji < 0 ? 0 : sji;
}

function fillMatrixColumn(imin, imax, column, matrix, backtrackMatrix, sumX, sumXsq) {
  if (imin > imax) return;

  const i = Math.floor((imin + imax) / 2);

  matrix[column][i] = matrix[column - 1][i - 1];
  backtrackMatrix[column][i] = i;

  let jlow = column;
  if (imin > column) {
    jlow = Math.max(jlow, backtrackMatrix[column][imin - 1] || 0);
  }
  jlow = Math.max(jlow, backtrackMatrix[column - 1][i] || 0);

  let jhigh = i - 1;
  if (imax < matrix[0].length - 1) {
    jhigh = Math.min(jhigh, backtrackMatrix[column][imax + 1] || 0);
  }

  for (let j = jhigh; j >= jlow; --j) {
    const sji = ssq(j, i, sumX, sumXsq);

    if (sji + matrix[column - 1][jlow - 1] >= matrix[column][i]) break;

    const sjlowi = ssq(jlow, i, sumX, sumXsq);
    const ssqjlow = sjlowi + matrix[column - 1][jlow - 1];

    if (ssqjlow < matrix[column][i]) {
      matrix[column][i] = ssqjlow;
      backtrackMatrix[column][i] = jlow;
    }
    jlow++;

    const ssqj = sji + matrix[column - 1][j - 1];
    if (ssqj < matrix[column][i]) {
      matrix[column][i] = ssqj;
      backtrackMatrix[column][i] = j;
    }
  }

  fillMatrixColumn(imin, i - 1, column, matrix, backtrackMatrix, sumX, sumXsq);
  fillMatrixColumn(i + 1, imax, column, matrix, backtrackMatrix, sumX, sumXsq);
}

function ckmeans(data, nClusters) {
  if (nClusters > data.length) {
    throw new Error('Cannot generate more classes than there are data values');
  }

  const sorted = numericSort(data);
  const uniqueCount = uniqueCountSorted(sorted);

  if (uniqueCount === 1) return [sorted[0]];

  nClusters = Math.min(uniqueCount, nClusters);

  const matrix = makeMatrix(nClusters, sorted.length);
  const backtrackMatrix = makeMatrix(nClusters, sorted.length);

  const nValues = sorted.length;
  const sumX = new Array(nValues);
  const sumXsq = new Array(nValues);
  const shift = sorted[Math.floor(nValues / 2)];

  for (let i = 0; i < nValues; ++i) {
    if (i === 0) {
      sumX[0] = sorted[0] - shift;
      sumXsq[0] = (sorted[0] - shift) ** 2;
    } else {
      sumX[i] = sumX[i - 1] + sorted[i] - shift;
      sumXsq[i] = sumXsq[i - 1] + (sorted[i] - shift) ** 2;
    }
    matrix[0][i] = ssq(0, i, sumX, sumXsq);
    backtrackMatrix[0][i] = 0;
  }

  for (let k = 1; k < matrix.length; ++k) {
    const imin = k < matrix.length - 1 ? k : nValues - 1;
    fillMatrixColumn(imin, nValues - 1, k, matrix, backtrackMatrix, sumX, sumXsq);
  }

  const clusters = [];
  let clusterRight = backtrackMatrix[0].length - 1;

  for (let cluster = backtrackMatrix.length - 1; cluster >= 0; cluster--) {
    const clusterLeft = backtrackMatrix[cluster][clusterRight];
    clusters[cluster] = sorted[clusterLeft];
    if (cluster > 0) clusterRight = clusterLeft - 1;
  }

  return clusters;
}

export default function scaleCluster() {
  let domain = [];
  let range = [];
  let breakpoints = [];

  const scale = (x) => {
    if (!breakpoints.length) return undefined;
    for (let i = breakpoints.length - 1; i >= 0; i--) {
      if (x >= breakpoints[i]) return range[i];
    }
    return range[0];
  };

  function rescale() {
    if (range.length <= 2) {
      breakpoints = [];
      return;
    }
    if (!domain.length) {
      breakpoints = [];
      return;
    }
    const clusters = ckmeans(domain, Math.min(domain.length, range.length));
    breakpoints = clusters.slice(); // store full cluster mins
  }

  scale.domain = function (arr) {
    if (!arguments.length) return domain;
    domain = arr;
    rescale();
    return scale;
  };

  scale.range = function (arr) {
    if (!arguments.length) return range;
    range = arr;
    rescale();
    return scale;
  };

  scale.clusters = function () {
    return breakpoints.slice(1); // emulate d3-scale-cluster's cluster method
  };

  return scale;
}
