import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../utils/formatters.js';

export class PDFGenerator {
    constructor() {
        this.defaultStyles = {
            header: {
                fontSize: 20,
                font: 'helvetica',
                textColor: [44, 52, 148]  // Empire blue
            },
            subheader: {
                fontSize: 14,
                font: 'helvetica',
                textColor: [44, 52, 148]
            },
            normal: {
                fontSize: 12,
                font: 'helvetica',
                textColor: [0, 0, 0]
            },
            small: {
                fontSize: 10,
                font: 'helvetica',
                textColor: [100, 100, 100]
            }
        };
    }

    async generateSellerNetSheet(results, formData) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        let yPos = margin;

        // Add Empire Title logo
        try {
            const logoImg = await this.loadImage('/images/empire-logo.png');
            doc.addImage(logoImg, 'PNG', margin, yPos, 60, 30);
        } catch (error) {
            console.warn('Could not load logo:', error);
        }

        // Header
        yPos += 40;
        doc.setFontSize(this.defaultStyles.header.fontSize);
        doc.setTextColor(...this.defaultStyles.header.textColor);
        doc.text('Seller Net Sheet', pageWidth / 2, yPos, { align: 'center' });

        // Contact Information
        yPos += 20;
        doc.setFontSize(this.defaultStyles.subheader.fontSize);
        doc.text('Contact Information', margin, yPos);
        
        yPos += 10;
        doc.setFontSize(this.defaultStyles.normal.fontSize);
        doc.setTextColor(0, 0, 0);
        const contactInfo = [
            [`Name: ${formData.firstName} ${formData.lastName}`, `Email: ${formData.email}`],
            [`Phone: ${formData.phone}`, `Address: ${formData.address}`],
            [`City: ${formData.city}`, `State: ${formData.state} Zip: ${formData.zip}`]
        ];
        
        doc.autoTable({
            startY: yPos,
            head: [],
            body: contactInfo,
            theme: 'plain',
            margin: { left: margin },
            styles: { cellPadding: 2 }
        });

        // Property Information
        yPos = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(this.defaultStyles.subheader.fontSize);
        doc.setTextColor(...this.defaultStyles.header.textColor);
        doc.text('Property Information', margin, yPos);

        yPos += 10;
        const propertyDetails = [
            ['Sale Price:', formatCurrency(results.salePrice)],
            ['Existing Mortgage:', formatCurrency(results.existingMortgage)],
            ['Property Taxes:', formatCurrency(results.propertyTaxes)]
        ];

        doc.autoTable({
            startY: yPos,
            head: [],
            body: propertyDetails,
            theme: 'plain',
            margin: { left: margin },
            styles: { cellPadding: 2 }
        });

        // Closing Costs
        yPos = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(this.defaultStyles.subheader.fontSize);
        doc.text('Closing Costs', margin, yPos);

        yPos += 10;
        const closingCosts = [
            ['Commission:', formatCurrency(results.commission)],
            ['Title Insurance:', formatCurrency(results.titleInsurance)],
            ['Transfer Tax:', formatCurrency(results.transferTax)],
            ['Recording Fees:', formatCurrency(results.recordingFees)],
            ['HOA Fees:', formatCurrency(results.hoaFees)],
            ['Escrow Fees:', formatCurrency(results.escrowFees)],
            ['Other Fees:', formatCurrency(results.otherFees)]
        ];

        doc.autoTable({
            startY: yPos,
            head: [],
            body: closingCosts,
            theme: 'plain',
            margin: { left: margin },
            styles: { cellPadding: 2 }
        });

        // Results
        yPos = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(this.defaultStyles.subheader.fontSize);
        doc.text('Estimated Net Proceeds', margin, yPos);

        yPos += 10;
        const totalExpenses = Object.values(results).reduce((sum, value) => 
            typeof value === 'number' ? sum + value : sum, 0) - results.salePrice;
        const netProceeds = results.salePrice - totalExpenses;

        const summary = [
            ['Sale Price:', formatCurrency(results.salePrice)],
            ['Total Expenses:', formatCurrency(totalExpenses)],
            ['Net Proceeds:', formatCurrency(netProceeds)]
        ];

        doc.autoTable({
            startY: yPos,
            head: [],
            body: summary,
            theme: 'plain',
            margin: { left: margin },
            styles: {
                cellPadding: 2,
                fontSize: 14,
                textColor: [44, 52, 148]
            }
        });

        // Agent Information
        if (formData.agentName) {
            yPos = doc.lastAutoTable.finalY + 15;
            doc.setFontSize(this.defaultStyles.subheader.fontSize);
            doc.text('Agent Information', margin, yPos);

            yPos += 10;
            const agentInfo = [
                ['Agent Name:', formData.agentName],
                ['Agent Email:', formData.agentEmail],
                ['Agent Phone:', formData.agentPhone],
                ['Agent Title:', formData.agentTitle]
            ];

            doc.autoTable({
                startY: yPos,
                head: [],
                body: agentInfo,
                theme: 'plain',
                margin: { left: margin },
                styles: { cellPadding: 2 }
            });
        }

