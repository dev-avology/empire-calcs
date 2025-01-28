import { jsPDF } from 'jspdf';
import { PDF_STYLES } from './PDFStyles.js';
import { draw3DBox, drawSectionHeader, drawContactBox, formatCurrency } from './utils.js';

// Color constants
export const COLORS = {
    EMPIRE_RED: '#E31837',
    DARK_GRAY: '#333333',
    MEDIUM_GRAY: '#666666',
    LIGHT_GRAY: '#999999',
    WHITE: '#FFFFFF',
    SHADOW_GRAY: '#E0E0E0'
};

// Page setup constants
export const PAGE = {
    MARGIN: 40,
    WIDTH: 612, // 8.5" in points
    HEIGHT: 792, // 11" in points
};

// Spacing constants
export const SPACING = {
    LOGO_TO_TITLE: 100,
    TITLE_TO_ADDRESS: 25,
    ADDRESS_TO_SECTION: 35,
    NO_ADDRESS_TO_SECTION: 10,
    BETWEEN_SECTIONS: 25,
    LINE_HEIGHT: 25,
    NET_TO_DISCLAIMER: 15,
    BOTTOM_MARGIN_CONTACTS: 120
};

// Font sizes
export const FONTS = {
    MAIN_TITLE: 20,
    SECTION_HEADER: 12,
    BODY: 11,
    NET_PROCEEDS: 12,
    DISCLAIMER: 7
};

/**
 * Creates a 3D box effect with shadows and highlights
 * @param {Object} doc - jsPDF document instance
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Box width
 * @param {number} height - Box height
 * @param {string} fillColor - Background color
 */
export function drawBox(doc, x, y, width, height, fillColor = COLORS.WHITE) {
    // Shadow
    doc.setFillColor('#CCCCCC');
    doc.rect(x + 4, y + 4, width, height, 'F');
    
    // Main box
    doc.setFillColor(fillColor);
    doc.rect(x, y, width, height, 'F');
    
    // Top/left highlight
    doc.setDrawColor(COLORS.WHITE);
    doc.line(x, y, x + width, y); // Top
    doc.line(x, y, x, y + height); // Left
    
    // Bottom/right shadow
    doc.setDrawColor(COLORS.SHADOW_GRAY);
    doc.line(x, y + height, x + width, y + height); // Bottom
    doc.line(x + width, y, x + width, y + height); // Right
}

/**
 * Generates a seller net sheet PDF with precise styling
 * @param {Object} results - Calculation results
 * @param {Object} formData - Form data including address
 * @param {number} template - Template number (1 or 2)
 * @returns {jsPDF} PDF document
 */
export function generateSellerNetSheet(results, formData, template = 1) {
    const doc = new jsPDF({
        orientation: PDF_STYLES.document.orientation,
        unit: PDF_STYLES.document.unit,
        format: PDF_STYLES.document.format
    });

    const margin = PDF_STYLES.document.margins.all;
    const contentWidth = doc.internal.pageSize.width - (2 * margin);
    
    // Add header with logo
    const logoWidth = PDF_STYLES.header.logo.width;
    const logoHeight = PDF_STYLES.header.logo.height;
    const logoX = (doc.internal.pageSize.width - logoWidth) / 2;
    const logoY = PDF_STYLES.header.logo.topMargin;
    
    // Placeholder for logo area
    doc.setFillColor(PDF_STYLES.colors.lightGray);
    doc.rect(logoX, logoY, logoWidth, logoHeight, 'F');

    // Start content area
    let currentY = PDF_STYLES.header.height;

    // Add title
    doc.setFont(PDF_STYLES.typography.fonts.primary, PDF_STYLES.typography.fontStyles.bold);
    doc.setFontSize(PDF_STYLES.typography.sizes.mainTitle);
    doc.setTextColor(PDF_STYLES.colors.empireRed);
    const title = 'SELLER NET SHEET';
    doc.text(title, doc.internal.pageSize.width / 2, currentY, { align: 'center' });

    // Add address if included
    if (formData.includeAddress && formData.address) {
        currentY += PDF_STYLES.content.spacing.titleToAddress;
        doc.setFont(PDF_STYLES.typography.fonts.primary, PDF_STYLES.typography.fontStyles.normal);
        doc.setFontSize(PDF_STYLES.typography.sizes.bodyText);
        doc.setTextColor(PDF_STYLES.colors.darkGray);
        doc.text(formData.address, doc.internal.pageSize.width / 2, currentY, { align: 'center' });
        currentY += PDF_STYLES.content.spacing.addressToSection;
    } else {
        currentY += PDF_STYLES.content.spacing.noAddressToSection;
    }

    // Transaction Details Section
    currentY += drawSectionHeader(doc, 'TRANSACTION DETAILS', margin, currentY, contentWidth);
    currentY += 15;

    // Add sections for costs
    const sections = [
        { title: 'CLOSING COSTS', items: results.closingCosts },
        { title: 'TITLE CHARGES', items: results.titleCharges },
        { title: 'OTHER FEES', items: results.otherFees }
    ];

    sections.forEach(section => {
        currentY += PDF_STYLES.content.spacing.betweenSections;
        currentY += drawSectionHeader(doc, section.title, margin, currentY, contentWidth);
        currentY = addSectionItems(doc, section.items, margin, currentY, contentWidth);
    });

    // Net Proceeds
    currentY += PDF_STYLES.content.spacing.betweenSections;
    const netProceeds = calculateNetProceeds(results);
    addNetProceeds(doc, netProceeds, margin, currentY, contentWidth);

    // Add disclaimer
    currentY += PDF_STYLES.content.spacing.netToDisclaimer;
    addDisclaimer(doc, margin, currentY, contentWidth);

    // Add footer with contact box(es)
    const footerY = doc.internal.pageSize.height - PDF_STYLES.footer.height;
    
    // Add contact box(es)
    if (template === 2) {
        // Add partner contact on left
        const partnerContact = {
            name: formData.partner.name,
            title: formData.partner.title,
            phone: formData.partner.phone,
            email: formData.partner.email,
            photoUrl: formData.partner.photoUrl
        };
        const partnerY = footerY + (PDF_STYLES.footer.height - PDF_STYLES.footer.contact.height) / 2;
        drawContactBox(doc, partnerContact, margin, partnerY);
    }

    // Add Missy's contact box (right side)
    const missyContact = {
        name: "Missy Horner",
        title: "President",
        phone: "765-935-9966",
        email: "missy@empiretitleservice.com"
        // Temporarily remove photo
    };
    
    const missyY = footerY + (PDF_STYLES.footer.height - PDF_STYLES.footer.contact.height) / 2;
    const missyX = template === 2 
        ? doc.internal.pageSize.width / 2 + 20 
        : doc.internal.pageSize.width - margin - PDF_STYLES.footer.contact.width;
    
    drawContactBox(doc, missyContact, missyX, missyY);

    return doc;
}

