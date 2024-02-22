import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link, useNavigate } from 'react-router-dom';



function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/")
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div>
      <button onClick={toggleMenu} className='user-button'>
        {/* <i className="fas fa-user-circle" /> */}
        <div className='user-icon-container' style={{color: 'green', fontSize: "20px", padding: "2px"}}>
          <i className="fa-solid fa-user"></i>
        </div>
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='login-user-drop-down'>
            <div className='login-user-info-container'>
              <span>Hello, {user.firstName}</span>
              {/* <li>{user.firstName} {user.lastName}</li> */}
              <span>{user.email}</span>
            </div>

            <div className='manage-spots-link-container'>
              <Link to='/spots/current' 
                className='manage-spots-link'
                onClick={closeMenu}
              >
                Manage Spots
              </Link>
            </div>
            {/* <li> */}
            <div className='logout-button-container'>
              <button onClick={logout}>Log Out</button>
            </div>
            {/* </li> */}
          </div>
        ) : (
          <div className='login-signup-container'>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;
