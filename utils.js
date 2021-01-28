const getUtcDate = (dateInput) => {
    let date = dateInput ? new Date(dateInput) : new Date(); 
    let UTCnow =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    return new Date(UTCnow);
}

module.exports = {
    getUtcDate
}