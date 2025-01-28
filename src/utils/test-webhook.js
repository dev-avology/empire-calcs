import { WebhookService } from '../services/WebhookService';

// Create sample PDF data (simple base64 string for testing)
const samplePdfBase64 = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';

// Sample form data
const sampleFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Charlotte',
    state: 'NC',
    zip: '28202',
    agentName: 'Jane Smith',
    agentEmail: 'jane.smith@empiretitle.com',
    agentPhone: '(555) 987-6543',
    agentTitle: 'Senior Title Agent'
};

// Sample calculation results
const sampleResults = {
    salePrice: 500000,
    existingMortgage: 300000,
    commission: 30000,
    titleInsurance: 1500,
    propertyTaxes: 2500,
    otherFees: 1000,
    transferTax: 1000,
    recordingFees: 500,
    hoaFees: 350,
    escrowFees: 800
};

// Create a sample PDF blob
const samplePdfBlob = new Blob(
    [Uint8Array.from(atob(samplePdfBase64), c => c.charCodeAt(0))], 
    { type: 'application/pdf' }
);

async function testWebhook() {
    try {
        const webhookService = new WebhookService();
        
        console.log('Sending test webhook to GHL...');
        const response = await webhookService.handleFormSubmission(
            sampleFormData,
            sampleResults,
            samplePdfBlob
        );

        console.log('Webhook response:', response);
        
        if (response.success) {
            console.log('✅ Test webhook sent successfully!');
        } else {
            console.error('❌ Error sending test webhook:', response.error);
        }
    } catch (error) {
        console.error('❌ Error in test:', error);
    }
}

// Run the test
testWebhook();
