const axios = require('axios');

module.exports = {
    async get(url, token) {
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };
    
        const { data } = await axios.get(url, config);
    
        return data;
    }
}