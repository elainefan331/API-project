import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';
import { Link } from 'react-router-dom'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    // <ul>
    <div className='header'>
      {/* <li> */}
        <NavLink to="/">
          {/* <img src='../../../public/icons8-home-100.png' alt='home' className='home-logo' style={{height: "30px", width: "30px"}}/> */}
          <div style={{color: 'green', fontSize: "15px"}}>
          <i className="fa-solid fa-campground nav-logo" > Camp  with  Dream</i>
          </div>
        </NavLink>
        {/* <NavLink to="/">Home</NavLink> */}
      {/* </li> */}
      <div className='create-spot-user-button-container'>
      <button className={sessionUser? 'navigation-create-newSpot-link-button' : 'wipe-navigation-create-newSpot-link-button'}>
        {sessionUser ? (<Link to='/spots/new'>Create a New Spot</Link>) : null}
      </button>

      {isLoaded && (
        // <li>
          <ProfileButton user={sessionUser} />
        // </li>
      )}
      </div>
    </div>
    // </ul>
  );
}

export default Navigation;
