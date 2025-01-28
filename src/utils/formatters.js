/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    const number = parseInt(amount);
    if (isNaN(number)) return '$0';
    return '$' + Math.min(number, 999999999).toLocaleString('en-US', {
        maximumFractionDigits: 0,
        useGrouping: true
    });
}

/**
 * Format a number as a percentage
 * @param {number} value - Value to format
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
    const number = parseInt(value);
    if (isNaN(number)) return '0%';
    return number.toLocaleString('en-US', {
        maximumFractionDigits: 0,
        useGrouping: true
    }) + '%';
}

/**
 * Format a phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}
