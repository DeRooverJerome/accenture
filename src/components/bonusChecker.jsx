const BonusChecker = ({
    bonusValue
}) => {
    let text = ""
    if (bonusValue > 2) {
        text = `Eligible for bonus! ${bonusValue} days ahead`
    }
    else if (bonusValue === 1) {
        text = `Eligible for bonus! Just just but ça va`
    }
    else if (bonusValue === 0) {
        text = `Not eligible for bonus : 1 day behind`
    }
    else {
        text = `Not eligible for bonus : ${Math.abs(bonusValue -1)} days behind`
    }
   return (
    <div>
        <p>{text}</p>
    </div>
    );
  };
  
  export default BonusChecker;
  