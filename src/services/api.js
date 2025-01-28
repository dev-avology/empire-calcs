// API endpoints for all admin functionality
const API_BASE_URL = '/api';

export const api = {
    // Calculator endpoints
    calculators: {
        list: async () => {
            const response = await fetch(\`\${API_BASE_URL}/calculators\`);
            return response.json();
        },
        create: async (data) => {
            const response = await fetch(\`\${API_BASE_URL}/calculators\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return response.json();
        },
        update: async (id, data) => {
            const response = await fetch(\`\${API_BASE_URL}/calculators/\${id}\`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(\`\${API_BASE_URL}/calculators/\${id}\`, {
                method: 'DELETE'
            });
            return response.json();
        },
        clone: async (id) => {
            const response = await fetch(\`\${API_BASE_URL}/calculators/\${id}/clone\`, {
                method: 'POST'
            });
            return response.json();
        }
    },

    // Submission endpoints
    submissions: {
        list: async (filters = {}) => {
            const params = new URLSearchParams(filters);
            const response = await fetch(\`\${API_BASE_URL}/submissions?\${params}\`);
            return response.json();
        },
        get: async (id) => {
            const response = await fetch(\`\${API_BASE_URL}/submissions/\${id}\`);
            return response.json();
        },
        resendWebhook: async (id) => {
            const response = await fetch(\`\${API_BASE_URL}/submissions/\${id}/resend-webhook\`, {
                method: 'POST'
            });
            return response.json();
        },
        getPdf: async (id) => {
            const response = await fetch(\`\${API_BASE_URL}/submissions/\${id}/pdf\`);
            return response.blob();
        }
    },

    // Agent endpoints
    agents: {
        list: async () => {
            const response = await fetch(\`\${API_BASE_URL}/agents\`);
            return response.json();
        },
        create: async (formData) => {
            const response = await fetch(\`\${API_BASE_URL}/agents\`, {
                method: 'POST',
                body: formData // Using FormData for file upload
            });
            return response.json();
        },
        update: async (id, formData) => {
            const response = await fetch(\`\${API_BASE_URL}/agents/\${id}\`, {
                method: 'PUT',
                body: formData // Using FormData for file upload
            });
            return response.json();
        },
        delete: async (id) => {
            const response = await fetch(\`\${API_BASE_URL}/agents/\${id}\`, {
                method: 'DELETE'
            });
            return response.json();
        },
        toggleActive: async (id, active) => {
            const response = await fetch(\`\${API_BASE_URL}/agents/\${id}/toggle-active\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active })
            });
            return response.json();
        }
    },

    // Dashboard endpoints
    dashboard: {
        getStats: async () => {
            const response = await fetch(\`\${API_BASE_URL}/dashboard/stats\`);
            return response.json();
        },
        getSubmissionTrends: async (period = '7d') => {
            const response = await fetch(\`\${API_BASE_URL}/dashboard/trends?period=\${period}\`);
            return response.json();
        },
        getRecentActivity: async () => {
            const response = await fetch(\`\${API_BASE_URL}/dashboard/activity\`);
            return response.json();
        }
    }
};
