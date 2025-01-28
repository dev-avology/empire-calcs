# Empire Calculators Project Structure

## Important Files
- PDF Templates (Final Versions):
  - `/seller-net-sheet-template1.pdf` (154,919 bytes)
  - `/seller-net-sheet-template2.pdf` (158,778 bytes)

## Directory Structure
```
empire-calculators/
├── public/
│   ├── images/
│   │   └── empire-logo.png
│   ├── js/
│   │   └── main.js
│   ├── libs/
│   ├── pdf-templates/
│   ├── styles/
│   │   └── main.css
│   └── index.html
├── src/
│   ├── calculators/
│   │   ├── BuyerCalculator.js
│   │   ├── RefinanceCalculator.js
│   │   └── SellerCalculator.js
│   ├── services/
│   │   ├── PDFGenerator.js
│   │   └── WebhookService.js
│   └── utils/
│       └── formatters.js
├── package.json
└── README.md
```

## Core Components
1. **Calculator Logic**
   - `src/calculators/SellerCalculator.js`: Main seller net sheet calculator
   - `src/calculators/BuyerCalculator.js`: Buyer estimate calculator

2. **PDF Generation**
   - `src/services/PDFGenerator.js`: Handles PDF generation with templates
   - Final templates in root directory

3. **Services**
   - `src/services/WebhookService.js`: Handles GHL webhook integration

4. **Frontend**
   - `public/index.html`: Main calculator interface
   - `public/js/main.js`: Frontend JavaScript
   - `public/styles/main.css`: Styling

## Important Notes
- The PDF templates are finalized and stored in the root directory
- The calculators are integrated with Go High Level (GHL) webhook
- The project uses ES modules
- Core dependencies: jsPDF, jsPDF-autotable, and Bootstrap

## Next Steps
1. Test the seller calculator with the finalized PDF template
2. Ensure webhook integration is working correctly
3. Clean up any remaining test files
