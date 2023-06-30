const { getTrips } = require('api');
async function analysis() {
  // Your code goes here
  






/* 
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */

  async function analysis() {
    // Your code goes here
    const trips = await getTrips();
    const removeComma = (amt) => Number(amt.toString().replace(',', ''));
    const output = {
      "noOfCashTrips": 0,
      "noOfNonCashTrips": 0,
      "billedTotal": 0,
      "cashBilledTotal": 0,
      "nonCashBilledTotal": 0,
      "noOfDriversWithMoreThanOneVehicle": 0,
    };
   
    const driverDict = {};
   
    for (const trip of trips) {
      if (trip.isCash) {
        output.noOfCashTrips++;
        output.cashBilledTotal += removeComma(trip.billedAmount);
      } else {
        output.noOfNonCashTrips++;
        output.nonCashBilledTotal += removeComma(trip.billedAmount);
      }
   
      if (!Object.keys(driverDict).includes(trip.driverID)) {
        let driverInfo = await getDriver(trip.driverID);
        }
        driverDict[trip.driverID] = { count: 1, earning: removeComma(trip.billedAmount), info: driverInfo };
      } else s{
        driverDict[trip.driverID].count++;
        driverDict[trip.driverID].earning += removeComma(trip.billedAmount);
      }
    }
    output.billedTotal = output.cashBilledTotal + output.nonCashBilledTotal;
   
    let driverCountMax = 0;
    let topDriverID = '';
    let driverEarningMax = 0
    let richDriverID = '';
   
    for (const driverID in driverDict) {
      if (driverDict[driverID].count > driverCountMax) {
        driverCountMax = driverDict[driverID].count;
        topDriverID = driverID;
      }
      if (driverDict[driverID].earning > driverEarningMax) {
        driverEarningMax = driverDict[driverID].earning;
        richDriverID = driverID;
      }
      if (driverDict[driverID].info.vehicleID.length > 1)
        output.noOfDriversWithMoreThanOneVehicle++;
    }
   
    const topDriver = await getDriver(topDriverID);
    output.mostTripsByDriver = {
      name: topDriver.name,
      email: topDriver.email,
      phone: topDriver.phone,
      noOfTrips: driverDict[topDriverID].count,
      totalAmountEarned: driverDict[topDriverID].earning
    }
   
    const richDriver = await getDriver(richDriverID);
    output.highestEarningDriver = {
      name: richDriver.name,
      email: richDriver.email,
      phone: richDriver.phone,
      noOfTrips: driverDict[richDriverID].count,
      totalAmountEarned: driverDict[richDriverID].earning
    }
   
    return output;
  } 

module.exports = analysis;
