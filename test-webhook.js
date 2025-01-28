import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

async function sendTestWebhook() {
    const webhookUrl = 'https://services.leadconnectorhq.com/hooks/E5ke7shEsizw0QL0nnhv/webhook-trigger/c8d1afd2-f1e0-41cc-a075-d4a47d610a92';
    
    const testData = {
        salePrice: "$350,000.00",
        propertyAddress: "123 Test Street, Richmond, IN 47374",
        existingMortgage: "$200,000.00",
        propertyTaxes: "$2,500.00",
        otherFees: "$500.00",
        commission: "$21,000.00", // 6% of sale price
        titleInsurance: "$1,750.00",
        transferTax: "$350.00",
        recordingFees: "$85.00",
        hoaFees: "$250.00",
        escrowFees: "$830.00",
        totalClosingCosts: "$26,765.00",
        netProceeds: "$122,735.00",
        isPartner: "yes",
        partnerInfo: {
            name: "Sarah Johnson",
            title: "Senior Real Estate Agent",
            phone: "765-555-4321",
            email: "sarah.johnson@remax.com",
            company: "RE/MAX",
            imageUrl: "https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg"
        },
        timestamp: new Date().toISOString(),
        calculatorType: "seller",
        status: "completed",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        ipAddress: "192.168.1.1",
        sessionId: "test-session-123",
        referrer: "http://localhost:3002/"
    };

    try {
        const response = await fetch(webhookUrl, {
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
        console.log('Webhook sent successfully:', result);
        
        // Create logs directory if it doesn't exist
        const logDir = './logs';
        if (!existsSync(logDir)) {
            await mkdir(logDir);
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFile = `${logDir}/test-webhook-${timestamp}.json`;
        await writeFile(logFile, JSON.stringify(testData, null, 2));
        
        console.log('Test data saved to:', logFile);
        
    } catch (error) {
        console.error('Error sending webhook:', error);
    }
}

// Execute the test
sendTestWebhook();
