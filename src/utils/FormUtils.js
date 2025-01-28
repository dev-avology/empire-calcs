export class FormUtils {
    static formatCurrency(input) {
        // Remove all non-numeric characters
        let value = input.value.replace(/[^\d]/g, '');
        
        if (value) {
            const number = parseInt(value);
            if (!isNaN(number)) {
                const limitedNumber = Math.min(number, 999999999);
                input.value = '$' + limitedNumber.toLocaleString('en-US', {
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
        let value = input.value.replace(/[^\d]/g, '');
        
        if (value) {
            const number = parseInt(value);
            if (!isNaN(number)) {
                input.value = number.toString() + '%';
            }
        } else {
            input.value = '0%';
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

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
                if (!firstInvalid) firstInvalid = field;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (!isValid && firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return isValid;
    }

    static bindFormEvents(form) {
        // Bind currency formatters
        form.querySelectorAll('.currency-input').forEach(input => {
            input.addEventListener('blur', () => FormUtils.formatCurrency(input));
            input.addEventListener('focus', () => {
                input.value = input.value.replace(/[^\d]/g, '');
            });
        });

        // Bind percentage formatters
        form.querySelectorAll('.percentage-input').forEach(input => {
            input.addEventListener('blur', () => FormUtils.formatPercentage(input));
            input.addEventListener('focus', () => {
                input.value = input.value.replace(/[^\d]/g, '');
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
