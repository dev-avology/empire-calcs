/**
 * Service to handle webhook integrations for form submissions
 */
export class WebhookService {
    constructor() {
        this.webhookUrl = 'https://services.leadconnectorhq.com/hooks/E5ke7shEsizw0QL0nnhv/webhook-trigger/c8d1afd2-f1e0-41cc-a075-d4a47d610a92';
    }

    /**
     * Convert file to base64
     * @param {Blob} blob - File blob
     * @returns {Promise<string>} Base64 string
     */
    async fileToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /**
     * Format seller net sheet data for Go High Level
     * @param {Object} formData - Form data including contact info
     * @param {Object} results - Calculator results
     * @param {Blob} pdfFile - Generated PDF file
     * @param {File} agentPhoto - Agent's photo file
     * @returns {Promise<Object>} Formatted data for GHL
     */
    async formatDataForGHL(formData, results, pdfFile, agentPhoto) {
        const netProceeds = results.salePrice - Object.values(results).reduce((sum, value) => sum + value, 605);

        // Convert files to base64
        const pdfBase64 = await this.fileToBase64(pdfFile);
        const photoBase64 = agentPhoto ? await this.fileToBase64(agentPhoto) : null;

        return {
            // Standard Contact Fields
            contact: {
                firstName: formData.firstName || '',
                lastName: formData.lastName || '',
                email: formData.email || '',
                phone: formData.phone || '',
                address1: formData.address || '',
                city: formData.city || '',
                state: formData.state || '',
                postalCode: formData.zip || '',
                source: 'Seller Net Sheet Calculator',
                type: 'Seller Lead',
                tags: ['Seller Calculator', 'Net Sheet Generated']
            },

            // Custom Fields
            customFields: {
                // Property Details
                property_address: formData.address || '',
                property_city: formData.city || '',
                property_state: formData.state || '',
                property_zip: formData.zip || '',

                // Calculator Results
                sale_price: '$' + parseInt(results.salePrice).toLocaleString('en-US', { maximumFractionDigits: 0 }),
                existing_mortgage: '$' + parseInt(results.existingMortgage).toLocaleString('en-US', { maximumFractionDigits: 0 }),
                commission_amount: '$' + parseInt(results.commission).toLocaleString('en-US', { maximumFractionDigits: 0 }),
                title_insurance: '$' + parseInt(results.titleInsurance).toLocaleString('en-US', { maximumFractionDigits: 0 }),
                property_taxes: '$' + parseInt(results.propertyTaxes).toLocaleString('en-US', { maximumFractionDigits: 0 }),
                other_fees: '$' + parseInt(results.otherFees).toLocaleString('en-US', { maximumFractionDigits: 0 }),
                estimated_net_proceeds: '$' + parseInt(netProceeds).toLocaleString('en-US', { maximumFractionDigits: 0 }),
                net_proceeds_positive: netProceeds >= 0 ? 'Yes' : 'No',

                // Agent Information
                referring_agent_name: formData.agentName || '',
                referring_agent_email: formData.agentEmail || '',
                referring_agent_phone: formData.agentPhone || '',
                referring_agent_title: formData.agentTitle || '',
                
                // Submission Details
                calculator_type: 'Seller Net Sheet',
                submission_date: new Date().toLocaleDateString(),
                submission_time: new Date().toLocaleTimeString(),
                source_url: typeof window !== 'undefined' ? window.location.href : 'Empire Title Website'
            },

            // Files
            files: {
                net_sheet_pdf: {
                    fileName: 'seller-net-sheet.pdf',
                    contentType: 'application/pdf',
                    content: pdfBase64
                },
                agent_photo: photoBase64 ? {
                    fileName: 'agent-photo.jpg',
                    contentType: 'image/jpeg',
                    content: photoBase64
                } : null
            }
        };
    }

    /**
     * Send data to Go High Level webhook
     * @param {Object} formData - Raw form data including contact info
     * @param {Object} results - Calculator results
     * @param {Blob} pdfFile - Generated PDF file
     * @param {File} agentPhoto - Agent's photo file
     * @returns {Promise} Webhook response
     */
    async handleFormSubmission(formData, results, pdfFile, agentPhoto) {
        try {
            // Format data for Go High Level
            const formattedData = await this.formatDataForGHL(formData, results, pdfFile, agentPhoto);
            
            // Send to GHL webhook
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            
            return {
                success: true,
                data: responseData
            };
        } catch (error) {
            console.error('Error sending to GHL webhook:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}