        // Footer
        const footerText = 'This is an estimate of net proceeds and is not a guarantee. ' +
            'Actual proceeds may vary based on final closing costs and adjustments.';
        doc.setFontSize(this.defaultStyles.small.fontSize);
        doc.setTextColor(...this.defaultStyles.small.textColor);
        doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 10, {
            align: 'center',
            maxWidth: pageWidth - (margin * 2)
        });

        return doc;
    }

    async generateBuyerEstimate(results, formData) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        let yPos = margin;

        // Add Empire Title logo
        try {
            const logoImg = await this.loadImage('/images/empire-logo.png');
            doc.addImage(logoImg, 'PNG', margin, yPos, 60, 30);
        } catch (error) {
            console.warn('Could not load logo:', error);
        }

        // Header
        yPos += 40;
        doc.setFontSize(this.defaultStyles.header.fontSize);
        doc.setTextColor(...this.defaultStyles.header.textColor);
        doc.text('Buyer Closing Cost Estimate', pageWidth / 2, yPos, { align: 'center' });

        // Contact Information
        yPos += 20;
        doc.setFontSize(this.defaultStyles.subheader.fontSize);
        doc.text('Contact Information', margin, yPos);
        
        yPos += 10;
        doc.setFontSize(this.defaultStyles.normal.fontSize);
        doc.setTextColor(0, 0, 0);
        const contactInfo = [
            [`Name: ${formData.firstName} ${formData.lastName}`, `Email: ${formData.email}`],
            [`Phone: ${formData.phone}`, `Address: ${formData.address}`],
            [`City: ${formData.city}`, `State: ${formData.state} Zip: ${formData.zip}`]
        ];
        
        doc.autoTable({
            startY: yPos,
            head: [],
            body: contactInfo,
            theme: 'plain',
            margin: { left: margin },
            styles: { cellPadding: 2 }
        });

        // Purchase Information
        yPos = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(this.defaultStyles.subheader.fontSize);
        doc.setTextColor(...this.defaultStyles.header.textColor);
        doc.text('Purchase Information', margin, yPos);

        yPos += 10;
        const purchaseDetails = [
            ['Purchase Price:', formatCurrency(results.purchasePrice)],
            ['Down Payment:', formatCurrency(results.downPayment)],
            ['Loan Amount:', formatCurrency(results.loanAmount)]
        ];

        doc.autoTable({
            startY: yPos,
            head: [],
            body: purchaseDetails,
            theme: 'plain',
            margin: { left: margin },
            styles: { cellPadding: 2 }
        });

        // Closing Costs
        yPos = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(this.defaultStyles.subheader.fontSize);
        doc.text('Closing Costs', margin, yPos);

        yPos += 10;
        const closingCosts = [
            ['Title Insurance:', formatCurrency(results.titleInsurance)],
            ['Lender Fees:', formatCurrency(results.lenderFees)],
            ['Escrow Fees:', formatCurrency(results.escrowFees)],
            ['Recording Fees:', formatCurrency(results.recordingFees)],
            ['Property Taxes:', formatCurrency(results.propertyTaxes)],
            ['Transfer Tax:', formatCurrency(results.transferTax)],
            ['HOA Fees:', formatCurrency(results.hoaFees)],
            ['Other Fees:', formatCurrency(results.otherFees)]
        ];

        doc.autoTable({
            startY: yPos,
            head: [],
            body: closingCosts,
            theme: 'plain',
            margin: { left: margin },
            styles: { cellPadding: 2 }
        });

        // Results
        yPos = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(this.defaultStyles.subheader.fontSize);
        doc.text('Total Cash Required', margin, yPos);

        yPos += 10;
        const totalClosingCosts = Object.values(results).reduce((sum, value) => 
            typeof value === 'number' ? sum + value : sum, 0) - results.purchasePrice - results.loanAmount;
        const totalCashRequired = results.downPayment + totalClosingCosts;

        const summary = [
            ['Down Payment:', formatCurrency(results.downPayment)],
            ['Total Closing Costs:', formatCurrency(totalClosingCosts)],
            ['Total Cash Required:', formatCurrency(totalCashRequired)]
        ];

        doc.autoTable({
            startY: yPos,
            head: [],
            body: summary,
            theme: 'plain',
            margin: { left: margin },
            styles: {
                cellPadding: 2,
                fontSize: 14,
                textColor: [44, 52, 148]
            }
        });

        // Agent Information
        if (formData.agentName) {
            yPos = doc.lastAutoTable.finalY + 15;
            doc.setFontSize(this.defaultStyles.subheader.fontSize);
            doc.text('Agent Information', margin, yPos);

            yPos += 10;
            const agentInfo = [
                ['Agent Name:', formData.agentName],
                ['Agent Email:', formData.agentEmail],
                ['Agent Phone:', formData.agentPhone],
                ['Agent Title:', formData.agentTitle]
            ];

            doc.autoTable({
                startY: yPos,
                head: [],
                body: agentInfo,
                theme: 'plain',
                margin: { left: margin },
                styles: { cellPadding: 2 }
            });
        }

        // Footer
        const footerText = 'This is an estimate of closing costs and is not a guarantee. ' +
            'Actual costs may vary based on final closing costs and adjustments.';
        doc.setFontSize(this.defaultStyles.small.fontSize);
        doc.setTextColor(...this.defaultStyles.small.textColor);
        doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - 10, {
            align: 'center',
            maxWidth: pageWidth - (margin * 2)
        });

        return doc;
    }

    async loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}
