const dataService = require('./data');
const { USER_LOGIN } = require("../../../personal-data");

class ReviewService {
    async getAllReviewsOfAPullRequest(organization, repositoryName, pullRequest) {
        try {
            const pendingReviews = this._getPendingReviews(pullRequest);
            const doneReviews = await this._getReviewers(organization, repositoryName, pullRequest.number);
            let allReviews = pendingReviews.concat(doneReviews);

            if (pullRequest.state === 'open') {
                allReviews = this._removeOpenReviews(allReviews);
            }

            if (allReviews.length > 1) {
                allReviews = this._removeDuplicates(allReviews);
            }

            return allReviews;
        } catch (error) {
            console.error('REVIEW CACTH', error);
            return [];
        }
    }

    async _getReviewers(organization, repository, pullRequest) {
        try {
            const apiUrl = `https://api.github.com/repos/${organization}/${repository}/pulls/${pullRequest}/reviews`
            const reviewsData = await dataService.getData(apiUrl);

            let reviewList = this._serializeData(reviewsData);
            reviewList = this._removeAuthorActions(reviewList);
            
            return reviewList;
        } catch (error) {
            console.error('REVIEW CACTH', error);
        }
    }

    _getPendingReviews(pullRequest) {
        const requestedReviewers = pullRequest.requested_reviewers;

        const pendingReviews = requestedReviewers.map(reviewer => ({
                id: '',
                status: 'OPEN',
                submittedAt: '',
                reviewer: {
                    login: reviewer.login,
                    id: reviewer.id,
                }
            })
        );

        return pendingReviews;
    }

    _serializeData(reviewsData) {
        const reviewList = reviewsData.map(review => ({
                id: review.id,
                status: review.state,
                submittedAt: new Date(review.submitted_at),
                reviewer: {
                    login: review.user.login,
                    id: review.user.id
                }
            })
        );

        return reviewList;
    }

    _removeAuthorActions(reviewList) {
        const userLogin = USER_LOGIN;
        const filteredList = reviewList.filter((review) => review.reviewer.login !== userLogin);

        return filteredList;
    }

    _removeDuplicates(reviewList) {
        let currentIndex = 0;
        while (currentIndex < reviewList.length) {
            const currentReviewUser = reviewList[currentIndex].reviewer.login;
            const currentReviewDateString = reviewList[currentIndex].submittedAt || '1970-01-01'
            const currentReviewDate = new Date(currentReviewDateString);
            
            let searchCursor = currentIndex + 1;
            while (searchCursor < reviewList.length) {
                const comparisonReviewUser = reviewList[searchCursor].reviewer.login
                const comparisonReviewDateString = reviewList[searchCursor].submittedAt || '1970-01-01'
                const comparisonReviewDate = new Date(comparisonReviewDateString);

                const isSameReviewer = currentReviewUser === comparisonReviewUser;
                const isCurrentNewer = currentReviewDate > comparisonReviewDate;
                
                if (isSameReviewer) {
                    if (isCurrentNewer) {
                        reviewList.splice(searchCursor, 1);
                    } else { //is current review older
                        reviewList.splice(currentIndex, 1);
                        currentIndex--;
                        break;
                    }
                } else {
                    searchCursor++
                }
            }
            currentIndex++;
        }

        return reviewList;
    }

    _removeOpenReviews(reviewList) {
        const result = reviewList.filter(review => review.status !== "OPEN");

        return result;
    }
}

module.exports = new ReviewService();
