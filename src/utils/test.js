import React, { useState, useEffect } from "react";
import { getCoordinatesFromAddress, calculateDistanceBetweenTwoCoordinates, calculateDistanceBetweenTwoAdresses } from "./geolocUtil";

export async function OSMTest() {
    return await calculateDistanceBetweenTwoAdresses("Av. Van Volxem 354, 1190 Forest, Bruxelles, Belgique", "Rue Bruyn 1, 1120 Bruxelles, Belgique")
}


