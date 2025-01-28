// Calculator Factory
class CalculatorFactory {
    static createCalculator(type) {
        switch(type) {
            case 'seller':
                return new SellerCalculator();
            case 'buyer':
                return new BuyerCalculator();
            case 'refinance':
                return new RefinanceCalculator();
            default:
                throw new Error(`Unknown calculator type: ${type}`);
        }
    }
}

// Base Calculator Class
class Calculator {
    constructor() {
        this.results = {};
    }

    calculate() {
        throw new Error('Calculate method must be implemented');
    }

    render() {
        throw new Error('Render method must be implemented');
    }

    formatCurrency(amount) {
        const number = parseInt(amount);
        if (isNaN(number)) return '$0';
        return '$' + number.toLocaleString('en-US', {
            maximumFractionDigits: 0,
            useGrouping: true
        });
    }

    bindEvents() {
        throw new Error('BindEvents method must be implemented');
    }
}

// Form Validation and Formatting
class FormUtils {
    static formatCurrency(input) {
        // Remove all non-numeric characters
        let value = input.value.replace(/[^\d]/g, '');
        
        // Convert to integer and enforce maximum value
        if (value) {
            let number = parseInt(value);
            if (!isNaN(number)) {
                number = Math.min(number, 999999999);
                input.value = '$' + number.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                    useGrouping: true
                });
            }
        } else {
            input.value = '$0';
        }
    }

    static formatPercentage(input) {
        // Remove all non-numeric characters
        let value = input.value.replace(/[^0-9]/g, '');
        
        // Format the number as whole number percentage
        if (value) {
            const number = parseInt(value);
            if (!isNaN(number)) {
                input.value = number.toString();
            }
        }
    }

    static formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                input.value = value;
            } else if (value.length <= 6) {
                input.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                input.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
    }

    static validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalid = null;

        // Special handling for property address
        const addressField = form.querySelector('#propertyAddress');
        if (addressField) {
            const addressValue = addressField.value.trim();
            if (!addressValue || (addressValue.toLowerCase() !== 'tbd' && addressValue.length < 5)) {
                isValid = false;
                addressField.classList.add('is-invalid');
                if (!firstInvalid) firstInvalid = addressField;
            } else {
                addressField.classList.remove('is-invalid');
            }
        }

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
                if (!firstInvalid) firstInvalid = field;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return isValid;
    }

    static bindFormEvents(form) {
        // Bind currency formatters
        form.querySelectorAll('.currency-input').forEach(input => {
            input.addEventListener('blur', () => FormUtils.formatCurrency(input));
            input.addEventListener('focus', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
            });
        });

        // Bind percentage formatters
        form.querySelectorAll('.percentage-input').forEach(input => {
            input.addEventListener('blur', () => FormUtils.formatPercentage(input));
            input.addEventListener('focus', () => {
                input.value = input.value.replace(/[^0-9]/g, '');
            });
        });

        // Bind phone number formatters
        form.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', () => FormUtils.formatPhoneNumber(input));
        });

        // Handle form reset
        const resetBtn = form.querySelector('#reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                form.reset();
                form.querySelectorAll('.is-invalid').forEach(field => {
                    field.classList.remove('is-invalid');
                });
                document.getElementById('results').style.display = 'none';
            });
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const calculatorContainer = document.getElementById('calculator-container');
    
    // Create and initialize the seller calculator by default
    const calculator = new SellerCalculator();
    calculatorContainer.innerHTML = calculator.render();
    calculator.bindEvents();

    // Add currency formatting to all currency inputs
    document.querySelectorAll('.currency-input').forEach(input => {
        // Prevent non-numeric input including decimals
        input.addEventListener('keypress', (e) => {
            if (!/\d/.test(e.key)) {
                e.preventDefault();
            }
        });

        // Format on input
        input.addEventListener('input', (e) => {
            // Remove any non-numeric characters
            let value = e.target.value.replace(/[^\d]/g, '');
            console.log('Raw input value:', e.target.value); // Debugging log
            console.log('Processed value:', value); // Debugging log
            
            if (value) {
                let number = parseInt(value);
                console.log('Parsed number:', number); // Debugging log
                if (!isNaN(number)) {
                    number = Math.min(number, 999999999);
                    e.target.value = '$' + number.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                        useGrouping: true
                    });
                    console.log('Formatted value:', e.target.value); // Debugging log
                }
            } else {
                e.target.value = '$0';
            }
        });

        // Clear formatting on focus
        input.addEventListener('focus', (e) => {
            let value = e.target.value.replace(/[^\d]/g, '');
            e.target.value = value;
        });

        // Reapply formatting on blur
        input.addEventListener('blur', (e) => {
            let rawValue = e.target.value.replace(/[^\d]/g, '');
            let numValue = parseInt(rawValue || 0);
            e.target.value = formatAsCurrency(numValue);
        });
    });

    // Add explicit check for decimals
    document.querySelectorAll('.currency-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            if (e.target.value.includes('.')) {
                e.target.value = e.target.value.split('.')[0];
            }
        });
    });

    // Add currency formatting to specific fields
    const currencyFields = [
        'salePrice',
        'existingMortgage',
        'propertyTaxes',
        'otherFees'
    ];

    currencyFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', function() {
                formatCurrency(this);
            });
            input.addEventListener('blur', function() {
                formatCurrency(this);
            });
        }
    });
});

