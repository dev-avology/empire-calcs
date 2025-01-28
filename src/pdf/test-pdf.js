import { generateSellerNetSheet } from './seller-net-sheet.js';

// Sample data with positive net proceeds
const sampleResults = {
    salePrice: 300000,
    existingMortgage: 150000,
    commission: 18000,
    titleInsurance: 1725.75,
    propertyTaxes: 2500,
    otherFees: 500
};

// Sample form data with address
const sampleFormData = {
    address: '123 Main Street',
    city: 'Columbus',
    state: 'OH',
    zip: '43215',
    includeAddress: true,
    // Partner info only used in template 2
    partner: {
        name: 'John Smith',
        company: 'ABC Realty',
        phone: '(555) 123-4567',
        email: 'john.smith@abcrealty.com'
    }
};

// Function to test PDF generation
async function testPDF() {
    try {
        // Generate Template 1 (Missy only)
        let doc = generateSellerNetSheet(sampleResults, sampleFormData, 1);
        doc.save('seller-net-sheet-template1.pdf');
        console.log('Generated Template 1 (Missy only)');

        // Generate Template 2 (Co-branded)
        doc = generateSellerNetSheet(sampleResults, sampleFormData, 2);
        doc.save('seller-net-sheet-template2.pdf');
        console.log('Generated Template 2 (Co-branded)');

        // Test negative net proceeds
        const negativeResults = {
            ...sampleResults,
            salePrice: 200000  // Lower sale price to create negative net proceeds
        };
        doc = generateSellerNetSheet(negativeResults, sampleFormData, 1);
        doc.save('seller-net-sheet-negative.pdf');
        console.log('Generated Template 1 with negative net proceeds');

        // Test without address
        const noAddressFormData = {
            ...sampleFormData,
            includeAddress: false
        };
        doc = generateSellerNetSheet(sampleResults, noAddressFormData, 1);
        doc.save('seller-net-sheet-no-address.pdf');
        console.log('Generated Template 1 without address');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}

// Run the test
testPDF();
