import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotDetailThunk } from "../../store/spots";
import SpotForm from "../SpotForm/SpotForm";


const UpdateSpotForm = () => {
    const {spotId} = useParams();
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);
    console.log("spots in update spot form", spots)
    const spot = spots[spotId]

    useEffect(() => {
        dispatch(getSpotDetailThunk(spotId))
    }, [dispatch, spotId])

    if(!spot) return (<></>);

    return (
        Object.keys(spot).length > 1 && (
            <>
                <SpotForm
                    spot={spot}
                    formType="Update Spot"
                />
            </>
        )
    )
}

export default UpdateSpotForm;