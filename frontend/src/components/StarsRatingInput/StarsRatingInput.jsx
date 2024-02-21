import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";

import './StarsRatingInput.css'

const StarsRatingInput = ({onChange, rating}) => {
    const [activeRating, setActiveRating] = useState(rating)

    useEffect(() => {
        setActiveRating(rating)
    }, [rating])


    return (
        <div className="rating-input"
            onMouseLeave={() => setActiveRating(rating)}
        >
            <div 
                // onMouseEnter={() => disabled ? null : setRating(1)}
                onMouseEnter={() => setActiveRating(1)}
                className={activeRating >=1 ? "filled" : "empty"}
                onClick={() => onChange(1)}
            >
                <FaStar />
            </div>

            <div 
                onMouseEnter={() => setActiveRating(2)}
                className={activeRating >=2 ? "filled" : "empty"}
                onClick={() => onChange(2)}
            >
                <FaStar />
            </div>

            <div 
                onMouseEnter={() => setActiveRating(3)}
                className={activeRating >=3 ? "filled" : "empty"}
                onClick={() => onChange(3)}
            >
                <FaStar />
            </div>

            <div 
                onMouseEnter={() => setActiveRating(4)}
                className={activeRating >=4 ? "filled" : "empty"}
                onClick={() => onChange(4)}
            >
                <FaStar />
            </div>

            <div 
                onMouseEnter={() => setActiveRating(5)}
                className={activeRating >=5 ? "filled" : "empty"}
                onClick={() => onChange(5)}
            >
                <FaStar />
            </div>
        </div>
    )
}

export default StarsRatingInput;