// This is a module used for calculating the position of the sun.
// https://www.aa.quae.nl/en/reken/zonpositie.html


// #region 1. Time
// https://www.aa.quae.nl/en/reken/zonpositie.html#1

// ** Convert Date object to Julian date (J)
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

// Returns the mean anomaly in degrees (M)
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

// The true anomaly is the angular distance of the planet from the perihelion of the planet, as seen from the Sun. (C)
function TrueAnomaly(meanAnomaly) {
    const mRads = getRadians(meanAnomaly);
    const c1Rads = getRadians(1.9148);
    const c2Rads = getRadians(0.0200);
    const c3Rads = getRadians(0.0003);
    return getDegrees((c1Rads * Math.sin(mRads)) + (c2Rads * Math.sin(2 * mRads)) + (c3Rads * Math.sin(3 * mRads)));
}

// #endregion

// #region 4. The Perihelion and the Obliquity of the Ecliptic
// https://www.aa.quae.nl/en/reken/zonpositie.html#4

const perihelion = 102.9373; // Capital PI (degrees)
const obliquity = 23.4393; // Epsilon (degrees)

// #endregion

// #region 5. The Ecliptical Coordinates
// https://www.aa.quae.nl/en/reken/zonpositie.html#5

// The mean longitude (L) is the ecliptical longitude that the planet would have if the orbit were a perfect circle
function MeanLongitude(meanAnomaly) {
    return meanAnomaly + perihelion;
}

// If you look at the Sun from the planet, then you're looking in the opposite direction (L sun)
function MeanLongitudeSun(JD) {
    const meanAnomaly = MeanAnomaly(JD);
    const meanLongitude = MeanLongitude(meanAnomaly);
    return meanLongitude + 180;
}

// Ecliptical Longitude (Lambda sun) is the sun's position along the ecliptic
function ElipticalLongitudeSun(meanLongitudeSun, center) {
    return (meanLongitudeSun + center) % 360;
}

// #endregion

// #region 6. The Equatorial Coordinates
// https://www.aa.quae.nl/en/reken/zonpositie.html#6

// The right ascension determines when the object is visible (alpha) 
function RightAscensionSun(eclipticalLongitudeSun) {
    const sunRads = getRadians(eclipticalLongitudeSun); // Lambda Sun
    const obliquityRads = getRadians(23.4393); // Little epsilon
    return getDegrees(Math.atan2(Math.sin(sunRads) * Math.cos(obliquityRads), Math.cos(sunRads)));
}

// The declination determines from which parts of the planet the object can be visible (little delta)
function DeclinationSun(eclipticalLongitudeSun) {
    const sunRads = getRadians(eclipticalLongitudeSun); // Lambda Sun
    const obliquityRads = getRadians(23.4393); // Little epsilon
    return getDegrees(Math.asin(Math.sin(sunRads) * Math.sin(obliquityRads)));

}

// #endregion

module.exports = { 
    DateToJulian,
    DateFromJulian,
    MeanAnomaly,
    TrueAnomaly,
    MeanLongitudeSun,
    ElipticalLongitudeSun,
    RightAscensionSun,
    DeclinationSun,
};
