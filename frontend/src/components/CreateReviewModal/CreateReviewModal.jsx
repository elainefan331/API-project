import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import StarsRatingInput from "../StarsRatingInput";
import { useState } from "react";
import './CreateReviewModal.css'

const CreateReviewModal = () => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        // dispatch();
        closeModal();
    }

    const onChange = (num) =>{
        setRating(num)
    }

    return (
        <div>
            <h1>How was your stay?</h1>
            <textarea 
                placeholder="Leave your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
            >
            </textarea>
            <div className="rating-input-container">
                <div className="stars-and-label">
                    <StarsRatingInput 
                        onChange={onChange}
                        rating={rating}
                        // value={rating}
                    />
                    <span>Stars</span>
                </div>
                
                
            </div>
            <button 
                type="submit" 
                disabled={review.length < 10 || rating === null}
                onClick={handleSubmit}>
                Submit Your Review
            </button>
        </div>
    )
}

export default CreateReviewModal;