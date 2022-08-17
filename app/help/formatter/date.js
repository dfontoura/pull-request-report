class dateFormatter {
    toDate(dateTimeString) {
        console.log('dateTimeString', dateTimeString);
        if (!dateTimeString) {
            return new Date();
        }

        const dateString = dateTimeString.substring(0, 10);
        console.log('dateString', dateString);

        const splitedDate = dateString.split("-");
        console.log('splitedDate', splitedDate);

        console.log('newDate', new Date(splitedDate[0], splitedDate[1] - 1, splitedDate[2]))
        return new Date(splitedDate[0], splitedDate[1] - 1, splitedDate[2]);
    }
}

module.exports = new dateFormatter();
