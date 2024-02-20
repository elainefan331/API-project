import SpotForm from "../SpotForm/SpotForm";

const CreateSpotForm = () => {
    const spot = {
        address: '',
        city: '',
        state: '',
        country: '',
        lat: 0,
        lng: 0,
        name: '',
        description: '',
        price: ''
    };

    return (
        <SpotForm
            spot={spot}
            formType='Create a New Spot'
        />
    )
} 

export default CreateSpotForm;