import {
  mediaTypeForExtension,
  parseMediaType,
  unknownType
} from '../media-type';

export const diffTypes = {
  RAW_FROM_CONTENT: {
    description: '“From” Version'
  },
  RAW_TO_CONTENT: {
    description: '“To” Version'
  },
  RAW_SIDE_BY_SIDE: {
    description: 'Side-by-side Content'
  },
  HIGHLIGHTED_TEXT: {
    description: 'Highlighted Text',
    diffService: 'html_text_dmp'
  },
  HIGHLIGHTED_SOURCE: {
    description: 'Highlighted Source',
    diffService: 'html_source_dmp'
  },
  HIGHLIGHTED_RENDERED: {
    description: 'Highlighted Rendered',
    diffService: 'html_token'
  },
  SIDE_BY_SIDE_RENDERED: {
    description: 'Side-by-Side Rendered',
    diffService: 'html_token',
    options: { include: 'all' }
  },
  OUTGOING_LINKS: {
    description: 'Outgoing Links',
    diffService: 'links'
  },
  CHANGES_ONLY_TEXT: {
    description: 'Changes Only Text',
    diffService: 'html_text_dmp'
  },
  CHANGES_ONLY_SOURCE: {
    description: 'Changes Only Source',
    diffService: 'html_source_dmp'
  }
};

for (const key in diffTypes) {
  diffTypes[key].value = key;
}

const diffTypesByMediaType = {
  'text/html': [
    diffTypes.HIGHLIGHTED_TEXT,
    diffTypes.HIGHLIGHTED_SOURCE,
    diffTypes.HIGHLIGHTED_RENDERED,
    diffTypes.SIDE_BY_SIDE_RENDERED,
    diffTypes.OUTGOING_LINKS,
    diffTypes.CHANGES_ONLY_TEXT,
    diffTypes.CHANGES_ONLY_SOURCE
  ],

  'text/*': [
    diffTypes.HIGHLIGHTED_SOURCE,
    diffTypes.CHANGES_ONLY_SOURCE
  ],

  '*/*': [
    diffTypes.RAW_SIDE_BY_SIDE,
    diffTypes.RAW_FROM_CONTENT,
    diffTypes.RAW_TO_CONTENT
  ]
};

/**
 * Get appropriate diff types for a given kind of content.
 * @param {string|MediaType} mediaType The type of content to get. Can be a
 *   MediaType object, a content type/media type string, or a file extension.
 * @returns {Array<DiffType>}
 */
export function diffTypesFor (mediaType) {
  let type = null;
  if (typeof mediaType === 'string' && mediaType.startsWith('.')) {
    type = mediaTypeForExtension(mediaType) || unknownType;
  } else {
    type = parseMediaType(mediaType);
  }

  return diffTypesByMediaType[type.mediaType] ||
        diffTypesByMediaType[type.genericType] ||
        diffTypesByMediaType[unknownType.mediaType] ||
        [];
}
