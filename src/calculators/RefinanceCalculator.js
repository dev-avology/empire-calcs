import { PDFGenerator } from '../pdf/PDFGenerator';

export class RefinanceCalculator {
  constructor() {
    this.results = {
      loanAmount: 0,
      homeValue: 0,
      titleInsurance: 0,
      originationFee: 0,
      appraisalFee: 0,
      recordingFees: 0,
      creditReport: 0,
      otherFees: 0,
      totalClosingCosts: 0,
      monthlyPayment: 0
    };
  }

  calculateRefinanceCosts(formData) {
    // Calculate results based on form data
    this.results = {
      loanAmount: parseFloat(formData.loanAmount) || 0,
      homeValue: parseFloat(formData.homeValue) || 0,
      titleInsurance: this.calculateTitleInsurance(formData.loanAmount),
      originationFee: (parseFloat(formData.loanAmount) * 0.01) || 0, // 1% origination fee
      appraisalFee: 500, // Standard appraisal fee
      recordingFees: 125, // Standard recording fees
      creditReport: 50, // Standard credit report fee
      otherFees: parseFloat(formData.otherFees) || 0
    };

    // Calculate total closing costs
    this.results.totalClosingCosts = 
      this.results.titleInsurance +
      this.results.originationFee +
      this.results.appraisalFee +
      this.results.recordingFees +
      this.results.creditReport +
      this.results.otherFees;

    // Calculate monthly payment (if interest rate and term provided)
    if (formData.interestRate && formData.loanTerm) {
      const monthlyRate = (parseFloat(formData.interestRate) / 100) / 12;
      const numberOfPayments = parseFloat(formData.loanTerm) * 12;
      this.results.monthlyPayment = this.calculateMonthlyPayment(
        this.results.loanAmount,
        monthlyRate,
        numberOfPayments
      );
    }

    return this.results;
  }

  calculateTitleInsurance(loanAmount) {
    // Example title insurance calculation
    // Replace with actual title insurance calculation logic
    const baseRate = 5.75;
    const perThousandRate = 0.00575;
    return baseRate + ((parseFloat(loanAmount) / 1000) * perThousandRate);
  }

  calculateMonthlyPayment(principal, monthlyRate, numberOfPayments) {
    return (
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );
  }

  async generatePDF(formData) {
    const pdfGenerator = new PDFGenerator();
    const doc = await pdfGenerator.generateRefinanceCalculator(this.results, formData);
    doc.save('RefinanceCalculator.pdf');
  }
}
