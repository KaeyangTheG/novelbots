
const UNITS = {
    HOUR: 'h',
    MINUTES: 'm',
    SECONDS: 's',
};

const UNIT_TO_MS = {
    [UNITS.HOUR]: 60 * 60 * 1000,
    [UNITS.MINUTES]: 60 * 1000,
    [UNITS.SECONDS]: 1000,
};

module.exports = {
    add: function (obj, amount, unit = UNITS.HOUR) {
        if (!validate(obj)) {
            throw new Error('invalid date');
            return;
        }
        obj.setTime(obj.getTime() + amount * UNIT_TO_MS[unit]);
        return obj;
    },
    validate: validate,
};

function validate(obj) {
    return typeof obj === 'object' &&
        new Date(obj).toString().toLowerCase() !== 'invalid date';
}