// Form logic for agent/lender and co-branding
const isAgentSelect = document.getElementById('isAgent');
const coBrandSection = document.getElementById('coBrandSection');
const wantCoBrandSelect = document.getElementById('wantCoBrand');
const partnerSection = document.getElementById('partnerSection');

if (isAgentSelect) {
    isAgentSelect.addEventListener('change', function() {
        if (this.value === 'yes') {
            coBrandSection.classList.remove('d-none');
        } else {
            coBrandSection.classList.add('d-none');
            wantCoBrandSelect.value = '';
            partnerSection.classList.add('d-none');
        }
    });
}

if (wantCoBrandSelect) {
    wantCoBrandSelect.addEventListener('change', function() {
        if (this.value === 'yes') {
            partnerSection.classList.remove('d-none');
        } else {
            partnerSection.classList.add('d-none');
        }
    });
}

// Form submission handler
const additionalInfoForm = document.getElementById('additionalInfoForm');
if (additionalInfoForm) {
    additionalInfoForm.addEventListener('submit', async function(e) {
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
                email: document.getElementById('partnerEmail').value,
                image: await readFileAsDataURL(document.getElementById('partnerImage').files[0])
            };
        }

        // Generate PDF with appropriate template
        generatePDF(formData);
    });
}

const calculatorCards = document.querySelectorAll('.calculator-card');
const container = document.getElementById('calculator-container');
const mainContent = document.querySelector('.container.mt-5');
const breadcrumbContainer = document.createElement('nav');
breadcrumbContainer.setAttribute('aria-label', 'breadcrumb');
breadcrumbContainer.className = 'breadcrumb-nav mb-3';
mainContent.insertBefore(breadcrumbContainer, container);

// Function to update breadcrumbs
function updateBreadcrumbs(steps) {
    breadcrumbContainer.innerHTML = `
        <ol class="breadcrumb">
            ${steps.map((step, index) => `
                <li class="breadcrumb-item ${index === steps.length - 1 ? 'active' : ''}">
                    ${index === steps.length - 1 ? step : `<a href="#" data-step="${index}">${step}</a>`}
                </li>
            `).join('')}
        </ol>
    `;
}

// Add close button to forms
function addCloseButton(element) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.style.position = 'absolute';
    closeButton.style.right = '1rem';
    closeButton.style.top = '1rem';
    
    closeButton.addEventListener('click', () => {
        element.style.display = 'none';
        container.style.display = 'flex';
        updateBreadcrumbs(['Calculator Selection']);
    });
    
    element.insertBefore(closeButton, element.firstChild);
}

// Add close buttons to existing forms
document.querySelectorAll('.calculator-form, .popup-form').forEach(addCloseButton);

// Initialize with calculator selection breadcrumb
updateBreadcrumbs(['Calculator Selection']);

calculatorCards.forEach(card => {
    card.addEventListener('click', function() {
        const calculatorType = this.dataset.calculator;
        container.style.display = 'none';
        
        const calculator = CalculatorFactory.createCalculator(calculatorType);
        const form = document.querySelector(`.calculator-form[data-calculator="${calculatorType}"]`);
        
        if (form) {
            form.style.display = 'block';
            updateBreadcrumbs(['Calculator Selection', `${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Calculator`]);
        }
    });
});

