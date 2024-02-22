import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import StarsRatingInput from "../StarsRatingInput";
import { useState } from "react";
import { createReviewThunk } from '../../store/reviews'
import './CreateReviewModal.css'

const CreateReviewModal = ({spotId, reviewPosted}) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(null);


    const handleSubmit = async(e) => {
        e.preventDefault();
        const newReview = {
            review,
            stars: rating
        }
        await dispatch(createReviewThunk(newReview, spotId));
        reviewPosted();
        closeModal();
    }

    const onChange = (num) =>{
        setRating(num)
    }
    const isDisabled = review.length < 10 || rating === null;

    return (
        <form onSubmit = {handleSubmit}>
            <h1 className="createReviewModal-h1">How was your stay?</h1>
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
                className={isDisabled? "disable-createReviewModal-submit-button" : "createReviewModal-submit-button"}
                type="submit" 
                // disabled={review.length < 10 || rating === null}
                disabled= {isDisabled}
            >
                {/* onClick={handleSubmit} */}
                Submit Your Review
            </button>
        </form>
    )
}

export default CreateReviewModal;