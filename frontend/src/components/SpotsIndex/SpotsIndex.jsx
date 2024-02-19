import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpotsThunk } from '../../store/spots';
import SpotIndexItem from '../SpotIndexItem/SpotIndexItem';
import './SpotsIndex.css'

const SpotsIndex = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots);
    console.log("spotsObj in SpotsIndex", spotsObj)
    const spots = Object.values(spotsObj);
    

    useEffect(() => {
        dispatch(getAllSpotsThunk())
    }, [dispatch])

    return (
        <section>
            <div className='main'>
                {spots.map((spot) => (
                    <SpotIndexItem
                        spot={spot}
                        key={spot.id}
                    />
                ))}
            </div>
        </section>
    )


}

export default SpotsIndex;