/**

 * @param {number|string|null|undefined} value - The score value to format
 * @returns {string} The formatted score
 */
export const formatScore = (value) => {

  if (typeof value === 'string' && value.startsWith('N')) {
    return value;
  }
  
  if (value === null || value === undefined || value === '' || isNaN(parseFloat(value))) {
    return '-';
  }
  return parseFloat(value).toFixed(2);
};

/**

 * @param {number|string|null|undefined} value - The percentage value to format
 * @returns {string} The formatted percentage
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined || value === '' || isNaN(parseFloat(value))) {
    return '-';
  }
  return `${parseFloat(value).toFixed(1)}%`;
};

/**

 * @param {number|string|null|undefined} value - The number to format
 * @returns {string} The formatted number
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '' || isNaN(parseFloat(value))) {
    return '-';
  }
  return parseFloat(value).toLocaleString('vi-VN');
};

/**

 * @param {string|null|undefined} value - The language code to format
 * @returns {string} The formatted language code
 */
export const formatLanguageCode = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
}; 