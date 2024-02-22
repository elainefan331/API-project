import { Link } from 'react-router-dom';
import './SpotIndexItem.css'

const SpotIndexItem = ({spot}) => {
    if(!spot) {
        return <div>Loading...</div>; 
    }

    return (
        <>

        <div className="card" title={spot.name}>
            <Link to={`/spots/${spot.id}`}>
            <div className='card-preview-img-container'>
                <img src={`${spot.previewImage}`}/>
                {/* <img src='../../../pexels-ron-lach-9211816.jpeg'/> */}
                {/* <img src='https://live.staticflickr.com/65535/53539723485_2685405f76_k.jpg' /> */}
            </div>
            <div className='card-content-container'>
                <div className='location-and-price'>
                    <p className='spotIndexItem-city-state'>{spot.city}, {spot.state}</p>
                    <p>${spot.price.toFixed(2)} night</p>
                </div>

                <div style={{color: "orange", fontSize: "12px"}} className='spotIndexItem-stars'>
                    <p>
                    <i className="fa-solid fa-star">{spot.avgRating==="NaN"? "New": spot.avgRating}</i>
                    </p>
                </div>
            </div>
            </Link>
        </div>
        
        </>
    )
}

export default SpotIndexItem;