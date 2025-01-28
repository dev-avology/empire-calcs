import { generateSellerNetSheet } from './seller-net-sheet.js';

// Sample data with realistic values
const sampleResults = {
    salePrice: 350000,
    closingCosts: {
        'Real Estate Commission (6%)': 21000,
        'Prorated Property Taxes': 1250,
        'Recording Fees': 85,
        'HOA Transfer Fee': 250
    },
    titleCharges: {
        'Title Insurance': 1850,
        'Title Search': 250,
        'Settlement Fee': 495,
        'Wire Fee': 35
    },
    otherFees: {
        'Home Warranty': 550,
        'Repairs (Estimate)': 2500,
        'Outstanding HOA Dues': 175
    }
};

// Sample form data
const sampleFormData = {
    includeAddress: true,
    address: '123 Main Street, Richmond, IN 47374',
    partner: null  // No partner for Template 1
};

// Generate Template 1
const doc = generateSellerNetSheet(sampleResults, sampleFormData, 1);
doc.save('example-seller-net-sheet-template1.pdf');
