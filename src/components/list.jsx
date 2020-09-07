import PropTypes from 'prop-types';
import React from 'react';

// Basic list component taken from http://github.com/datatogether/context
// List accepts an array of data, and an item component. It iterates through the
// data array, creating an item component for each item in the array, passing
// it a prop "data" with the array element.
export default class List extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    onSelectItem: PropTypes.func,
    className: PropTypes.string
  };

  // const List = (props) => {
  render () {
    // This strange props destructuring is so props.component
    // can be referenced as a jsx component below
    const { data, onSelectItem, className } = this.props;
    const selectFunc = (fn, d, i) => {
      return () => {
        if (fn) {
          fn(i, d);
        }
      };
    };

    const children = data.map((item, i) => (
      <this.props.component
        data={item}
        key={i}
        index={i}
        onSelect={selectFunc(onSelectItem, item, i)}
      />
    ));

    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}