/**
 * Adds section items to the PDF
 * @private
 */
function addSectionItems(doc, items, x, y, width) {
    doc.setFont(PDF_STYLES.typography.fonts.primary, PDF_STYLES.typography.fontStyles.normal);
    doc.setFontSize(PDF_STYLES.typography.sizes.bodyText);
    doc.setTextColor(PDF_STYLES.colors.darkGray);

    Object.entries(items).forEach(([label, amount]) => {
        doc.text(label, x + 10, y + 20);
        doc.text(formatCurrency(amount), x + width - 10, y + 20, { align: 'right' });
        y += PDF_STYLES.spacing.lineHeight;
    });

    return y;
}

/**
 * Adds net proceeds section with special styling
 * @private
 */
function addNetProceeds(doc, amount, x, y, width) {
    const isNegative = amount < 0;
    
    // Draw background box
    draw3DBox(doc, x, y, width, PDF_STYLES.spacing.lineHeight + 10);
    
    // Add text
    doc.setFont(PDF_STYLES.typography.fonts.bold, PDF_STYLES.typography.fontStyles.bold);
    doc.setFontSize(PDF_STYLES.typography.sizes.netProceeds);
    doc.setTextColor(isNegative ? PDF_STYLES.colors.empireRed : PDF_STYLES.colors.darkGray);
    
    doc.text('ESTIMATED NET PROCEEDS', x + 10, y + 20);
    doc.text(formatCurrency(amount), x + width - 10, y + 20, { align: 'right' });
}

/**
 * Adds disclaimer text
 * @private
 */
function addDisclaimer(doc, x, y, width) {
    doc.setFont(PDF_STYLES.typography.fonts.primary, PDF_STYLES.typography.fontStyles.normal);
    doc.setFontSize(PDF_STYLES.typography.sizes.disclaimer);
    doc.setTextColor(PDF_STYLES.colors.mediumGray);
    
    const disclaimer = 'This is an estimate of seller net proceeds and actual figures may vary. No warranty or guarantee of net proceeds is expressed or implied. Figures are based on information provided by the seller and/or other parties and their accuracy cannot be guaranteed.';
    
    doc.text(disclaimer, x, y, {
        align: 'left',
        maxWidth: width
    });
}

/**
 * Calculates net proceeds from results
 * @private
 */
function calculateNetProceeds(results) {
    const totalClosingCosts = Object.values(results.closingCosts).reduce((sum, val) => sum + val, 0);
    const totalTitleCharges = Object.values(results.titleCharges).reduce((sum, val) => sum + val, 0);
    const totalOtherFees = Object.values(results.otherFees).reduce((sum, val) => sum + val, 0);
    
    return results.salePrice - totalClosingCosts - totalTitleCharges - totalOtherFees;
}

/**
 * Adds Missy's contact box to the PDF
 * @param {Object} doc - jsPDF document instance
 * @param {number} template - Template number
 */
function addMissyContactBox(doc, template) {
    const boxWidth = 250;
    const boxHeight = 100;
    const boxY = PAGE.HEIGHT - SPACING.BOTTOM_MARGIN_CONTACTS;
    
    let boxX;
    if (template === 1) {
        boxX = PAGE.WIDTH - PAGE.MARGIN - boxWidth;
    } else {
        boxX = PAGE.WIDTH / 2 + 20;
    }
    
    drawBox(doc, boxX, boxY, boxWidth, boxHeight);
    
    // TODO: Add photo and contact details
}

/**
 * Adds partner contact box to the PDF (Template 2 only)
 * @param {Object} doc - jsPDF document instance
 */
function addPartnerContactBox(doc) {
    const boxWidth = 250;
    const boxHeight = 100;
    const boxX = PAGE.MARGIN;
    const boxY = PAGE.HEIGHT - SPACING.BOTTOM_MARGIN_CONTACTS;
    
    drawBox(doc, boxX, boxY, boxWidth, boxHeight);
    
    // TODO: Add partner photo and contact details
}

export default generateSellerNetSheet;
