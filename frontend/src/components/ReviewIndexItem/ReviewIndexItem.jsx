const ReviewIndexItem = ({review}) => {
    // console.log(review.createdAt)
    let date = new Date(review.createdAt)
    let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    let monthNum = date.getMonth()
    let month = monthNames[monthNum]
    // console.log("month", month)
    let year = date.getFullYear()
    // console.log("year", year)

    return (
        <div>
            <h3>{review.User.firstName}</h3>
            <h4>{`${month} ${year}`}</h4>
            <p>{review.review}</p>
        </div>
    )
}

export default ReviewIndexItem;