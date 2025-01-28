import { PDF_STYLES } from './PDFStyles.js';

/**
 * Creates a 3D box effect with precise shadow and highlights
 * @param {jsPDF} doc - The PDF document
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Box width
 * @param {number} height - Box height
 * @param {string} fillColor - Background color (default: white)
 * @param {boolean} withShadow - Whether to add shadow effect (default: true)
 */
export function draw3DBox(doc, x, y, width, height, fillColor = PDF_STYLES.colors.white, withShadow = true) {
    const { shadowOffset, shadowBlur, highlightColor, shadowColor } = PDF_STYLES.boxEffect;
    
    if (withShadow) {
        // Draw shadow with blur effect
        doc.setFillColor(shadowColor);
        for (let i = 0; i < shadowBlur; i++) {
            const offset = shadowOffset + i * 0.5;
            doc.rect(x + offset, y + offset, width, height, 'F');
        }
    }
    
    // Main box
    doc.setFillColor(fillColor);
    doc.rect(x, y, width, height, 'F');
    
    // Top and left highlights (lighter)
    doc.setDrawColor(highlightColor);
    doc.setLineWidth(1);
    doc.line(x, y, x + width, y); // Top
    doc.line(x, y, x, y + height); // Left
    
    // Bottom and right shadows (darker)
    doc.setDrawColor(shadowColor);
    doc.line(x, y + height, x + width, y + height); // Bottom
    doc.line(x + width, y, x + width, y + height); // Right
}

/**
 * Draws a section header with background color and white text
 * @param {jsPDF} doc - The PDF document
 * @param {string} text - Header text
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Header width
 * @returns {number} The height of the header
 */
export function drawSectionHeader(doc, text, x, y, width) {
    const { height, background, textColor } = PDF_STYLES.sections.header;
    
    // Draw background
    doc.setFillColor(background);
    doc.rect(x, y, width, height, 'F');
    
    // Add text
    doc.setTextColor(textColor);
    doc.setFontSize(PDF_STYLES.typography.sizes.sectionHeader);
    doc.setFont(PDF_STYLES.typography.fonts.primary, PDF_STYLES.typography.fontStyles.bold);
    
    // Center text vertically and add left padding
    const textY = y + (height / 2) + 4; // 4pt adjustment for visual centering
    doc.text(text, x + 10, textY);
    
    return height;
}

/**
 * Draws a contact box with photo and details
 * @param {jsPDF} doc - PDF document
 * @param {Object} contact - Contact details object
 * @param {number} x - X position
 * @param {number} y - Y position
 */
export function drawContactBox(doc, contact, x, y) {
    const styles = PDF_STYLES.footer.contact;
    const text = styles.text;
    const photo = styles.photo;

    // Draw photo with border
    if (contact.photoData) {
        try {
            const photoX = x;
            const photoY = y;
            
            // Draw photo border
            doc.setFillColor(photo.border.color);
            doc.rect(photoX - photo.border.width, 
                    photoY - photo.border.width, 
                    photo.size + (2 * photo.border.width), 
                    photo.size + (2 * photo.border.width), 
                    'F');
            
            // Add photo
            doc.addImage(contact.photoData, 'PNG', photoX, photoY, photo.size, photo.size);
        } catch (error) {
            console.error('Error adding contact photo:', error);
        }
    }

    // Add text content
    const textX = x + photo.size + 15;
    let textY = y + 25;
    
    // Name
    doc.setFont(PDF_STYLES.typography.fonts.primary, PDF_STYLES.typography.fontStyles.bold);
    doc.setFontSize(text.name.size);
    doc.setTextColor(text.name.color);
    doc.text(contact.name, textX, textY);
    
    // Title
    textY += 20;
    doc.setFont(PDF_STYLES.typography.fonts.primary, PDF_STYLES.typography.fontStyles.normal);
    doc.setFontSize(text.details.size);
    doc.setTextColor(text.details.color);
    doc.text(contact.title, textX, textY);
    
    // Phone
    textY += 15;
    doc.text(contact.phone, textX, textY);
    
    // Email
    textY += 15;
    doc.text(contact.email, textX, textY);
}

/**
 * Formats currency values
 * @param {number} amount - Amount to format
 * @param {boolean} showNegative - Whether to show negative sign (default: true)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, showNegative = true) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    if (!showNegative && amount < 0) {
        amount = Math.abs(amount);
    }
    
    return formatter.format(amount);
}
