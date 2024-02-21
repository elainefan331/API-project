import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteReviewThunk } from '../../store/reviews'

const DeleteReviewModal = ({reviewId, reviewDelete}) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = async(e) => {
        e.preventDefault();
        await dispatch(deleteReviewThunk(reviewId));
        reviewDelete();
        closeModal();
    }

    return (
        <div>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={handleDelete}>Yes (Delete Review)</button>
            <button onClick={closeModal}>No (Keep Review)</button>
        </div>
    )
}

export default DeleteReviewModal;