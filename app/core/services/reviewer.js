const dataService = require('./data');

class PullService {
    async getAllPullRequestsOfAllRepositories(repositoryList) {
        // const something;
        // ...
        // return something;
    }

    // async getPullRequestsOfARepo(repository) {
    //     let pageNumber = 1;
    //     let allPullRequests = [];
    //     let newPage = [];
    //     const url = `https://api.github.com/repos/vaees/${repository}/pulls`

    //     do {
    //         newPage = await getOnePage(url, pageNumber);
    //         allPullRequests = allPullRequests.concat(newPage);
    //         pageNumber++;
    //     } while (newPage.length > 0);

    //     let seq = 0;
    //     const pullRequestList = allPullRequests
    //         .map((element) => {
    //             seq++;
    //             return {
    //                 seq: seq,
    //                 id: element.id,
    //                 name: element.name
    //             };
    //         });

    //     return pullRequestList;
    // }

    async getPullRequestsOfARepository(organization, repository) {
        const apiUrl = `https://api.github.com/repos/${organization}/${repository}/pulls?state=all`
        const pullsData = await dataService.getData(apiUrl);
        console.log(pullsData);
        const pullsList = this._serializeData(pullsData);

        return pullsList;
    }

    _serializeData(pullsData) {
        let seq = 0;
        const pullsList = pullsData
            .map((pullRequest) => {
                seq++;
                return {
                    seq: seq,
                    id: pullRequest.id,
                    url: pullRequest.url,
                    state: pullRequest.state,
                    title:pullRequest.title,
                    createdAt: pullRequest.created_at,
                    closed_at: pullRequest.closed_at,
                    draft: pullRequest.draft,
                    user: {
                        login: pullRequest.user.login,
                        id: pullRequest.user.id
                    },
                    requestedReviewers: pullRequest.requested_reviewers
                        .map((reviewer) => ({
                            login: reviewer.login,
                            id: reviewer.id,
                        }))
                    ,
                    requestedTeams: pullRequest.requested_teams,
                };
            });

        return pullsList;
    }
}

module.exports = new PullService();
