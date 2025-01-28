import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { marked } from 'marked';

async function convertToPDF() {
    // Read the markdown and CSS files
    const markdown = readFileSync('./seller-net-sheet-template.md', 'utf8');
    const css = readFileSync('./style.css', 'utf8');

    // Convert markdown to HTML
    const html = marked(markdown);

    // Create full HTML document
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>${css}</style>
        </head>
        <body>
            ${html}
        </body>
        </html>
    `;

    // Launch browser and create PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(fullHtml);
    
    await page.pdf({
        path: 'seller-net-sheet-template.pdf',
        format: 'Letter',
        margin: {
            top: '40pt',
            right: '40pt',
            bottom: '40pt',
            left: '40pt'
        }
    });

    await browser.close();
    console.log('PDF generated successfully!');
}

convertToPDF().catch(console.error);
