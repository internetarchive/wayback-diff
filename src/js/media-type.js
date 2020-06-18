/**
 * Tools for dealing with media types.
 */

/**
 * @typedef MediaType Represents a media type.
 * @property {string} mediaType The full media type string, e.g. 'text/plain'
 * @property {string} type The primary type, e.g. 'text' in 'text/plain'
 * @property {string} subType The sub type, e.g. 'plain' in 'text/plain'
 * @property {string} genericType The generic type, e.g. 'text/*'
 * @property {(MediaType) => boolean} equals Compare this MediaType with another
 */

/**
 * The "unknown" media type.
 * @type {MediaType}
 */
export const unknownType = {
  genericType: '*/*',
  mediaType: '*/*',
  type: '*',
  subType: '*',
  equals (otherType) {
    return !!otherType && this.mediaType === otherType.mediaType;
  }
};

/**
 * The canonical HTML media type.
 * @type {MediaType}
 */
export const htmlType = MediaType('text', 'html');

/**
 * Create an object representing a media type.
 * @param {string} [type]
 * @param {string} [subtype]
 * @returns {MediaType}
 */
export default function MediaType (type, subtype) {
  type = type || '*';
  subtype = subtype || '*';

  return Object.assign(Object.create(unknownType), {
    genericType: `${type}/*`,
    mediaType: `${type}/${subtype || '*'}`,
    type,
    subtype
  });
}

// TODO: remove this when we have content types for everything in the DB
export const mediaTypeForExtension = {
  '.html': htmlType,
  '.pdf': MediaType('application', 'pdf'),
  '.wsdl': MediaType('application', 'wsdl+xml'),
  '.xml': MediaType('application', 'xml'),
  '.ksh': MediaType('text', '*'),
  '.ics': MediaType('text', 'calendar'),
  '.txt': MediaType('text', 'plain'),
  '.rss': MediaType('application', 'rss+xml'),
  '.jpg': MediaType('image', 'jpeg'),
  '.obj': MediaType('application', 'x-tgif'),
  '.doc': MediaType('application', 'msword'),
  '.zip': MediaType('application', 'zip'),
  '.atom': MediaType('application', 'atom+xml'),
  '.xlb': MediaType('application', 'excel'),
  '.pwz': MediaType('application', 'powerpoint'),
  '.gif': MediaType('image', 'gif'),
  '.rtf': MediaType('application', 'rtf'),
  '.csv': MediaType('text', 'csv'),
  '.xls': MediaType('application', 'vnd.ms-excel'),
  '.xlsx': MediaType('application', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
  '.png': MediaType('image', 'png'),
  '.docx': MediaType('application', 'vnd.openxmlformats-officedocument.wordprocessingml.document'),
  '.jpeg': MediaType('image', 'jpeg'),
  '.mp3': MediaType('audio', 'mpeg'),
  '.ai': MediaType('application', 'postscript')
};

// Maps various media types representing the same thing to a canonical type.
const canonicalTypes = {
  'application/xhtml': htmlType,
  'application/xhtml+xml': htmlType,
  'application/xml+html': htmlType,
  'text/webviewhtml': htmlType,
  'text/x-server-parsed-html': htmlType,
  'text/xhtml': htmlType
};

/**
 * Convert a media type string to a MediaType object.
 * @param {string|MediaType} mediaType
 * @param {boolean} [canonicalize=true]
 * @returns {MediaType}
 */
export function parseMediaType (mediaType, canonicalize = true) {
  if (mediaType == null) {
    mediaType = '*/*';
  } else if (mediaType.mediaType) {
    return mediaType;
  } else if (!(typeof mediaType === 'string')) {
    throw new TypeError(`The 'mediaType' argument must be a string, not \`${mediaType}\``);
  }

  const parts = mediaType.match(/^([^/;]+)(?:\/([^;]+))?/) || [];
  let parsed = MediaType(parts[1], parts[2]);

  if (canonicalize) {
    const canonicalType = canonicalTypes[parsed.mediaType];
    if (canonicalType) {
      parsed = Object.create(canonicalType, { exactType: { value: parsed } });
    }
  }

  return parsed;
}
