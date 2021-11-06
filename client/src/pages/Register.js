import React, {useState} from 'react';



export default function Register() {


    const [formState, setFormState] = useState({username: '', email: '', password: ''});


    const handleFormChange = (e) => {
        //destructure properties on target
        const {name, value } = e.target;
        //set formState on targeted field: value
        setFormState({...formState, [name]: value})
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(formState);
        
    }

    return (
        <div className='container'>
            Register Page
            <form onSubmit={handleFormSubmit}>
                <input type='text' placeholder='username' name='username' value={formState.username} onChange={handleFormChange}  />
                <input type='text' placeholder='email' name='email' value={formState.email} onChange={handleFormChange}  />
                <input type='text' placeholder='password' name='password' value={formState.password} onChange={handleFormChange}  />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
