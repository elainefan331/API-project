import { useDispatch, useSelector } from 'react-redux';
import { getSpotsOwnedByUserThunk } from '../../store/spots'
import { useEffect } from 'react';
import SpotIndexItem from '../SpotIndexItem/SpotIndexItem';
import { Link } from 'react-router-dom';
import './ManageSpot.css'

const ManageSpot = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots);
    const spots = Object.values(spotsObj);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getSpotsOwnedByUserThunk())
    }, [dispatch])

    return (
        <>
        <h1>Manage Your Spots</h1>
        <button>
        {sessionUser ? (<Link to='/spots/new'>Create a New Spot</Link>) : null}
        </button>
        <section>
            <div className='manage-spot-main'>
                {spots.map((spot) => (
                    <div className="manage-spot-container" key={spot.id}>
                        <SpotIndexItem
                            spot={spot}
                            // key={spot.id}
                        />
                        <div className="spot-actions">
                            <button><Link to={`/spots/${spot.id}/edit`}>Update</Link></button>
                            <button>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        </>
    )

}

export default ManageSpot;