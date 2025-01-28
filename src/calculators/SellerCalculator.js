import { PDFGenerator } from '../services/PDFGenerator.js';
import { WebhookService } from '../services/WebhookService.js';

export class SellerCalculator extends Calculator {
  constructor() {
    super();
    this.formData = {};
    this.pdfGenerator = new PDFGenerator();
    this.webhookService = new WebhookService();
    this.results = {
      salePrice: 0,
      existingMortgage: 0,
      commission: 0,
      settlementFee: 350,
      deedPreparation: 150,
      releaseTracking: 75,
      wireTransfer: 30,
      titleInsurance: 0,
      propertyTaxes: 0,
      otherFees: 0,
      totalClosingCosts: 0,
      totalDeductions: 0
    };
  }

  render() {
    return `
      <div class="calculator-container">
        <button class="btn btn-link mb-4" onclick="document.querySelector('.container.mt-5').classList.remove('d-none'); document.getElementById('calculator-container').classList.add('d-none');">
          <i class="fas fa-arrow-left"></i> Back to Calculators
        </button>
        <h2>Seller Net Sheet Calculator</h2>
        <form id="sellerForm" class="calculator-form">
          <div class="form-section">
            <div class="form-group mb-3">
              <label for="salePrice">Sale Price</label>
              <input type="text" 
                     id="salePrice" 
                     name="salePrice" 
                     class="form-control currency-input" 
                     pattern="^\\$?\\d{0,9}$"
                     maxlength="12"
                     inputmode="numeric"
                     required>
            </div>
            <div class="form-group mb-3">
              <label for="existingMortgage">Existing Mortgage Balance</label>
              <input type="text" 
                     id="existingMortgage" 
                     name="existingMortgage" 
                     class="form-control currency-input" 
                     pattern="^\\$?\\d{0,9}$"
                     maxlength="12"
                     inputmode="numeric"
                     required>
            </div>
            <div class="form-group mb-3">
              <label for="propertyTaxes">Property Taxes Due</label>
              <input type="text" 
                     id="propertyTaxes" 
                     name="propertyTaxes" 
                     class="form-control currency-input" 
                     pattern="^\\$?\\d{0,9}$"
                     maxlength="12"
                     inputmode="numeric"
                     required>
            </div>
            <div class="form-group mb-3">
              <label for="otherFees">Other Fees</label>
              <input type="text" 
                     id="otherFees" 
                     name="otherFees" 
                     class="form-control currency-input" 
                     pattern="^\\$?\\d{0,9}$"
                     maxlength="12"
                     inputmode="numeric"
                     required>
            </div>
            <button type="submit" class="btn btn-primary">Calculate</button>
          </div>
        </form>
        <div id="results" class="mt-4" style="display: none;">
          <h3>Results</h3>
          <div class="results-grid">
            <div class="result-item">
              <label>Sale Price:</label>
              <span id="result-salePrice"></span>
            </div>
            <div class="result-item">
              <label>Total Expenses:</label>
              <span id="result-totalExpenses"></span>
            </div>
            <div class="result-item">
              <label>Net Proceeds:</label>
              <span id="result-netProceeds"></span>
            </div>
          </div>
        </div>
        <div class="popup-form d-none">
          <h3>Additional Information</h3>
          <form id="additionalInfoForm">
            <div class="mb-3">
              <label for="propertyAddress" class="form-label">Property Address</label>
              <input type="text" class="form-control" id="propertyAddress" placeholder="Enter address or TBD">
            </div>
            
            <div class="mb-3">
              <label for="isAgent" class="form-label">Are you a real estate agent or lender?</label>
              <select class="form-control" id="isAgent">
                <option value="">Please select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div id="coBrandSection" class="mb-3 d-none">
              <label for="wantCoBrand" class="form-label">Would you like to co-brand the calculator results?</label>
              <select class="form-control" id="wantCoBrand">
                <option value="">Please select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div id="partnerSection" class="d-none">
              <div class="mb-3">
                <label for="partnerName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="partnerName">
              </div>
              <div class="mb-3">
                <label for="partnerTitle" class="form-label">Title</label>
                <input type="text" class="form-control" id="partnerTitle">
              </div>
              <div class="mb-3">
                <label for="partnerPhone" class="form-label">Phone</label>
                <input type="tel" class="form-control" id="partnerPhone">
              </div>
              <div class="mb-3">
                <label for="partnerEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="partnerEmail">
              </div>
              <div class="mb-3">
                <label for="partnerImage" class="form-label">Profile Image</label>
                <input type="file" class="form-control" id="partnerImage" accept="image/*">
              </div>
            </div>

            <button type="submit" class="btn btn-primary">Generate PDF</button>
          </form>
        </div>
      </div>
    `;
  }

  bindEvents() {
    console.log('Binding events...');
    const form = document.getElementById('sellerForm');
    if (form) {
      console.log('Found form, adding submit listener');
      form.addEventListener('submit', (e) => {
        console.log('Form submitted');
        e.preventDefault();
        
        // Get values and remove currency formatting
        const salePrice = parseInt(document.getElementById('salePrice').value.replace(/[^\d]/g, ''));
        const existingMortgage = parseInt(document.getElementById('existingMortgage').value.replace(/[^\d]/g, ''));
        const propertyTaxes = parseInt(document.getElementById('propertyTaxes').value.replace(/[^\d]/g, ''));
        const otherFees = parseInt(document.getElementById('otherFees').value.replace(/[^\d]/g, ''));

        console.log('Values:', { salePrice, existingMortgage, propertyTaxes, otherFees });

        // Calculate totals
        const totalExpenses = existingMortgage + propertyTaxes + otherFees;
        const netProceeds = salePrice - totalExpenses;

        console.log('Totals:', { totalExpenses, netProceeds });

        // Show results in an alert for now
        alert(`
          Sale Price: $${salePrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
          Total Expenses: $${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
          Net Proceeds: $${netProceeds.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
        `);
      });
    } else {
      console.error('Form not found');
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  async handlePDFGeneration(e) {
    e.preventDefault();
    
    const formData = {
      propertyAddress: document.getElementById('propertyAddress').value,
      isAgent: document.getElementById('isAgent').value,
      usePartnerTemplate: document.getElementById('isAgent').value === 'yes' && 
                        document.getElementById('wantCoBrand').value === 'yes'
    };

    if (formData.usePartnerTemplate) {
      formData.partnerInfo = {
        name: document.getElementById('partnerName').value,
        title: document.getElementById('partnerTitle').value,
        phone: document.getElementById('partnerPhone').value,
        email: document.getElementById('partnerEmail').value
      };

      const imageFile = document.getElementById('partnerImage').files[0];
      if (imageFile) {
        formData.partnerInfo.image = await this.readFileAsDataURL(imageFile);
      }
    }

    console.log('Form Data:', formData);

    // Generate PDF with appropriate template
    this.generatePDF(formData);
  }

  async readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async generatePDF(formData) {
    try {
      console.log('Generating PDF...');
      // Generate PDF
      const doc = await this.pdfGenerator.generateSellerNetSheet(formData);
      
      console.log('PDF generated:', doc);

      // Send to webhook
      const webhookResponse = await this.webhookService.handleFormSubmission(formData, doc);
      
      console.log('Webhook response:', webhookResponse);

      if (!webhookResponse.success) {
        console.error('Webhook error:', webhookResponse.error);
      }
      
      return {
        success: true,
        webhookResponse,
        pdf: doc
      };
    } catch (error) {
      console.error('Error in form submission:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}