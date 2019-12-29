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

// Ecliptic coordinates of the sun (Lambda Sun)
function EclipticLongitude(JD) {
    const M = MeanAnomaly(JD);
    const PI = 102.9373;
    const C = TrueAnomaly(M);
    return (M + PI + C + 180) % 360;
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

// #region 7. The Observer
// https://www.aa.quae.nl/en/reken/zonpositie.html#7

// The sidereal time is the right ascension that is on the celestial meridian at that moment (theta)
function SiderealTime(JD, longitude) {
    const J2k = 2451545;
    return (280.1470 + (360.9856235 * (JD - J2k)) - longitude) % 360;
}

// Hour angle, indicates how long ago (in sidereal time) the sun passed through the celestial meridian (H)
function HourAngle(JD, longitude) {
    const siderealTime = SiderealTime(JD, longitude);
    const rightAscension = RightAscensionSun(EclipticLongitude(JD));
    return siderealTime - rightAscension;
}

// Azimuth is the direction along the horizon used to position the sun in the sky (A)
function Azimuth(hourAngle, latitude, declination) {
    const hourRads = getRadians(hourAngle);
    const latRads = getRadians(latitude);
    const declRads = getRadians(declination);
    return getDegrees(Math.atan2(Math.sin(hourRads), (Math.cos(hourRads) * Math.sin(latRads)) - (Math.tan(declRads) * Math.cos(latRads))));
}

// Altitude is the position of the sun in the sky above the horizon
function Altitude(hourAngle, latitude, declination) {
    const hourRads = getRadians(hourAngle);
    const latRads = getRadians(latitude);
    const declRads = getRadians(declination);
    return getDegrees(Math.asin((Math.sin(latRads) * Math.sin(declRads)) + (Math.cos(latRads) * Math.cos(declRads) * Math.cos(hourRads))));
}

// #endregion

// #region 8. Solar Transit
// https://www.aa.quae.nl/en/reken/zonpositie.html#8

function SolarTransit(JD, longitude) {
    const J2k = 2451545;
    const nx = (JD - J2k - 0.0009) - (longitude / 360);
    const n = Math.round(nx);

    // Calculate estimate for date and time of the transit near JD
    const Jx = JD + (n - nx);

    // Calculate mean anomaly (M) and mean elliptical longitude (LSun) for Jx
    const meanAnomalyRads = getRadians(MeanAnomaly(Jx)); // M
    const LSunRads = getRadians(MeanLongitudeSun(Jx) % 360); // LSun
    
    // Estimate the transit time
    let Jtransit = Jx + (0.0053 * Math.sin(meanAnomalyRads)) + (-0.0068 * Math.sin(2 * LSunRads));

    // Improve accuracy - calculate the hour angle (H) of the sun during transit
    const precision = 0.0001; // We'll stop improving our estimate once the new value varies by less than this value
    const maxIterations = 10; // Avoid infinite loop, in case our calculations don't converge
    for (let i = 0; i < maxIterations; i++) {
        const JtransitNew = Jtransit - (HourAngle(Jtransit, longitude) / 360);

        // Was our accuracy improvement significant? If not, we're done
        const iterationImprovement = Jtransit - JtransitNew;
        if (iterationImprovement <= precision) break;

        // Update our estimate and revise our estimation
        Jtransit = JtransitNew;
    }

    return Jtransit;
}

// #endregion

// #region 10. Sunrise and Sunset
// https://www.aa.quae.nl/en/reken/zonpositie.html#10

function SunriseSunset(JD, latitude, longitude) {
    const Jtransit = SolarTransit(JD, longitude);
    const declinationSun = DeclinationSun(EclipticLongitude(Jtransit));

    const latRads = getRadians(latitude);
    const decSunRads = getRadians(declinationSun);

    const num = Math.sin(latRads) * Math.sin(decSunRads);
    const den = Math.cos(latRads) * Math.cos(decSunRads);
    const Ht = getDegrees(Math.acos((-0.0146 - num) / den));

    let Jrise = Jtransit - (Ht / 360);

    // Improve accuracy - calculate the hour angle (H) of the sun during transit
    const precision = 0.0001; // We'll stop improving our estimate once the new value varies by less than this value
    const maxIterations = 10; // Avoid infinite loop, in case our calculations don't converge
    for (let i = 0; i < maxIterations; i++) {
        let Hrise = HourAngle(Jrise, longitude);
        if (Hrise >= 180) Hrise = Hrise - 360; // Interpret values like 270 deg as -90 deg
    
        const decSunRise = DeclinationSun(EclipticLongitude(Jrise));
        const decSunRiseRads = getRadians(decSunRise);
    
        const numRise = Math.sin(latRads) * Math.sin(decSunRiseRads);
        const denRise = Math.cos(latRads) * Math.cos(decSunRiseRads);
        const HtRise = getDegrees(Math.acos((-0.0146 - numRise) / denRise));
    
        const JDcorrection = -(Hrise + HtRise) / 360;
        if (JDcorrection < precision) break;

        Jrise = Jrise + JDcorrection;
    }

    return Jrise;
}

// #endregion

module.exports = { 
    DateToJulian,
    DateFromJulian,
    MeanAnomaly,
    TrueAnomaly,
    MeanLongitudeSun,
    EclipticLongitude,
    RightAscensionSun,
    DeclinationSun,
    SiderealTime,
    HourAngle,
    Azimuth,
    Altitude,
    SolarTransit,
    SunriseSunset,
};
