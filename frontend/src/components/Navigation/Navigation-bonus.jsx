import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    // <ul>
    <div className='header'>
      {/* <li> */}
        <NavLink to="/">
          {/* <img src='../../../public/icons8-home-100.png' alt='home' className='home-logo' style={{height: "30px", width: "30px"}}/> */}
          <div style={{color: 'green', fontSize: "15px"}}>
          <i className="fa-solid fa-campground" > Camp  with  Dream</i>
          </div>
        </NavLink>
        {/* <NavLink to="/">Home</NavLink> */}
      {/* </li> */}
      {isLoaded && (
        // <li>
          <ProfileButton user={sessionUser} />
        // </li>
      )}
    </div>
    // </ul>
  );
}

export default Navigation;
