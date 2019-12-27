const { 
    DateToJulian,
    DateFromJulian,
    MeanAnomaly,
    TrueAnomaly,
    MeanLongitudeSun,
    ElipticalLongitudeSun,
    RightAscensionSun,
    DeclinationSun,
} = require('./solarcalc');

// 1. Time
test ('JD 2453144.5 corresponds to 0:00 hours UTC on 19 May 2004', () => {
    const date = new Date('May 19, 2004 00:00:00');
    expect(DateToJulian(date)).toEqual(2453144.5);
    expect(DateFromJulian(2453144.5, date.getTimezoneOffset()).valueOf()).toEqual(date.valueOf());
});

// 2. The Mean Anomaly
test ('Mean Anomaly for JD 2453097 is 87.1807', () => {
    expect(MeanAnomaly(2453097)).toBeCloseTo(87.1807, 4);
});

// 3. The Equation of Center
test ('True anomaly from a mean anomaly of 87.1807 degrees is 1.9142 degrees', () => {
    expect(TrueAnomaly(87.1807)).toBeCloseTo(1.9142, 4);
});

// 5. The Ecliptical Coordinates
test ('The mean longitude of the sun is (87.1807 + 102.9373 + 180) for JD 2453097', () => {
    expect(MeanLongitudeSun(2453097)).toBeCloseTo((87.1807 + 102.9373 + 180), 4);
});

test ('The ecliptical longitude of the sun as seen from Earth is 12.0322 degrees', () => {
    const meanLongitudeSun = 87.1807 + 102.9373 + 180; // L sun
    const center = 1.9142;
    expect(ElipticalLongitudeSun(meanLongitudeSun, center)).toBeCloseTo(12.0322, 4);
});

// 6. The Equatorial Coordinates
test ('The right ascension of the sun on JD 2453097 is 11.0649 degrees', () => {
    const eclipticalLongitudeSun = 12.0322; // Lambda sun
    const obliquity = 23.4393; // Obliquity of the sun (little epsilon)
    expect(RightAscensionSun(eclipticalLongitudeSun, obliquity)).toBeCloseTo(11.0649, 4);
});

test ('The declination of the sun on JD 2453097 is 4.7565 degrees', () => {
    const eclipticalLongitudeSun = 12.0322; // Lambda sun
    const obliquity = 23.4393; // Obliquity of the sun (little epsilon)
    expect(DeclinationSun(eclipticalLongitudeSun, obliquity)).toBeCloseTo(4.7565, 4);
});