const dataService = require('./data');
const reviewService = require('./review');
const { USER_LOGIN, START_DATE, END_DATE } = require('../../../personal-data');

class PullService {
    async getPullRequestsOfARepository(organization, repositoryName) {
        try {
            const apiUrl = `https://api.github.com/repos/${organization}/${repositoryName}/pulls?state=all`
            const pullRequestsData = await dataService.getData(apiUrl);
            const filteredPullRequests = this._filterPullRequests(pullRequestsData);
            const pullRequestList = await this._serializeData(organization, repositoryName, filteredPullRequests);

            return pullRequestList;
        } catch (error) {
            console.log('PULL CATCH!!!');
            console.log(error);
        }
    }

    _filterPullRequests(pullRequestsData) {
        const filteredPullRequests = pullRequestsData
            .filter((pullRequest) => {
                const user = USER_LOGIN.toLowerCase();
                const pullRequestOwner = pullRequest.user.login.toLowerCase()
                const isPullRequestOwner = pullRequestOwner === user
                
                const startDateString = START_DATE || '1970-01-01';
                const startDate = new Date(startDateString);
                
                const endDateString = END_DATE || Date();
                const endDate = new Date(endDateString);
                
                const pullRequestDate = new Date(pullRequest.created_at);

                return (
                    isPullRequestOwner
                    && pullRequestDate > startDate
                    && pullRequestDate < endDate
                )
            });
        
        return filteredPullRequests;
    }

    _serializeData(organization, repositoryName, pullRequestsData) {
        const pullRequestList = pullRequestsData
            .map(async (pullRequest) => {
                const reviews = await reviewService.getAllReviewsOfAPullRequest(organization, repositoryName, pullRequest);

                return {
                    id: pullRequest.id,
                    number: pullRequest.number,
                    url: pullRequest.url,
                    status: pullRequest.state,
                    title:pullRequest.title,
                    createdAt: pullRequest.created_at,
                    closed_at: pullRequest.closed_at,
                    draft: pullRequest.draft,
                    user: {
                        login: pullRequest.user.login,
                        id: pullRequest.user.id
                    },
                    reviews
                };
            });

        return Promise.all(pullRequestList);
    }
}

module.exports = new PullService();
