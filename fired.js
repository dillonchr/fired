const domget = require('@dillonchr/domget');
const async = require('async');
const model = require('./model.js');

const getCurrentRoster = (options, onResponse) => {
    domget(options.url, (err, dom) => {
        if (err) {
            onResponse(err);
        } else {
            try {
                const roster = dom.querySelectorAll(options.selectors.employees)
                    .map(e => ({
                        name: e.querySelector(options.selectors.name).text,
                        profilePic: e.querySelector(options.selectors.profilePic).attributes.src,
                        position: e.querySelector(options.selectors.position).text,
                        bio: e.querySelector(options.selectors.bio).text.trim(),
                        fired: false
                    }));
                if (!roster || !roster.length) {
                    throw new Error('schema error: roster empty');
                } else {
                    onResponse(null, roster);
                }
            } catch (scrapeError) {
                onResponse(scrapeError);
            }
        }
    });
};

const getNewFires = (options, onResponse) => {
    const db = model(options.collection);

    async.parallel([
        fn => getCurrentRoster(options, fn),
        fn => db.getEmployees(fn)
    ], (err, rosters) => {
        const [currentRoster, archiveRoster] = rosters;
        if (!archiveRoster) {
            db.saveEmployees(currentRoster);
            onResponse(null, []);
        } else {
            const newHires = currentRoster
                .filter(c => !archiveRoster.some(e => e.name === c.name));

            if (newHires.length) {
                db.saveEmployees(newHires);
            }

            const newFires = archiveRoster
                .filter(e => !e.fired && !currentRoster.some(c => c.name === e.name));

            if (newFires.length) {
                db.fireEmployees(newFires.map(e => e.name));
            }

            onResponse(null, newFires);
        }
    });
};

module.exports = {
    update: (options, callback) => {
        getNewFires(options, callback);
    },
    list: (options, callback) => {
        model(options.collection).getFiredEmployees(callback);
    }
};
