// Test webhook submission
const testData = {
    salePrice: "500000",
    propertyAddress: "123 Test Street, Test City, CA 90210",
    existingMortgage: "300000",
    sellerName: "Test Seller",
    sellerEmail: "test@example.com",
    sellerPhone: "(555) 555-5555",
    isPartner: "no",
    templatePath: "seller-net-sheet-template.html"
};

async function testWebhook() {
    try {
        console.log('Sending test data to webhook...');
        const response = await fetch('https://services.leadconnectorhq.com/hooks/E5ke7shEsizw0QL0nnhv/webhook-trigger/c8d1afd2-f1e0-41cc-a075-d4a47d610a92', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();
        console.log('Webhook response:', result);
        console.log('Test completed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the test
testWebhook();
