// this is the database for storing report violation information after processing vehicle info

export let reportViolationDatabase = []

// function to add record
export const addViolationRecord = (record) => {
    reportViolationDatabase.push(record);
}

// function to clear database content
export const clearViolatonRecord = () => {
    reportViolationDatabase = [];
}