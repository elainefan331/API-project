import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSpotThunk } from "../../store/spots";
import './SpotForm.css'


const SpotForm = ({spot, formType}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [country, setCountry] = useState(spot?.country);
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [description, setDescription] = useState(spot?.description);
    const [name, setName] = useState(spot?.name);
    const [price, setPrice] = useState(spot?.price);
    const [image, setImage] = useState('');
    const [errors, setErrors] = useState({});
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        spot = {...spot, address, city, state, country, name, description, price};
        
        let newErrors = {}
        if(!name) newErrors.name = "Name is required"
        if(!price) newErrors.price = "Price is required"
        if(!image) newErrors.image = "Preview image is required"

        const helper = async() => {
            let fatchedResult;
            if(formType === "Create a New Spot") {
                fatchedResult = await dispatch(createSpotThunk(spot))
            }

            if(fatchedResult.id) {
                // const image = {
                //     img
                // }
                navigate(`/spots/${fatchedResult.id}`)
            } else {
                newErrors = {...fatchedResult, ...newErrors}
                console.log("new errors in spot form", newErrors)
                setErrors(newErrors)
                console.log("errors in spot form", errors)
            }
        }
        
        helper();
    }

    
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>{formType}</h2>
            <h3>Where&apos;s your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <label>
                Country
                <input
                    type='text' placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </label>
            <div>{errors.country && <p className="validation">{errors.country}</p>}</div>
            <label>
                Street Address
                <input
                    type='text' placeholder="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />  
            </label>
            <div>{errors.address && <p className="validation">{errors.address}</p>}</div>
            <label>
                City
                <input
                    type='text' placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />  
            </label>
            <div>{errors.city && <p className="validation">{errors.city}</p>}</div>
            <label>
                State
                <input
                    type='text' placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                />  
            </label>
            <div>{errors.state && <p className="validation">{errors.state}</p>}</div>
            {/* <label>
                Latitude
                <input
                    type='text'
                    // value={address}
                    // onChange={(e) => }
                />  
            </label>
            <label>
                Longitude
                <input
                    type='text'
                    // value={address}
                    // onChange={(e) => }
                />  
            </label> */}
            <h3>Describe your place to guests</h3>
            <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
            <label>
                <textarea placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />  
            </label>
            <div>{errors.description && <p className="validation">{errors.description}</p>}</div>
            <h3>Create a title for your spot</h3>
            <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
            <label>
                <input
                    type='text' placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />  
            </label>
            <div>{errors.name && <p className="validation">{errors.name}</p>}</div>
            <h3>Set a base price for your spot</h3>
            <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <label>
                $
                <input
                    type='number' step='0.01' placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />  
            </label>
            <div>{errors.price && <p className="validation">{errors.price}</p>}</div>
            <h3>Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>
                <div>
                    <input
                        type='text' placeholder="Preview Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                    <div>{errors.image && <p className="validation">{errors.image}</p>}</div>
                </div>
                <div>
                    <input type='text' placeholder="Image URL" />
                </div>
                <div>
                    <input type='text' placeholder="Image URL" />
                </div>
                <div>
                    <input type='text' placeholder="Image URL" />
                </div>
                <div>
                    <input type='text' placeholder="Image URL" />
                </div>
            <button type="submit">Create Spot</button>
        </form>
    )
}

export default SpotForm;