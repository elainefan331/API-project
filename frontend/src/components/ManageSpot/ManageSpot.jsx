import { useDispatch, useSelector } from 'react-redux';
import { getSpotsOwnedByUserThunk } from '../../store/spots'
import { useEffect } from 'react';
import SpotIndexItem from '../SpotIndexItem/SpotIndexItem';
import { Link } from 'react-router-dom';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import { useModal } from '../../context/Modal';
import './ManageSpot.css'

const ManageSpot = () => {
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const spotsObj = useSelector(state => state.spots);
    const spots = Object.values(spotsObj);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getSpotsOwnedByUserThunk())
    }, [dispatch])

    const handleDeleteClick = (spotId) => {
        setModalContent(<DeleteSpotModal spotId={spotId} />)
    }

    return (
        <>
        <h1>Manage Your Spots</h1>
        <button className={sessionUser && spots.length === 0 ? 'manageSpot-create-button' : 'wipe-manageSpot-create-button'}>
        {sessionUser && spots.length === 0 ? (<Link to='/spots/new' className='manageSpot-create-button-link'>Create a New Spot</Link>) : null}
        </button>
        <section>
            <div className='manage-spot-main'>
                {spots.map((spot) => (
                    <div className="manage-spot-container" key={spot.id}>
                        <SpotIndexItem
                            spot={spot}
                            // key={spot.id}
                        />
                        <div className="manage-spot-actions">
                            <button><Link to={`/spots/${spot.id}/edit`}>Update</Link></button>
                            <button onClick={() => handleDeleteClick(spot.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        </>
    )

}

export default ManageSpot;