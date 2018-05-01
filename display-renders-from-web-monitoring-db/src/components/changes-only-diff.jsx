import React from 'react';
import DiffItem from './diff-item';
import List from './list';

// The context for a change should be constrained to this many lines
const maxContextLines = 3;
// If the context is only a single line, it should be constrained to this length
const maxContextLineLength = 300;

/**
 * Display a plaintext diff with additions and removals inline.
 *
 * @class ChangesOnlyDiff
 * @extends {React.Component}
 * @param {Object} props
 * @param {DiffData} props.diffData
 * @param {string} props.className
 */
export default class ChangesOnlyDiff extends React.Component {
  render () {
    const changesOnly = this.props.diffData.diff.reduce(
      getContextualDiff, []);

    return (
      <List
        data={changesOnly}
        component={DiffItem}
        className={this.props.className}
      />
    );
  }
}

/**
 * Trim parts of diff entries where there are no changes to show only a few
 * lines or characters on the ends adjacent to actual changes.
 * If `currentValue` is an insertion or deletion we return it as is.
 * If it's not, we truncate it depending on if changes occured in entries before or after it.
 * @param {Array.<[number, string]>} newDiff
 * @param {[number, string]} currentValue
 * @param {number} index
 * @param {Array.<[number, string]>} diff
 * @returns {Array.<[number, string]>}
 */
function getContextualDiff (newDiff, currentValue, index, diff) {
  let [itemType, itemText] = currentValue;
  if (itemType !== 0) return newDiff.concat([currentValue]);

  // Determine whether there is content that actually needs trimming
  let lines = itemText.split('\n');
  const singleLine = lines.length === 1;
  if (!singleLine && lines.length <= maxContextLines) {
    return newDiff.concat([currentValue]);
  }

  const hasPreviousChange = diff[index - 1] && diff[index - 1][0] !== 0;
  const hasNextChange = diff[index + 1] && diff[index + 1][0] !== 0;

  let contextLength = singleLine ? maxContextLineLength : maxContextLines;
  if (hasPreviousChange && hasNextChange) {
    contextLength *= 2;
  }
  if ((singleLine ? lines[0] : lines).length <= contextLength) {
    return newDiff.concat([currentValue]);
  }

  // ...and actually do the trimming
  let newEntries = [];
  if (hasPreviousChange) {
    const newText = [];

    if (singleLine) {
      newText.push(lines[0].slice(0, maxContextLineLength));
    }
    else {
      const newLines = lines
        .slice(0, maxContextLines)
        .map(line => {
          if (line.length > maxContextLineLength) {
            return line.slice(0, maxContextLineLength) + '…';
          }
          return line;
        });
      newText.push(newLines.join('\n') + '\n');
    }

    newEntries.push([itemType, newText.join('')]);
  }

  // Just divide with an ellipsis for now, could be fancier in the future
  newEntries.push([itemType, '…']);

  if (hasNextChange) {
    const newText = [];

    if (singleLine) {
      newText.push(lines[0].slice(-maxContextLineLength));
    }
    else {
      const newLines = lines
        .slice(0, maxContextLines)
        .map((line, index, lines) => {
          if (line.length > maxContextLineLength) {
            // If this is the last line preceding a change, trim at the start.
            if (lines[index + 1] == null) {
              return '…' + line.slice(-maxContextLineLength);
            }
            return line.slice(0, maxContextLineLength) + '…';
          }
          return line;
        });
      newText.push('\n' + newLines.join('\n'));
    }

    newEntries.push([itemType, newText.join('')]);
  }

  return newDiff.concat(newEntries);
}
