import { useState, useEffect } from "react";
import saveUserBonusData from "../utils/saveUserBonusData";
import cn from "../utils/cn";

const BonusChecker = ({ bonusValue, userID }) => {
  const [isBonus, setIsBonus] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Update isBonus state based on bonusValue
  useEffect(() => {
    let newIsBonus = false;
    if (bonusValue >= 1) {
      newIsBonus = true;
    }
    setIsBonus(newIsBonus);
    if (isMounted) {
      // Check if component has mounted
      console.log("bonusValue changed:", bonusValue);
    } else {
      setIsMounted(true); // Set isMounted to true after initial mount
    }
  }, [bonusValue, isMounted]);

  // Log message whenever isBonus changes
  useEffect(() => {
    if (isMounted) {
      // Check if component has mounted
      console.log("isBonus changed:", isBonus);
      console.log("userID:", userID);
      saveUserBonusData(isBonus, userID);
    } else {
      setIsMounted(true); // Set isMounted to true after initial mount
    }
  }, [isBonus, isMounted]);

  let text = "";
  if (bonusValue >= 2) {
    text = `Eligible for bonus! ${bonusValue} days ahead`;
  } else if (bonusValue === 1) {
    text = `Eligible for bonus! Just just but ça va`;
  } else if (bonusValue === 0) {
    text = `Not eligible for bonus : 1 day behind`;
  } else {
    text = `Not eligible for bonus : ${Math.abs(bonusValue - 1)} days behind`;
  }

  return (
    <div>
      <div
        className={cn(
          bonusValue >= 1 ? "border-solid bg-opacity-80" : "border-dashed bg-opacity-40",
          "h-full w-90percent m-auto p-2 border-opacity-70 border-2 border-lightpink bg-lightpink"
        )}
      >
        <p className="font-semibold">{text}</p>
      </div>
    </div>
  );
};

export default BonusChecker;
