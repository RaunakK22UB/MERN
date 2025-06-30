import {Link} from 'react-router-dom';

function Error(){
    return(
        <div className="container text-center">
            <h1>something went wrong </h1>
            <Link to="/">Go to Home</Link>

            </div>
    )
}
export default Error;