// Add breadcrumb navigation
breadcrumbContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        const step = parseInt(e.target.dataset.step);
        
        if (step === 0) {
            // Return to calculator selection
            document.querySelectorAll('.calculator-form, .popup-form').forEach(form => {
                form.style.display = 'none';
            });
            container.style.display = 'flex';
            updateBreadcrumbs(['Calculator Selection']);
        }
    }
});

const partnerSection = document.createElement('div');
partnerSection.id = 'partnerSection';
partnerSection.style.display = 'none';

const partnerFields = `
    <div class="form-group">
        <label for="isPartner">Are you an agent or lender?</label>
        <select id="isPartner" class="form-control">
            <option value="no">No</option>
            <option value="yes">Yes</option>
        </select>
    </div>
    <div id="partnerDetails" style="display: none;">
        <div class="form-group">
            <label for="partnerName">Full Name</label>
            <input type="text" id="partnerName" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="partnerTitle">Title</label>
            <input type="text" id="partnerTitle" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="partnerPhone">Phone</label>
            <input type="tel" id="partnerPhone" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="partnerEmail">Email</label>
            <input type="email" id="partnerEmail" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="partnerImage">Profile Image</label>
            <input type="file" id="partnerImage" class="form-control" accept="image/*" required>
        </div>
    </div>
`;

partnerSection.innerHTML = partnerFields;
document.querySelector('.popup-form').appendChild(partnerSection);

// Add event listener for partner selection
document.getElementById('isPartner').addEventListener('change', function() {
    const partnerDetails = document.getElementById('partnerDetails');
    partnerDetails.style.display = this.value === 'yes' ? 'block' : 'none';
    
    // Clear partner fields if "no" is selected
    if (this.value === 'no') {
        document.getElementById('partnerName').value = '';
        document.getElementById('partnerTitle').value = '';
        document.getElementById('partnerPhone').value = '';
        document.getElementById('partnerEmail').value = '';
        document.getElementById('partnerImage').value = '';
    }
});

// Update form submission to handle partner information
document.querySelector('.popup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!FormUtils.validateForm(this)) {
        console.log('Form validation failed');
        return;
    }

    const formData = new FormData(this);
    const isPartner = formData.get('isPartner') === 'yes';
    const templatePath = isPartner ? 
        'seller-net-sheet-template-partner.html' : 
        'seller-net-sheet-template.html';
    
    console.log('Form Data:', Object.fromEntries(formData));
    console.log('Selected template:', templatePath);

    try {
        // Convert FormData to JSON
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        // Add template information
        jsonData.templatePath = templatePath;
        
        console.log('Sending data to webhook:', jsonData);

        // Send data to webhook
        const response = await fetch('https://services.leadconnectorhq.com/hooks/E5ke7shEsizw0QL0nnhv/webhook-trigger/c8d1afd2-f1e0-41cc-a075-d4a47d610a92', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (!response.ok) {
            console.error('Webhook response not OK:', response.status, response.statusText);
            throw new Error('Failed to submit form');
        }

        const responseData = await response.text();
        console.log('Webhook response:', responseData);

        // Show thank you popup
        const thankYouPopup = document.createElement('div');
        thankYouPopup.className = 'popup thank-you-popup';
        thankYouPopup.innerHTML = `
            <div class="popup-content">
                <h3>Thank You!</h3>
                <p>Your form has been submitted successfully. We'll process your request and get back to you shortly.</p>
                <button class="close-btn">Close</button>
            </div>
        `;
        document.body.appendChild(thankYouPopup);

        // Close popup on button click or when clicking outside
        thankYouPopup.addEventListener('click', (e) => {
            if (e.target === thankYouPopup || e.target.classList.contains('close-btn')) {
                thankYouPopup.remove();
                this.reset();
                // Reset any error states
                this.querySelectorAll('.is-invalid').forEach(field => {
                    field.classList.remove('is-invalid');
                });
            }
        });

    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting your form. Please try again.');
    }
});

// Helper function to read file as Data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Format currency inputs
function formatAsCurrency(num) {
    return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
