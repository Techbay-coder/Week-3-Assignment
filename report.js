const { getTrips } = require("api");

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  /**
   * This function should return the data for drivers in the specified format
   *
   * Question 4
   *
   * @returns {any} Driver report data
   */
  async function driverReport() {
    // Your code goes here

    const trips = await getTrips();

    const driverIds = [...new Set(trips.map((trip) => trip.driverID))];

    const driverData = await Promise.all(
      driverIds.map(async (driverId) => {
        const driver = await getDriver(driverId);

        const driverTrips = trips.filter((trip) => trip.driverID === driverId);
        const noOfTrips = driverTrips.length;
        const noOfCashTrips = driverTrips.filter((trip) => trip.isCash).length;
        const noOfNonCashTrips = driverTrips.filter(
          (trip) => !trip.isCash
        ).length;
        const totalAmountEarned = driverTrips.reduce(
          (total, trip) => total + trip.billedAmount,
          0
        );
        const totalCashAmount = driverTrips.reduce(
          (total, trip) => (trip.isCash ? total + trip.billedAmount : total),
          0
        );
        const totalNonCashAmount = driverTrips.reduce(
          (total, trip) => (!trip.isCash ? total + trip.billedAmount : total),
          0
        );

        const driverVehicles = await Promise.all(
          driver.vehicleID.map(async (vehicleId) => {
            const vehicle = await getVehicle(vehicleId);
            return {
              plate: vehicle.plate,
              manufacturer: vehicle.manufacturer,
            };
          })
        );

        const formattedTrips = driverTrips.map((trip) => {
          return {
            user: trip.user,
            created: trip.created,
            pickup: trip.pickup,
            destination: trip.destination,
            billed: trip.billedAmount,
            isCash: trip.isCash,
          };
        });

        return {
          fullName: driver.name,
          id: driverId,
          phone: driver.phone,
          noOfTrips,
          noOfVehicles: driver.vehicleID.length,
          vehicles: driverVehicles,
          noOfCashTrips,
          noOfNonCashTrips,
          totalAmountEarned,
          totalCashAmount,
          totalNonCashAmount,
          trips: formattedTrips,
        };
      })
    );

    return driverData;
  }
}

module.exports = driverReport;
