import React from 'react';
import '../css/diff-container.css';

/**
 * Display a footer explaining the colors showing in the diffs
 */
export default function DiffFooter () {
  return (
    <p id={'diff-footer'}><yellow-diff-footer>Yellow</yellow-diff-footer> indicates
    content deletion. <blue-diff-footer>Blue</blue-diff-footer> indicates content addition.
    </p>
  );
}
