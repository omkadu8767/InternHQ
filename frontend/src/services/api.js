// API Configuration
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api';

// API utility class
class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get full API URL
    getApiUrl(endpoint = '') {
        return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    }

    // Get base URL without /api
    getBaseUrl() {
        return this.baseURL.replace('/api', '');
    }
}

// Export singleton instance
export default new ApiService();