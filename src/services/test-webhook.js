import { WebhookService } from './WebhookService.js';
import fs from 'fs';
import path from 'path';

// Sample form data with all fields
const sampleFormData = {
    // Contact Information
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    
    // Property Information
    address: '123 Main Street',
    city: 'Columbus',
    state: 'OH',
    zip: '43215',
    includeAddress: true,
    
    // Agent Information
    agentName: 'Jane Smith',
    agentEmail: 'jane.smith@abcrealty.com',
    agentPhone: '(555) 123-4567',
    agentTitle: 'Senior Real Estate Agent',
    
    // Calculator Input
    salePrice: '$300,000',
    existingMortgage: '$150,000',
    commission: '$18,000',
    titleInsurance: '$1,725.75',
    propertyTaxes: '$2,500',
    otherFees: '$500'
};

// Sample results (after parsing)
const sampleResults = {
    salePrice: 300000,
    existingMortgage: 150000,
    commission: 18000,
    titleInsurance: 1725.75,
    propertyTaxes: 2500,
    otherFees: 500
};

async function testWebhook() {
    try {
        console.log('Testing GHL webhook integration...');
        const webhookService = new WebhookService();
        
        // Load sample PDF and agent photo
        const pdfPath = path.join(process.cwd(), '..', '..', 'seller-net-sheet-template2.pdf');
        const photoPath = path.join(process.cwd(), '..', '..', 'public', 'images', 'missy.horner.jpg');
        
        const pdfBuffer = fs.readFileSync(pdfPath);
        const photoBuffer = fs.readFileSync(photoPath);
        
        // Convert buffers to Blobs
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const photoBlob = new Blob([photoBuffer], { type: 'image/jpeg' });
        
        // Test webhook submission with all data
        const response = await webhookService.handleFormSubmission(
            sampleFormData,
            sampleResults,
            pdfBlob,
            photoBlob
        );
        
        if (response.success) {
            console.log('✅ Successfully sent to Go High Level!');
            console.log('Response:', JSON.stringify(response.data, null, 2));
        } else {
            console.log('❌ Failed to send to Go High Level:', response.error);
        }
    } catch (error) {
        console.error('Error in webhook test:', error);
    }
}

// Run the test
console.log('Starting webhook test...');
testWebhook();
