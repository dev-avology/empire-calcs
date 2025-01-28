import { SellerCalculator } from './calculators/SellerCalculator.js';
import { FormUtils } from './utils/FormUtils.js';

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new SellerCalculator();
    const form = document.getElementById('seller-calculator-form');
    
    // Initialize form validation and formatting
    FormUtils.bindFormEvents(form);
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!FormUtils.validateForm(form)) {
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await calculator.handleFormSubmission(data);
            
            if (response.success) {
                // Update results display
                document.getElementById('result-sale-price').textContent = 
                    calculator.formatCurrency(response.results.salePrice);
                document.getElementById('result-total-expenses').textContent = 
                    calculator.formatCurrency(response.results.totalExpenses);
                document.getElementById('result-net-proceeds').textContent = 
                    calculator.formatCurrency(response.results.netProceeds);

                // Show results section
                document.getElementById('results').style.display = 'block';
                document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

                // Setup PDF generation
                document.getElementById('generate-pdf-btn').onclick = () => {
                    if (response.pdf) {
                        const dataUrl = response.pdf.output('dataurlstring');
                        const newWindow = window.open('', '_blank');
                        newWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                                <head>
                                    <title>Seller Net Sheet</title>
                                    <style>
                                        body, html {
                                            margin: 0;
                                            padding: 0;
                                            height: 100%;
                                            overflow: hidden;
                                        }
                                        iframe {
                                            width: 100%;
                                            height: 100%;
                                            border: none;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <iframe src="${dataUrl}" type="application/pdf" width="100%" height="100%"></iframe>
                                </body>
                            </html>
                        `);
                        newWindow.document.close();
                    }
                };
            } else {
                alert('Error: ' + response.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    });
});
