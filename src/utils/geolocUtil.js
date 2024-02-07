// Functions to help with geolocation and calculating bonus

function calculateIsOfficeInRadius(homeAddress, officeAddress) {}


export async function getCoordinatesFromAddress(address){
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.length > 0) {
        const location = data[0];
        const resultCoordinates = {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        };
        return resultCoordinates;
      } else {
        throw new Error("No results found for the provided address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      throw new Error(
        "Unable to fetch coordinates. Please try again later."
      );
    }
  }

export function calculateDistanceBetweenTwoCoordinates (coord1, coord2) {
  let lat1 = coord1.latitude;
  let lon1 = coord1.longitude;
  let lat2 = coord2.latitude;
  let lon2 = coord2.longitude;
  let R = 6371; // Radius of the earth in km
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  let dLat = deg2rad(lat2 - lat1); // deg2rad below
  let dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

export function calculateBonusFromMonth(arr, user) {
  let totalBonus = 0;
  for (let i = 0; i < arr.length; i++) {
    let day = arr[i];
    //Valeur actuelle du bonus
    let dayBonus = 0;
    //SI LE BONUS N'A PAS ETE CALCULE
    let location = day.location;

    if (location === "Absent") {
    } else if (location === "Office") {
      if (user.isOfficeInRadius) {
        dayBonus = 1;
      } else {
        dayBonus = -1;
      }
    } else if (location === "Home") {
      dayBonus = 1;
    } else if (location === "Off site") {
      // Fetch client address
      // Calculate distance between client address and home address
      // If distance > 10km, day.isBonus = 1
      // Else day.isBonus = -1
    }
    totalBonus += dayBonus;
  }
}

export async function calculateDistanceBetweenTwoAdresses(addr1, addr2) {
  try {
    let [coordinates1, coordinates2] = await Promise.all([
      getCoordinatesFromAddress(addr1),
      getCoordinatesFromAddress(addr2),
    ]);

    let distance = calculateDistanceBetweenTwoCoordinates(coordinates1, coordinates2);
    console.log("coordinates 1 ", coordinates1)
    console.log("coordinates 2 ", coordinates2)
    return distance;
  } catch (error) {
    console.error(error.message);
    throw new Error("Unable to calculate distance. Please try again later.");
  }
}