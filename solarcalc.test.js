const { 
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

test ('The ecliptic longitude of the sun on JD 2453097 is 12.0322 degrees', () => {
    expect(EclipticLongitude(2453097)).toBeCloseTo(12.0322, 4);
});

// 6. The Equatorial Coordinates
test ('The right ascension of the sun on JD 2453097 is 11.0649 degrees', () => {
    const eclipticalLongitudeSun = 12.0322; // Lambda sun
    expect(RightAscensionSun(eclipticalLongitudeSun)).toBeCloseTo(11.0649, 4);
});

test ('The declination of the sun on JD 2453097 is 4.7565 degrees', () => {
    const eclipticalLongitudeSun = 12.0322; // Lambda sun
    expect(DeclinationSun(eclipticalLongitudeSun)).toBeCloseTo(4.7565, 4);
});

// 7. The Observer
test ('Sidereal time in the Netherlands on JD 2453097 is 14.8347 degrees', () => {
    expect(SiderealTime(2453097, -5)).toBeCloseTo(14.8347, 4);
});

test ('Hour angle for the Netherlands on JD 2453097 is 3.7698 degrees', () => {
    expect(HourAngle(2453097, -5)).toBeCloseTo(3.7698, 4);
});

test ('Azimuth of the sun in the Netherlands on JD 2453097 is 5.1111 degrees', () => {
    expect(Azimuth(3.7698, 52, 4.7565)).toBeCloseTo(5.1111, 4);
});

test ('Altitude of the sun in the Netherlands on JD 2453097 is 42.6530 degrees', () => {
    expect(Altitude(3.7698, 52, 4.7565)).toBeCloseTo(42.6530, 4);
});

// 8. Solar Transit
test ('Solar transit in the Netherlands near JD 2453097 is 2453096.9895', () => {
    expect(SolarTransit(2453097, -5)).toBeCloseTo(2453096.9895, 4);
});

// 10. Sunrise Sunset
test ('Sunrise in the Netherlands on April 1, 2004 is at 5:15', () => {
    const date = new Date('April 1, 2004 12:00:00');
    const sunriseJD = SunriseSunset(DateToJulian(date), 52, -5).sunRise;
    const sunriseTime = DateFromJulian(sunriseJD, date.getTimezoneOffset());
    expect(sunriseTime.getHours().toString() + ':' + sunriseTime.getMinutes().toString()).toEqual('5:15');
});

test ('Sunrise in the Netherlands on October 1, 2004 is at 5:42', () => {
    const date = new Date('October 1, 2004 12:00:00');
    const sunriseJD = SunriseSunset(DateToJulian(date), 52, -5).sunRise;
    const sunriseTime = DateFromJulian(sunriseJD, date.getTimezoneOffset());
    expect(sunriseTime.getHours().toString() + ':' + sunriseTime.getMinutes().toString()).toEqual('5:42');
});

test ('Sunset in the Netherlands on April 1, 2004 is at 18:15', () => {
    const date = new Date('April 1, 2004 12:00:00');
    const sunriseJD = SunriseSunset(DateToJulian(date), 52, -5).sunSet;
    const sunriseTime = DateFromJulian(sunriseJD, date.getTimezoneOffset());
    expect(sunriseTime.getHours().toString() + ':' + sunriseTime.getMinutes().toString()).toEqual('18:15');
});

test ('Sunset in the Netherlands on October 1, 2004 is at 17:18', () => {
    const date = new Date('October 1, 2004 12:00:00');
    const sunriseJD = SunriseSunset(DateToJulian(date), 52, -5).sunSet;
    const sunriseTime = DateFromJulian(sunriseJD, date.getTimezoneOffset());
    expect(sunriseTime.getHours().toString() + ':' + sunriseTime.getMinutes().toString()).toEqual('17:18');
});
