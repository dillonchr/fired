const db = require('@dillonchr/ephemeraldb'); 

module.exports = (collectionName) => {
    return {
        getEmployees(onResponse) {
            db.getAllDocumentsInCollection(collectionName, onResponse);
        },
        saveEmployees(employees) {
            db.insertMany(collectionName, employees);
        },
        fireEmployees(employeeNames) {
            const update = {$set: {fired: true, fireDate: new Date().getTime()}};
            db.updateMany(collectionName, {name: {$in: employeeNames}}, update);
        },
        getFiredEmployees(onResponse) {
            db.findDocumentsInCollection(collectionName, {fired:true}, {sort:{fireDate: -1}}, onResponse);
        }
    };
};
