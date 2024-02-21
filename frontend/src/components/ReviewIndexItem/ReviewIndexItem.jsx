import { useModal } from '../../context/Modal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal'

const ReviewIndexItem = ({review, currentUser, reviewDelete}) => {
    // console.log(review.createdAt)
    const { setModalContent } = useModal();
    let date = new Date(review.createdAt)
    let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    let monthNum = date.getMonth()
    let month = monthNames[monthNum]
    // console.log("month", month)
    let year = date.getFullYear()
    // console.log("year", year)

    // if (!review.User || !review.review || !review.createdAt) {
    //     return <div>Loading...</div>; 
    // }

    
    const handleDeleteClick = (reviewId) => {
        setModalContent(<DeleteReviewModal 
                            reviewId={reviewId} 
                            reviewDelete={reviewDelete}
                        />)
    }

    return (
        <div>
            {review.User && review.User.firstName && <h3>{review.User.firstName}</h3>}
            <h4>{`${month} ${year}`}</h4>
            <p>{review.review}</p>
            {currentUser && currentUser.id && review.userId === currentUser.id && <button onClick={() => handleDeleteClick(review.id)}>Delete</button>}
        </div>
    )
}

export default ReviewIndexItem;