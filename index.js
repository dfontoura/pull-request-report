const { ORGANIZATION } = require('./personal-data');
const repositoryService = require('./app/core/services/repository');

const printRepositories = async () => {
        const organization = ORGANIZATION;
        const repositoryList = await repositoryService.get(organization);

        const table = makeTable(repositoryList);
        console.log(table);
}

const makeTable = (RepositoryList) => {
        const table = [];
        for (const repository of RepositoryList) {
                for (const pullRequest of repository.pullRequests) {
                        for (const review of pullRequest.reviews) {
                                let row = 0;
                                let isNewReviewer = true;

                                for (row in table) {
                                        if (table[row].id === review.reviewer.id) {
                                                isNewReviewer = false;
                                                break; 
                                        }
                                }

                                if (isNewReviewer) {
                                        newReviewer = {
                                                id: review.reviewer.id,
                                                login: review.reviewer.login,
                                                total: 0,
                                                open: 0,
                                                done: 0
                                        };
                                        table.push(newReviewer);
                                        row = table.length - 1;
                                } 
                                
                                if(review.status === 'OPEN') {
                                        table[row].open++;
                                } else {
                                        table[row].done++;
                                }

                                table[row].total++
                        }
                }
        }

        return table;
}


printRepositories();
