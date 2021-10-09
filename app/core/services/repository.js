const dataService = require('./data');

class RepositoryService {
    async get(organization) {
        const apiUrl = `https://api.github.com/orgs/${organization}/repos`
        const repositoriesData = await dataService.getData(apiUrl);
        const repositoryList = this._serializeData(repositoriesData);

        return repositoryList;
    }

    _serializeData(repositoriesData) {
        let seq = 0;
        const repositoryList = repositoriesData
            .map((repository) => {
                seq++;
                return {
                    seq: seq,
                    id: repository.id,
                    name: repository.name
                };
            });

        return repositoryList;
    }
}

module.exports = new RepositoryService();
