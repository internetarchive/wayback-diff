import PropTypes from 'prop-types';
import React from 'react';

/**
 * Display a single deleted/added/unchanged element within a diff
 *
 * @class DiffItem
 * @extends {React.Component}
 */
export default class DiffItem extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    onSelect: PropTypes.func
  };

  render () {
    const { data, onSelect } = this.props;

    // here we do inline style-editing and class switching.
    // in the real world it's probably a good idea to associate
    // styles with the class and remove the "styles" object entirely.
    const styles = {};
    let diffTypeClass = 'unchanged';
    const [itemType, itemText] = data;

    // this data comes from https://github.com/edgi-govdata-archiving/go-calc-diff
    // it may be necessary to adjust the "data.Type" inspections based on differ
    if (itemType === -1) {
      diffTypeClass = 'removed';
      styles.background = '#ffc0cb';
    } else if (itemType === 1) {
      diffTypeClass = 'added';
      styles.background = '#90ee90';
    }

    return (
      <span
        className={`diff item ${diffTypeClass}`}
        style={styles}
        onClick={onSelect}
      >
        {itemText}
      </span>
    );
  }
}
