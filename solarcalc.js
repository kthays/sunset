// This is a module used for calculating the position of the sun.
// https://www.aa.quae.nl/en/reken/zonpositie.html


// #region 1. Time
// https://www.aa.quae.nl/en/reken/zonpositie.html#1

// ** Convert Date object to Julian date
function DateToJulian(date) {
    // https://stackoverflow.com/a/11760121
    return (date.valueOf() / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5;
}

// ** Convert from Julian date to Date object
function DateFromJulian(dateJulian, timezoneOffsetMinutes) {
    // Just undo what we did in DateToJulian
    return new Date(((dateJulian - 2440587.5) + (timezoneOffsetMinutes / 1440)) * 86400000);
}

// #endregion Time

// #region 2. Mean Anomaly
// https://www.aa.quae.nl/en/reken/zonpositie.html#2

// Returns the mean anomaly in degrees
function MeanAnomaly(JD) {
    const J2k = 2451545;
    return (357.5291 + (0.98560028 * (JD - J2k))) % 360;
}
// #endregion

// #region 3. The Equation of Center
// https://www.aa.quae.nl/en/reken/zonpositie.html#3

function getRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function getDegrees(radians) {
    return radians * (180 / Math.PI);
}

// The true anomaly is the angular distance of the planet from the perihelion of the planet, as seen from the Sun.
function TrueAnomaly(meanAnomaly) {
    const mRads = getRadians(meanAnomaly);
    const c1Rads = getRadians(1.9148);
    const c2Rads = getRadians(0.0200);
    const c3Rads = getRadians(0.0003);
    return getDegrees((c1Rads * Math.sin(mRads)) + (c2Rads * Math.sin(2 * mRads)) + (c3Rads * Math.sin(3 * mRads)));
}

// #endregion

module.exports = { DateToJulian, DateFromJulian, MeanAnomaly, TrueAnomaly };