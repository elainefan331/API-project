import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSpotThunk, createImageThunk, updateSpotThunk } from "../../store/spots";

import './SpotForm.css'


const SpotForm = ({spot, formType}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const [country, setCountry] = useState(spot?.country);
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [description, setDescription] = useState(spot?.description);
    const [name, setName] = useState(spot?.name);
    const [price, setPrice] = useState(spot?.price);
    const [image, setImage] = useState('');
    const [otherImage, setOtherImage] = useState(['', '', '', '']);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const validationObj = {};

        if(country.length < 1) {
            validationObj.country = "Country is required"
        }

        if(address.length < 1) {
            validationObj.address = "Address is required"
        }

        if(city.length < 1) {
            validationObj.city = "City is required"
        }

        if(state.length < 1) {
            validationObj.state = "State is required"
        }

        if(description.length < 30) {
            validationObj.description = "Description needs 30 or more characters"
        }

        if(name.length < 1) {
            validationObj.name = "Name is required"
        }

        if(!price) {
            validationObj.price = "Price per night is required"
        }

        if(image.length < 1) {
            validationObj.image = "Preview image is required"
        }

        setErrors(validationObj)
    }, [country, address, city, state, description, name, price, image])
    
    const handleOtherImage = (index, value) => {
        const updatedOtherImages = [...otherImage];
        updatedOtherImages[index] = value;
        setOtherImage(updatedOtherImages);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        spot = {...spot, address, city, state, country, name, description, price};
        
        // let newErrors = {}
        // if(!name) newErrors.name = "Name is required"
        // if(!price) newErrors.price = "Price is required"
        // if(!image) newErrors.image = "Preview image is required"

        const helper = async() => {
            let fatchedResult;
            if(formType === "Update your spot") {
                fatchedResult = await dispatch(updateSpotThunk(spot, spotId))
            }

            if(formType === "Create a New Spot" && Object.keys(errors).length === 0) {
                // console.log("should not see this")
                fatchedResult = await dispatch(createSpotThunk(spot))
            }
            // console.log("outside of fetch")
            if(fatchedResult.id) {
                if(formType === "Create a New Spot") {
                    const previewImg = {
                        url: image,
                        preview: true
                    }
    
                    await dispatch(createImageThunk(previewImg, fatchedResult.id));
    
                    for(let img of otherImage) {
                        if(img) {
                            const otherImage = {
                                url:img,
                                preview: false
                            };
                            await dispatch(createImageThunk(otherImage, fatchedResult.id));
                        }
                    }
                }

                navigate(`/spots/${fatchedResult.id}`)
            } else {
                // newErrors = {...fatchedResult, ...newErrors}
                // console.log("new errors in spot form", newErrors)
                // setErrors(newErrors)
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
                </label>
                <input
                    type='text' placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            <div>{errors.country && <p className="validation">{errors.country}</p>}</div>
            <label>
                Street Address
                </label>
                <input
                    type='text' placeholder="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />  
            <div>{errors.address && <p className="validation">{errors.address}</p>}</div>

            <div className="spot-form-city-state-container">
                <div className="spot-form-city-container">
                    <label>
                        City
                    </label>
                    <input
                        type='text' placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />  
                    <div>{errors.city && <p className="validation">{errors.city}</p>}</div>
                </div>
                <div className="spot-form-city-state-comma-container">,</div>
                <div className="spot-form-state-container">
                    <label>
                        State
                    </label>
                    <input
                        type='text' placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />  
                    <div>{errors.state && <p className="validation">{errors.state}</p>}</div>
                </div>
            </div>

            <div className="spotForm-divide-line"></div>

            <h3>Describe your place to guests</h3>
            <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
            
            <textarea placeholder="Please write at least 30 characters"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />  
            
            <div>{errors.description && <p className="validation">{errors.description}</p>}</div>
            <div className="spotForm-divide-line"></div>
            <h3>Create a title for your spot</h3>
            <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
            
            <input
                type='text' placeholder="Name of your spot"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />  
            
            <div>{errors.name && <p className="validation">{errors.name}</p>}</div>
            <div className="spotForm-divide-line"></div>
            <h3>Set a base price for your spot</h3>
            <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <label>
                $
                <input className="spotForm-price-input"
                    type='number' step='0.01' placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />  
            </label>
            <div>{errors.price && <p className="validation">{errors.price}</p>}</div>
            <div>
                {formType === "Create a New Spot"? 
            <div>
                <div className="spotForm-divide-line"></div>
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <div className="spotForm-url-input-container">
                    <input className="spotForm-url-input"
                        type='text' placeholder="Preview Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                    <div>{errors.image && <p className="validation">{errors.image}</p>}</div>
                </div>
                {otherImage.map((img, index) => (
                    <div key={index} className="spotForm-url-input-container">
                        <input className="spotForm-url-input"
                            type='text' placeholder="Image URL"
                            value={img}
                            onChange={(e) => handleOtherImage(index, e.target.value)}
                        />
                    </div>
                ))}
            </div> : null
                
                }

            </div>
            <div className="spotForm-submit-button-container">
                <button type="submit">{formType}</button>
            </div>
            <h1>hi</h1>
        </form>
    )
}

export default SpotForm;