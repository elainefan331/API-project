import { Link } from 'react-router-dom';
import './SpotIndexItem.css'

const SpotIndexItem = ({spot}) => {
    return (
        <>

        <div className="card">
            <Link to={`/spots/${spot.id}`}>
            <div className='card-img-container'>
                {/* <img src={`${spot.previewImage}`}/> */}
                {/* <img src='../../../pexels-ron-lach-9211816.jpeg'/> */}
                <img src='https://live.staticflickr.com/65535/53539723485_2685405f76_k.jpg' />
            </div>
            <div className='card-content-container'>
                <div className='location-and-price'>
                    <p>{spot.name}</p>
                    <p>{spot.city}, {spot.state}</p>
                    <p>${spot.price} night</p>
                </div>

                <div style={{color: "orange", fontSize: "12px"}}>
                    <i className="fa-solid fa-star">{spot.avgRating}</i>
                </div>
            </div>
            </Link>
        </div>
        
        </>
    )
}

export default SpotIndexItem;