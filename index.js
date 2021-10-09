const { ORGANIZATION } = require('./app/help/constants/github-api');
const repositoryService = require('./app/core/services/repository');
const pullService = require('./app/core/services/pull');

const printRepositories = async () => {
    const organization = ORGANIZATION;
    const repositoryList = await repositoryService.get(organization);
    const pullsList = await pullService.getPullRequestsOfARepository(organization, repositoryList[26].name)

    console.log(repositoryList);
    console.log(pullsList);
    console.log(pullsList[32].requestedReviewers);

}




printRepositories();
