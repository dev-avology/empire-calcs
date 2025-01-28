import { PDFGenerator } from '../pdf/PDFGenerator';

export class BuyerCalculator {
  constructor() {
    this.results = {
      purchasePrice: 0,
      downPayment: 0,
      loanAmount: 0,
      titleInsurance: 0,
      originationFee: 0,
      appraisalFee: 0,
      propertyTaxes: 0,
      homeInsurance: 0,
      otherFees: 0,
      totalClosingCosts: 0,
      totalCashNeeded: 0
    };
  }

  calculateClosingCosts(formData) {
    // Calculate results based on form data
    this.results = {
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      downPayment: (parseFloat(formData.purchasePrice) * (parseFloat(formData.downPaymentPercentage) / 100)) || 0,
      loanAmount: parseFloat(formData.purchasePrice) * (1 - parseFloat(formData.downPaymentPercentage) / 100) || 0,
      titleInsurance: this.calculateTitleInsurance(formData.purchasePrice),
      originationFee: (parseFloat(formData.loanAmount) * 0.01) || 0, // 1% origination fee
      appraisalFee: 500, // Standard appraisal fee
      propertyTaxes: parseFloat(formData.propertyTaxes) || 0,
      homeInsurance: parseFloat(formData.homeInsurance) || 0,
      otherFees: parseFloat(formData.otherFees) || 0
    };

    // Calculate total closing costs
    this.results.totalClosingCosts = 
      this.results.titleInsurance +
      this.results.originationFee +
      this.results.appraisalFee +
      this.results.propertyTaxes +
      this.results.homeInsurance +
      this.results.otherFees;

    // Calculate total cash needed
    this.results.totalCashNeeded = this.results.downPayment + this.results.totalClosingCosts;

    // Add blur class to results container
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
      resultsContainer.classList.add('results-blur');
    }

    return this.results;
  }

  calculateTitleInsurance(purchasePrice) {
    // Example title insurance calculation
    // Replace with actual title insurance calculation logic
    const baseRate = 5.75;
    const perThousandRate = 0.00575;
    return baseRate + ((parseFloat(purchasePrice) / 1000) * perThousandRate);
  }

  async generatePDF(formData) {
    const pdfGenerator = new PDFGenerator();
    // Use template 2 if real estate agent is selected
    const useTemplate2 = formData.hasRealEstateAgent === 'yes';
    const doc = await pdfGenerator.generateBuyerClosingCosts(this.results, formData, useTemplate2);
    doc.save('SellerNetSheet.pdf');
  }

  showResults() {
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
      resultsContainer.classList.remove('results-blur');
    }
  }
}
