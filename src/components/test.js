import React, { useState, useEffect } from "react";
import { getCoordinatesFromAddress, calculateDistanceBetweenTwoCoordinates } from "../utils/geolocUtil";

function OSMTest() {
    const [coordinates1, setCoordinates1] = useState(null);
    const [coordinates2, setCoordinates2] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultCoordinates1 = await getCoordinatesFromAddress({
                    country: "belgium",
                    city: "brussels",
                    postalCode: "1000",
                    street: "rue de gravelines",
                    number: "3"
                });
                setCoordinates1(resultCoordinates1);

                const resultCoordinates2 = await getCoordinatesFromAddress({
                    country: "belgium",
                    city: "brussels",
                    postalCode: "1190",
                    street: "rue berthelot",
                    number: "50"
                });
                setCoordinates2(resultCoordinates2);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);

    function handleTest() {
        console.log(calculateDistanceBetweenTwoCoordinates(coordinates1, coordinates2));

    }

    return (
        <div>
            <p>Coordinates 1: {coordinates1 && JSON.stringify(coordinates1)}</p>
            <p>Coordinates 2: {coordinates2 && JSON.stringify(coordinates2)}</p>
            <button onClick={handleTest}>Test</button>
        </div>
    );
}

export default OSMTest;
