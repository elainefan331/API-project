import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots"
import './DeleteSpotModal.css'

const DeleteSpotModal = ({spotId}) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteSpotThunk(spotId));
        closeModal();
    }

    return (
        <div className="deleteSpotModal-container">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button className='deleteSpotModal-yes-button'onClick={handleDelete}>Yes (Delete Spot)</button>
            <button className='deleteSpotModal-no-button'onClick={closeModal}>No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal;