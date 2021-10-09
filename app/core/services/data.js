const httpAdapter = require('../../infra/http');
const { TOKEN } = require('../../help/constants/github-api');


class DataService {
    async getData(apiUrl) {
        let pageNumber = 1;
        let allPages = [];
        let newPage = [];

        do {
            newPage = await this._getOnePage(apiUrl, pageNumber);
            allPages = allPages.concat(newPage);
            pageNumber++;
        } while (newPage.length > 0);

        return allPages;
    }

    async _getOnePage (apiUrl, pageNumber) {
        const token = TOKEN;
        const urlContainsParam = apiUrl.search(`\\?`) > -1;
        let url = '';
        
        if(urlContainsParam) {
            url = `${apiUrl}&per_page=100&page=${pageNumber}`;
        } else {
            url = `${apiUrl}?per_page=100&page=${pageNumber}`;
        }
        
        const result = await httpAdapter.get(url, token);

        return result;
    }
}

module.exports = new DataService();
