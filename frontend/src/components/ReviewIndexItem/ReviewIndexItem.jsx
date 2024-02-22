import { useModal } from '../../context/Modal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal'
import './ReviewIndexItem.css'

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
        <div className='reviewIndexItem-container'>
            {review.User && review.User.firstName && <span className='reviewIndexItem-username'>{review.User.firstName}</span>}
            <span className='reviewIndexItem-date'>{`${month} ${year}`}</span>
            <p>{review.review}</p>
            <div className='reviewIndexItem-delete-button-container'>
            {currentUser && currentUser.id && review.userId === currentUser.id && <button onClick={() => handleDeleteClick(review.id)}>Delete</button>}
            </div>
        </div>
    )
}

export default ReviewIndexItem;