import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

export class PDFGenerator {
  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    });
    
    // Define brand colors
    this.colors = {
      empireRed: '#E31837',
      darkGray: '#333333',
      mediumGray: '#666666',
      lightGray: '#999999',
      white: '#FFFFFF',
      shadowGray: '#E0E0E0'
    };

    // Load images as base64
    const logoPath = path.join(process.cwd(), 'public', 'images', 'empire-title-logo-landscape.jpg');
    const missyPath = path.join(process.cwd(), 'public', 'images', 'missy.horner.jpg');
    
    this.logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
    this.missyBase64 = fs.readFileSync(missyPath, { encoding: 'base64' });
  }

  // Helper function to draw a box with shadow and 3D effect
  drawBox(x, y, width, height, fillColor = '#FFFFFF') {
    const shadowOffset = 4;
    const shadowBlur = 3;
    
    // Draw shadow
    this.doc.setFillColor('#CCCCCC');
    this.doc.rect(x + shadowOffset, y + shadowOffset, width, height, 'F');
    
    // Draw main box
    this.doc.setFillColor(fillColor);
    this.doc.rect(x, y, width, height, 'F');
    
    // Draw 3D effect (top and left highlight)
    this.doc.setDrawColor('#FFFFFF');
    this.doc.setLineWidth(2);
    this.doc.line(x, y + height, x, y); // left
    this.doc.line(x, y, x + width, y); // top
    
    // Draw 3D effect (bottom and right shadow)
    this.doc.setDrawColor('#BBBBBB');
    this.doc.line(x + width, y, x + width, y + height); // right
    this.doc.line(x, y + height, x + width, y + height); // bottom
  }

  async generateSellerNetSheet(results, formData, template = 1) {
    const pageWidth = this.doc.internal.pageSize.width;
    let yPos = 30;
    
    // Add Empire Title Logo - centered with 1.5x size
    try {
      const logoWidth = 270;
      const logoHeight = 81;
      const xPos = (pageWidth - logoWidth) / 2;
      this.doc.addImage(
        'data:image/jpeg;base64,' + this.logoBase64,
        'JPEG',
        xPos,
        yPos,
        logoWidth,
        logoHeight
      );
    } catch (error) {
      console.error('Error loading logo:', error);
    }
    yPos += 100;

    // Add title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(20);
    this.doc.setTextColor(this.colors.empireRed);
    this.doc.text('SELLER NET SHEET', pageWidth / 2, yPos, { align: 'center' });
    yPos += 25;

    // Property Information - only if includeAddress is true
    if (formData.includeAddress) {
      this.doc.setFontSize(11);
      this.doc.setTextColor(this.colors.darkGray);
      const address = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`;
      this.doc.text(address, pageWidth / 2, yPos, { align: 'center' });
      yPos += 35;
    } else {
      yPos += 10; // Less spacing if no address
    }

    // Create sections with 3D effect
    const sections = [
      {
        title: 'CREDITS',
        items: [
          ['Sale Price:', results.salePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })]
        ]
      },
      {
        title: 'DEBITS',
        items: [
          ['Existing Mortgage:', results.existingMortgage.toLocaleString('en-US', { style: 'currency', currency: 'USD' })],
          ['Commission:', results.commission.toLocaleString('en-US', { style: 'currency', currency: 'USD' })],
          ['Title Insurance:', results.titleInsurance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })],
          ['Property Taxes:', results.propertyTaxes.toLocaleString('en-US', { style: 'currency', currency: 'USD' })],
          ['Settlement Fee:', '$350.00'],
          ['Deed Preparation:', '$150.00'],
          ['Release Tracking:', '$75.00'],
          ['Wire Transfer:', '$30.00'],
          ['Other Fees:', results.otherFees.toLocaleString('en-US', { style: 'currency', currency: 'USD' })]
        ]
      }
    ];

    // Render sections with 3D effect
    sections.forEach(section => {
      // Draw section container with shadow
      const sectionHeight = section.items.length * 30 + 60;
      this.drawBox(40, yPos, pageWidth - 80, sectionHeight);
      
      // Section header with red background
      this.doc.setFillColor(this.colors.empireRed);
      this.doc.rect(40, yPos, pageWidth - 80, 30, 'F');
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(12);
      this.doc.setTextColor(this.colors.white);
      this.doc.text(section.title, 55, yPos + 20);
      yPos += 45;

      // Section items
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(this.colors.darkGray);
      section.items.forEach(([label, value]) => {
        this.doc.text(label, 60, yPos);
        this.doc.text(value, pageWidth - 60, yPos, { align: 'right' });
        yPos += 25;
      });
      yPos += 25;
    });

    // Calculate totals
    const totalDebits = Object.values(results).reduce((sum, value) => sum + value, 605);
    const netProceeds = results.salePrice - totalDebits;

    // Add total section
    yPos += 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ESTIMATED NET PROCEEDS:', 60, yPos);

    // Format net proceeds with bold and red if negative
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    if (netProceeds < 0) {
      this.doc.setTextColor(this.colors.empireRed);
    } else {
      this.doc.setTextColor(this.colors.darkGray);
    }
    this.doc.text(
      netProceeds.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      pageWidth - 60,
      yPos,
      { align: 'right' }
    );

    // Reset text color for the rest of the document
    this.doc.setTextColor(this.colors.darkGray);

    // Add generation date and disclaimer on one line with smaller font
    yPos += 15;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(7);
    this.doc.setTextColor(this.colors.mediumGray);
    this.doc.text(`Generated: ${new Date('2025-01-15').toLocaleDateString()} | This is an estimate only. Actual proceeds may vary.`, 60, yPos);

    if (template === 2) {
      this.addCobrandandFooter(formData.partner);
    } else {
      this.addFooter();
    }
    return this.doc;
  }

  addFooter() {
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;
    let y = pageHeight - 120;

    // Add contact information in a larger container with 3D effect
    try {
      // Draw contact container with shadow and 3D effect
      const containerWidth = 250;
      const containerHeight = 100;
      const containerX = pageWidth - containerWidth - 40;
      const containerY = y - 40;
      
      this.drawBox(containerX, containerY, containerWidth, containerHeight);
      
      // Add Missy's photo
      const photoSize = 80;
      this.doc.addImage(
        'data:image/jpeg;base64,' + this.missyBase64,
        'JPEG',
        containerX + 10,
        containerY + 10,
        photoSize,
        photoSize
      );
      
      // Add contact details - aligned with photo
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(14);
      this.doc.setTextColor(this.colors.empireRed);
      this.doc.text('Missy Horner', containerX + photoSize + 20, containerY + 30);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(11);
      this.doc.setTextColor(this.colors.darkGray);
      this.doc.text('Empire Title', containerX + photoSize + 20, containerY + 50);
      this.doc.text('(765) 935-9966', containerX + photoSize + 20, containerY + 70);
      this.doc.text('missy@empiretitleservice.com', containerX + photoSize + 20, containerY + 90);
    } catch (error) {
      console.error('Error adding contact information:', error);
    }
  }

  addCobrandandFooter(partner) {
    const pageHeight = this.doc.internal.pageSize.height;
    const pageWidth = this.doc.internal.pageSize.width;
    let y = pageHeight - 120;

    // Container dimensions (same as Missy's container)
    const containerWidth = 250;
    const containerHeight = 100;
    
    // Add Missy's container on the right
    const missyContainerX = pageWidth - containerWidth - 40;
    const containerY = y - 40;
    
    this.drawBox(missyContainerX, containerY, containerWidth, containerHeight);
    
    try {
      // Add Missy's photo and info (right container)
      const photoSize = 80;
      this.doc.addImage(
        'data:image/jpeg;base64,' + this.missyBase64,
        'JPEG',
        missyContainerX + 10,
        containerY + 10,
        photoSize,
        photoSize
      );
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(14);
      this.doc.setTextColor(this.colors.empireRed);
      this.doc.text('Missy Horner', missyContainerX + photoSize + 20, containerY + 30);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(11);
      this.doc.setTextColor(this.colors.darkGray);
      this.doc.text('Empire Title', missyContainerX + photoSize + 20, containerY + 50);
      this.doc.text('(765) 935-9966', missyContainerX + photoSize + 20, containerY + 70);
      this.doc.text('missy@empiretitleservice.com', missyContainerX + photoSize + 20, containerY + 90);

      // Add partner container on the left
      const partnerContainerX = 40;
      this.drawBox(partnerContainerX, containerY, containerWidth, containerHeight);
      
      // Add partner info (placeholder - replace with actual partner data)
      if (partner?.photo) {
        this.doc.addImage(
          partner.photo,
          'JPEG',
          partnerContainerX + 10,
          containerY + 10,
          photoSize,
          photoSize
        );
      }
      
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(14);
      this.doc.setTextColor(this.colors.empireRed);
      this.doc.text(partner?.name || 'Partner Name', partnerContainerX + photoSize + 20, containerY + 30);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(11);
      this.doc.setTextColor(this.colors.darkGray);
      this.doc.text(partner?.company || 'Company Name', partnerContainerX + photoSize + 20, containerY + 50);
      this.doc.text(partner?.phone || '(XXX) XXX-XXXX', partnerContainerX + photoSize + 20, containerY + 70);
      this.doc.text(partner?.email || 'email@example.com', partnerContainerX + photoSize + 20, containerY + 90);
    } catch (error) {
      console.error('Error adding contact information:', error);
    }
  }
}