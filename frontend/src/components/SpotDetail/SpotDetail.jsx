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
    }, [dispatch, spotId, reviewUpdate])

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

    if (!spot || !spot.Owner || !spot.SpotImages) {
        return <div>Loading...</div>; 
    }

    const previewImage = spot.SpotImages.find((img) => img.preview === true)
    const otherImages = spot.SpotImages.filter(img => !img.preview)

    const reviewPrompt = reviews.length === 0 && currentUser && currentUser.id !== spot.ownerId
    console.log("reviewPrompt", reviewPrompt)
    
    return (
        <>
        <section>
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
                            <div key={Image.id} className="spot-detail-small-image">
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
                <div className="spot-detail-action">
                    <div>
                        <p>${spot.price} night</p>
                        <i className="fa-solid fa-star">{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</i>
                        <p>{spot.numReviews > 0 ? `.` : null}</p>
            <p>{0 < spot.numReviews <= 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews` }</p>
                    </div>
                    <button>Reserve</button>
                </div>
            </div>
        </section>

        <div>
            <i className="fa-solid fa-star">{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</i>
            <p>{spot.numReviews > 0 ? `.` : null}</p>
            <p>{0 < spot.numReviews <= 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews` }</p>
        </div>
        
        <div>
            {ishidden()? null : (<button onClick={() => handlePostClick(spot.id)}>Post Your Review</button>)}
        </div>
        <section>
            <div>
                {reviewPrompt ? (<p>Be the first to post a review!</p>) : reviews.reverse().map((review) => (
                    <ReviewIndexItem 
                    review={review}
                    key={review.id}
                    />
                ))}
            </div>
        </section>
        </>
        
    )
}

export default SpotDetail;