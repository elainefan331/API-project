import { FaStar } from "react-icons/fa";

import './StarsRatingInput.css'

const StarsRatingInput = ({onChange, rating}) => {
    
    return (
        <div className="rating-input">
            <div 
                // onMouseEnter={() => disabled ? null : setRating(1)}
                className={rating >=1 ? "filled" : "empty"}
                onClick={() => onChange(1)}
            >
                <FaStar />
            </div>

            <div 
                className={rating >=2 ? "filled" : "empty"}
                onClick={() => onChange(2)}
            >
                <FaStar />
            </div>

            <div 
                className={rating >=3 ? "filled" : "empty"}
                onClick={() => onChange(3)}
            >
                <FaStar />
            </div>

            <div 
                className={rating >=4 ? "filled" : "empty"}
                onClick={() => onChange(4)}
            >
                <FaStar />
            </div>

            <div 
                className={rating >=5 ? "filled" : "empty"}
                onClick={() => onChange(5)}
            >
                <FaStar />
            </div>
        </div>
    )
}

export default StarsRatingInput;