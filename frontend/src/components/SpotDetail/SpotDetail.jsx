import { useParams } from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import { useState, useEffect } from "react";
import { getSpotDetailThunk } from '../../store/spots'
import { getReviewsBySpotIdThunk} from '../../store/reviews'
import ReviewIndexItem from '../ReviewIndexItem/ReviewIndexItem'
import CreateReviewModal from '../CreateReviewModal/CreateReviewModal'
import { useModal } from '../../context/Modal';
import './SpotDetail.css'


const SpotDetail = () => {
    const {spotId} = useParams();
    // console.log(spotId)
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const [reviewUpdate, setReviewUpdate] = useState(false);
    const [reviewDelete, setReviewDelete] = useState(false);

    const toggleReviewDelete = () => {
        setReviewDelete(prev => !prev)
    }

    const spotsObj = useSelector(state => state.spots)
    const spot = spotsObj[spotId]
    console.log("spot in spot detail page", spot)

    const reviewsObj = useSelector(state => state.reviews)
    const reviews = Object.values(reviewsObj)
    // const reversedReviews = reviews.reverse()
    console.log("reviews in spot detail page", reviews)

    const currentUser = useSelector(state => state.session.user)
    console.log("currentUser", currentUser)


    useEffect(() => {
        const helper = async() => {
            await dispatch(getSpotDetailThunk(spotId))
            await dispatch(getReviewsBySpotIdThunk(spotId))
        }
        helper()
    }, [dispatch, spotId, reviewUpdate, reviewDelete])

    // useEffect(() => {
    //     dispatch(getSpotDetailThunk(spotId))
    //         .then(() => {
    //             dispatch(getReviewsBySpotIdThunk(spotId));
    //         })
    // }, [dispatch, spotId])
    const ishidden = () => {
        if(!currentUser) return true;
        if(currentUser && currentUser.id === spot.ownerId) return true;
        if(currentUser) {
            for(let review of reviews) {
                if(review.userId === currentUser.id) return true
            }
            return false;
        }
    }

    const handlePostClick = (spotId) => {
        setModalContent(<CreateReviewModal spotId={spotId} reviewPosted={() => setReviewUpdate(prev => !prev)} />)
    }

    const reserveButtonClick = (e) => {
        e.preventDefault();
        console.log("window.alert", window.alert)
        window.alert('Feature coming soon')
    }

    if (!spot || !spot.Owner || !spot.SpotImages) {
        return <div>Loading...</div>; 
    }

    const previewImage = spot.SpotImages.find((img) => img.preview === true)
    const otherImages = spot.SpotImages.filter(img => !img.preview)

    const reviewPrompt = reviews.length === 0 && currentUser && currentUser.id !== spot.ownerId
    console.log("reviewPrompt", reviewPrompt)
    
    return (
        <div className="spot-detail-all-page">
        <section className="spot-detail-page">
            <div className="spot-detail-header">
                <h1>{spot.name}</h1>
                <p>{spot.city}, {spot.state}, {spot.country}</p>
            </div>

            <div className="spot-detail-image-container">
                <div className="spot-detail-image-preview">
                    <img src={previewImage ? previewImage.url : "defaultimage"} alt={`${spot.name}`}  />
                </div>
                <div className="spot-detail-image-thumbnails">
                    {
                        otherImages.map((img) => (
                            <div key={Image.id} className="spot-detail-small-image-container">
                                <img src={img.url} alt="spot image" />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="spot-detail-content-container">
                <div className="spot-detail-text">
                    <h1>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h1>
                    <p>{spot.description}</p>
                </div>
                <div className="spot-detail-action-container">
                    <div className="spot-detail-action-price-star-review">
                        <span className="spot-detail-action-price">${spot.price.toFixed(2)} night</span>
                        <div className="spot-detail-action-star-review">
                            <i style={{color: "orange"}} className="fa-solid fa-star">{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</i>
                            <span className="dot">{spot.numReviews > 0 ? `   ·    ` : null}</span>
            {/* <p>{0 < spot.numReviews <= 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews` }</p> */}
                            <span className="spot-detail-action-review">{spot.numReviews > 1 ? `${spot.numReviews} reviews` : spot.numReviews == 0 ? null : `${spot.numReviews} review`}</span>

                        </div>
                    </div>
                    <button onClick={reserveButtonClick}>Reserve</button>
                </div>
            </div>
        </section>

        <div>
            <i style={{color: "orange"}} className="fa-solid fa-star">{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</i>
            <span className="dot">{spot.numReviews > 0 ? `   ·    ` : null}</span>
            {/* <p>{0 < spot.numReviews <= 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews` }</p> */}
            <span className="spot-detail-action-review">{spot.numReviews > 1 ? `${spot.numReviews} reviews` : spot.numReviews == 0 ? null : `${spot.numReviews} review`}</span>
        </div>
        
        <div className="post-your-review-container">
            {ishidden()? null : (<button onClick={() => handlePostClick(spot.id)}>Post Your Review</button>)}
        </div>
        <section>
            <div>
                {reviewPrompt ? (<p>Be the first to post a review!</p>) : reviews.reverse().map((review) => (
                    <ReviewIndexItem 
                    review={review}
                    currentUser={currentUser}
                    reviewDelete={toggleReviewDelete}
                    key={review.id}
                    />
                ))}
            </div>
        </section>
        </div>
        
    )
}

export default SpotDetail;