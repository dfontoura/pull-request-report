const dataService = require('./data');
const pullService = require('./pull');


class RepositoryService {
    async get(organization) {
        try {
            const apiUrl = `https://api.github.com/orgs/${organization}/repos`
            const rawRepositoriesData = await dataService.getData(apiUrl);
            const serializedData = await this._serializeData(organization, rawRepositoriesData);
            const repositoryList = this._filterRepositoriesWithPull(serializedData);

            return repositoryList;
        } catch (error) {
            console.log('repository.Get CATCH!!!', error);
        }
    }

    _serializeData(organization, repositoriesData) {
        const serializedData =  repositoriesData
            .map(async (repository) => {
                const pullRequests = await pullService.getPullRequestsOfARepository(organization, repository.name);
                return {
                    id: repository.id,
                    name: repository.name,
                    pullRequests
                };

            });
        return Promise.all(serializedData);
    }

    _filterRepositoriesWithPull(repositoriesData) {
        const filteredList = repositoriesData
            .filter(repository => repository.pullRequests.length > 0);

        return filteredList;
    }
}

module.exports = new RepositoryService();
