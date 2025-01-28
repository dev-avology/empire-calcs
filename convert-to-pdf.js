import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        :root {
            --empire-red: #E31837;
            --dark-gray: #333333;
            --medium-gray: #666666;
            --light-gray: #999999;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            color: var(--dark-gray);
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0;
            line-height: 1.5;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .page-header {
            height: 20vh;
            padding: 20pt;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .page-content {
            height: 50vh;
            padding: 0 40pt;
            overflow: hidden;
        }

        .page-footer {
            height: 30vh;
            position: relative;
            padding: 20pt 40pt;
        }

        h1 {
            color: var(--empire-red);
            font-size: 24pt;
            text-align: center;
            margin: 20pt 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-logo {
            text-align: center;
            margin-bottom: 10pt;
        }

        .header-logo img {
            max-width: 300px;
            margin: 0 auto;
        }

        .address {
            text-align: center;
            font-size: 12pt;
            margin-bottom: 25pt;
            color: var(--medium-gray);
        }

        h2 {
            background-color: var(--empire-red);
            color: white;
            font-size: 14pt;
            padding: 10pt;
            margin: 15pt 0;
            border-radius: 5px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 15pt 0;
            font-size: 12pt;
        }

        li {
            margin-bottom: 10pt;
            padding: 5pt 10pt;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 3px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .contact {
            position: absolute;
            bottom: 40pt;
            right: 40pt;
            width: 280px;
            border: 3px solid var(--empire-red);
            padding: 20pt;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .contact strong {
            font-size: 16pt;
            color: var(--dark-gray);
            display: block;
            margin-bottom: 10pt;
        }

        .contact p {
            font-size: 12pt;
            color: var(--medium-gray);
            margin: 5pt 0;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="page-header">
        <div class="header-logo">
            <img src="assets/images/empire-title-logo-landscape.png.jpg" alt="Empire Logo">
        </div>
        <h1>SELLER NET SHEET</h1>
        <div class="address">123 Main Street, Richmond, IN 47374</div>
    </div>

    <div class="page-content">
        <h2>TRANSACTION DETAILS</h2>
        <ul>
            <li>Sale Price: $350,000</li>
        </ul>

        <h2>CLOSING COSTS</h2>
        <ul>
            <li>Real Estate Commission (6%): $21,000</li>
            <li>Prorated Property Taxes: $1,250</li>
            <li>Recording Fees: $85</li>
            <li>HOA Transfer Fee: $250</li>
        </ul>

        <h2>TITLE CHARGES</h2>
        <ul>
            <li>Title Insurance: $1,850</li>
            <li>Title Search: $250</li>
            <li>Settlement Fee: $495</li>
            <li>Wire Fee: $35</li>
        </ul>

        <h2>OTHER FEES</h2>
        <ul>
            <li>Home Warranty: $550</li>
            <li>Repairs (Estimate): $2,500</li>
            <li>Outstanding HOA Dues: $175</li>
        </ul>
    </div>

    <div class="page-footer">
        <div class="contact">
            <strong>Missy Kidwell</strong>
            <p>Empire Title of Richmond<br>
            765-935-5400<br>
            missy@empiretitlerichmond.com</p>
        </div>
    </div>
</body>
</html>
`;

// Write HTML to file
fs.writeFileSync('seller-net-sheet-template.html', htmlContent);

async function convertToPdf(formData) {
    try {
        // Select template based on partner presence
        const templatePath = formData.isPartner === 'yes' 
            ? '/seller-net-sheet-template-partner.html'
            : '/seller-net-sheet-template.html';

        // Create logs directory if it doesn't exist
        const logDir = './logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        // Log form data to JSON file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFile = `${logDir}/seller-net-sheet-${timestamp}.json`;
        fs.writeFileSync(logFile, JSON.stringify(formData, null, 2));

        // Send data to webhook
        const webhookUrl = 'https://services.leadconnectorhq.com/hooks/E5ke7shEsizw0QL0nnhv/webhook-trigger/c8d1afd2-f1e0-41cc-a075-d4a47d610a92';
        
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    salePrice: formData.salePrice,
                    propertyAddress: formData.propertyAddress,
                    existingMortgage: formData.existingMortgage,
                    propertyTaxes: formData.propertyTaxes,
                    otherFees: formData.otherFees,
                    totalClosingCosts: formData.totalClosingCosts,
                    netProceeds: formData.netProceeds,
                    isPartner: formData.isPartner,
                    partnerInfo: formData.partnerInfo || null,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                console.error('Webhook error:', await response.text());
            }
        } catch (webhookError) {
            console.error('Webhook error:', webhookError);
            // Continue with PDF generation even if webhook fails
        }

        // Generate PDF using selected template
        const pdfDoc = await PDFDocument.create();
        // ... rest of your PDF generation code ...

        return pdfDoc;
    } catch (error) {
        console.error('PDF conversion error:', error);
        throw error;
    }
}

export { convertToPdf };
