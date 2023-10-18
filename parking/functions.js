// Function to calculate the Haversine distance between two points
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

const ff = (currentLat, currentLon, parkings, numSpots = 5) => {
    // Create an array to store the closest parking spots
    const closestParkings = [];
  
    for (const parkingSpot of parkings) {
      const distance = calculateHaversineDistance(
        currentLat, currentLon,
        parseFloat(parkingSpot.latitude), parseFloat(parkingSpot.longitude)
      );
  
      if (closestParkings.length < numSpots) {
        // If the array is not full yet, add the parking spot
        closestParkings.push(parkingSpot);
      } else {
        // If the array is full, find the spot with the maximum distance and replace it
        const maxDistanceSpot = closestParkings.reduce((max, spot) =>
          calculateHaversineDistance(
            currentLat, currentLon,
            parseFloat(spot.latitude), parseFloat(spot.longitude)
          ) > calculateHaversineDistance(
            currentLat, currentLon,
            parseFloat(max.latitude), parseFloat(max.longitude)
          ) ? spot : max
        );
  
        if (distance < calculateHaversineDistance(
          currentLat, currentLon,
          parseFloat(maxDistanceSpot.latitude), parseFloat(maxDistanceSpot.longitude)
        )) {
          // Replace the farthest parking spot with the current one
          closestParkings[closestParkings.indexOf(maxDistanceSpot)] = parkingSpot;
        }
      }
    }
  
    return closestParkings;
  };
  

export {ff};
  