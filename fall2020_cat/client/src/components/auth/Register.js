import './auth.css';
import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

/**This component is used to register the user. It takes the required fields and sends them to the server.
* First it checks if the user is already logged in. If so then it immediately redirects them to the root page.
* Once registered, it redirects them to the root homepage. The user can register using a company license Id number
* or purchase the course using STRIPE. The stripe developer API is used to processing the payments on the 
* server side.
*/
const RegisterScreen = ( ) => {

    //message to confirm the user is registered and redirected to root /
    const[registeredMessage, setRegisteredMessage] = useState("");

    //state functions to set state variables
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //account type and total to purchase
    const [accountType, setAccountType] = useState("self");
    const [licensetotal, setLicenseTotal] = useState(1);
    const [billingAmount, setBillingAmount] = useState(150);

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [states, setStates] = useState("CA");
    const [zipcode, setZipcode] = useState("");

    const [month, setMonth] = useState("January");
    const [day, setDay] = useState("1");
    const [year, setYear] = useState("2000");
    const [gender, setGender] = useState("male");
    const [phone, setPhone] = useState("");

    //payment state setters
    const [licenseIdNumber, setlicenseIdNumber] = useState("");
    const [registeredOrgName, setRegisteredOrgName] = useState("");
    const [usingCreditCard, setUsingCreditCard] = useState(false);
    

    //organization state setters
    const [orgName, setOrgName] = useState("");
    const [orgAddress, setOrgAddress] = useState("");
    const [orgCity, setOrgCity] = useState("");
    const [orgStates, setOrgStates] = useState("");
    const [orgZipcode, setOrgZipcode] = useState("");
    const [orgPhone, setOrgPhone] = useState("");

    //used to set visiblity of registration order review text
    const [isVisible, setVisiblity] = useState(false);

    //used to toggle disable for organization information input textboxes
    const [isSinglePerson, setIsSinglePerson] = useState(false);
    const [role, setRole] = useState("user");


    const [showLicenseCode, setShowLicenseCode] = useState(false);
    const [showCreditCard, setShowCreditCard] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    //used to display which type of payment method the user will use. Redemption license code or credit card
    const displayLicenseCodeInputs = () => {
        //no credit card because using a license code
        setUsingCreditCard(false);

        //display method
        setShowLicenseCode(true);
        setShowCreditCard(false);
    }

    const displayCreditCardInputs = () => {
        setUsingCreditCard(true);
        //no license code using a credit card
        setlicenseIdNumber("");
        setRegisteredOrgName("");//no license, so no registered organization 

        //display method
        setShowLicenseCode(false);
        setShowCreditCard(true);

    }


    //calcultate the total price for the course licenses to purchase
    const setLicenseTotalandCalculateBill = Event =>{
        setLicenseTotal(Event);
        let billTotal = Event*150;
        setBillingAmount(billTotal);
    }

    //handler function to set account type in the select dropdown menu
    const selectAccountHandler = Event => {
        setAccountType(Event);
        //test-console.log(Event);
    }
    //handler function to set gender in the select dropdown menu
    const selectGenderHandler = Event => {
        setGender(Event);
        //test-console.log(Event);
    }
    //handler function to set role type in the select dropdown menu
    const selectRoleHandler = Event => {
        setRole(Event);
    }

    //this function disables the organization information input textboxes if the checkbox is clicked for a single
    //user license and set all organization input textboxs to blank
    const toggleTextboxDisabled = (value) => {
        //test-console.log(value);
        setIsSinglePerson(!isSinglePerson);

        setOrgName("");
        setOrgAddress("");
        setOrgCity("");
        setOrgStates("");
        setOrgZipcode("");
        setOrgPhone("");

    }

    const { userState, login } = useAuth();

    // review form div is attached to this ref, so we can use it in JavaScript and scroll to div manually
    const reviewFormRef = useRef(null);
    const history = useHistory();

    //used to process stripe credit card payments
    const stripe = useStripe();
    const elements = useElements();

    let startyear = (new Date()).getFullYear();
    const years = Array.from(new Array(100), (val, index) => startyear - index );




    useEffect(() => {
        if (isVisible) 
        {
            reviewFormRef.current.scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
        }
    }, [isVisible])

    //check to see if the user has already been authenticated by loggin if they have the authToken. 
    //Redirect to root if logged when this functional component first renders
    useEffect(() => {
        if( userState.loggedIn){
            //$*localStorage.getItem("authToken")){
            
            history.push("/");
        }
    }, [history]);





    //form submit handler to set and send username, email, password to node server
    const registerHandler = async (Event) => {
        Event.preventDefault();

        setIsProcessing(true);

        //make sure the passwords match or set error message and reset in 5 sec
        if(password != confirmpassword) {
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);

            return setErrorMessage("Enter a password that matches");
        }

        // check if user is at 0 quanity
        if ( licensetotal < 1 )
        {
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
            return setErrorMessage("You must have a quantity of at least 1 license!");
        }

        const userDetails = {
            username, 
            email, 
            password,

            accountType,
            licensetotal,
            billingAmount,

            firstName,
            middleName,
            lastName,
            address,
            city,
            states,
            zipcode,
            month,
            day,
            year,
            gender,
            phone,

            isSinglePerson,
            role,

            orgName,
            orgAddress,
            orgCity,
            orgStates,
            orgZipcode,
            orgPhone,

            registeredOrgName,
            licenseIdNumber,  
            usingCreditCard
        }
        
        //configuration file for Axios to set a header line content type to application/json
        const config = {
            header: {"Content-Type": "application/json" }
        }

        //try to send register data to node server via Axios
        try {



            //The user had a COMPANY LICENSE CODE to be able to register
            if(showLicenseCode){

                const serverData = await axios.post("/api/auth/register", userDetails);

            }



            //The user is going to use their CREDIT CARD to register
            if(showCreditCard){

                //this is used to get the payment method id from stripe  to charge the user on the backend
                //country code is hard coded because the course will only qualify in CA, USA
                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: "card",
                    card: elements.getElement(CardElement),

                    billing_details: {
                        email: email,
                        name: firstName + " " + middleName + " " + lastName,
                        phone: phone,
                        address: {
                            city: city,
                            country: "US",
                            line1: address,
                            state: states
                        }
                    }

                });


                if(!error){
                    console.log(paymentMethod);
                    //extracting the stripe payment method id 
                    const { id } = paymentMethod;

                    //adding the payment method id to the billing details to send to the server backend to charge
                    userDetails["stripeId"] = id;

                    console.log(userDetails);

                    //sending the user details along with stripe payment method id and bill price in pennies
                    const serverData = await axios.post("/api/auth/register", userDetails);

                    console.log(serverData.data);

                }else{
                    setErrorMessage(error.message);
                    setIsProcessing(false);
                }

               
            }
            


            //extract token and save to local storage for authorization permission proving logged in
            //localStorage.setItem("authToken", serverData.token);
            setRegisteredMessage("You have been registered, Please login in");

            //redirect page back to root homepage
            setTimeout(() => {
                
                history.push("/login");
            },
            5000);

        } catch (error) {
            setErrorMessage(error.response.data.error);
            setIsProcessing(false);

 /*           //Set the error message to empty in 5 sec
            setTimeout(() => {
                setErrorMessage("");
            },
            5000);*/
        }

    }//registerHandler






    //custom payment method choice button css styles
    const paymentButton = {
        padding: "10px",
        margin: "10px",
        backgroundColor: "lightblue",
        color: "black",
        border: '1px solid black',

    }

/*// This is replaced with the stripe developer API elements component

    <label htmlFor="creditcard">Credit Card Number:</label>
    <input 
        type="text" 
        id="creditcard" 
        placeholder="Card Number" 
        value={creditcard} 
        onChange={(Event) => setCreditCard(Event.target.value)} 
    /> 

    */

    //This is used to style the Stripe credit card box according to the Strip API
    const cardElementOptions = {

        style: {

            base: {
                fontSize: "25px",
                border: "1px solid black",
                color: "black",
                "::placeholder": {
                    color: "orange"
                }

            },
            invalid: {

            },
            complete: {
                color: "green" 
                    },
        },
        

    }






    return(
        <div className='register-grid-layout backColorOrange'>

            <div className="centerRegistrationContainer" >


                <form   onSubmit={registerHandler}>
                    <br/>
                    <center>
                    <label><h1> Registration</h1></label>
                    </center>
                    <br/>

                    <div className='form-group'>  
                        <label htmlFor="username">Username:</label>
                        <input 
                            type="text" 
                            required id="username" 
                            placeholder="Enter Username" 
                            value={username} 
                            onChange={(Event) => setUsername(Event.target.value)} 
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="text" 
                            required id="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(Event) => setEmail(Event.target.value)} 
                        /> 
                    </div> 
                            
                    <div className='form-group'>
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            required id="password" 
                            placeholder="Enter Password" 
                            value={password} minLength='8' 
                            onChange={(Event) => setPassword(Event.target.value)} 
                        />  
                    </div>

                    <div className='form-group'>
                        <label htmlFor="confirmpassword">Confirm Password:</label>
                        <input 
                            type="password" 
                            required id="confirmpassword" 
                            placeholder="Comfirm Password" 
                            value={confirmpassword} 
                            minLength='8' 
                            onChange={(Event) => setConfirmPassword(Event.target.value)} 
                        />        
                    </div>

                    <br/>
                    <br/>

                    <div className='form-group'>  
                        <label htmlFor="firstName">First name:</label>
                        <input 
                            type="text" 
                            required id="firstName" 
                            placeholder="First Name" 
                            value={firstName} 
                            onChange={(Event) => setFirstName(Event.target.value)} 
                        />
                    </div>
                
                    <div className='form-group'>  
                        <label htmlFor="middleName">Middle name:</label>
                        <input 
                            type="text" 
                            required id="middleName" 
                            placeholder="Middle Name" 
                            value={middleName} 
                            onChange={(Event) => setMiddleName(Event.target.value)} 
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="lastName">Last Name:</label>
                        <input 
                            type="text" 
                            required id="lastName" 
                            placeholder="Last Name" 
                            value={lastName} 
                            onChange={(Event) => setLastName(Event.target.value)} 
                        /> 
                    </div> 
                            
                    <div className='form-group'>
                        <label htmlFor="address">Address:</label>
                        <input 
                            type="text" 
                            required id="address" 
                            placeholder="Address" 
                            value={address} 
                            onChange={(Event) => setAddress(Event.target.value)} 
                        />  
                    </div>
                    
                    <div className='form-group'>
                        <label htmlFor="city">City:</label>
                        <input 
                            type="text" 
                            required id="city" 
                            placeholder="City" 
                            value={city} 
                            onChange={(Event) => setCity(Event.target.value)} 
                        />        
                    </div>


                
                        <label htmlFor="states">State:</label>

                        <select name="states" id="states" placeholder="CA" onChange={(Event) => setStates(Event.target.value)} >

                        <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>

                        </select>
                    


                
                    <div className='form-group'>  
                        <label htmlFor="zipcode">Zip Code:</label>
                        <input 
                            type="text" 
                            required id="zipcode" 
                            placeholder="Zip Code" 
                            value={zipcode} 
                            onChange={(Event) => setZipcode(Event.target.value)} 
                        />
                    </div>
            

                    <div className='form-group'>
                        <label htmlFor="month">Month:</label>

                        <select name="month" id="month" placeholder="01" onChange={(Event) => setMonth(Event.target.value)} >

                        <option value="" selected disabled hidden>Choose Month</option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>

                        </select>
                    </div>


                    <div className='form-group'>
                        <label htmlFor="day">Day:</label>

                        <select name="day" id="day" placeholder="01" onChange={(Event) => setDay(Event.target.value)} >

                        
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>

                        </select>
                    </div>
                            
                    
                    <div className='form-group'>
                        <label htmlFor="year">year:</label>

                        <select name="year" id="year" placeholder="1950" onChange={(Event) => setYear(Event.target.value)} >

                        { years.map((year, index) => {
                                return <option key={`year${index}`} value={year}>{year}</option>
                            })}

                        </select>
                    </div>

                    <div className='form-group'>
                        <label htmlFor="gender">Gender:</label>

                        <select name="gender" id="gender" placeholder="male" onChange={(Event) => selectGenderHandler(Event.target.value)} >

                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>

                        </select>
                    </div>

                    <div className='form-group'>
                        <label htmlFor="phone">Phone Number:</label>
                        <input 
                            type="tel" 
                            required id="phone" 
                            placeholder="Phone" 
                            value={phone} 
                            onChange={(Event) => setPhone(Event.target.value)} />  
                    </div>

                    <br/>
                    <br/>

                    <div className='form-group'>
                        
                        <label htmlFor="accountType">Choose Account Type: </label>

                        <select required name="accountType" id="accountType" placeholder="self" onChange={(Event) => selectAccountHandler(Event.target.value)} >

                            <option value="self">Self</option>
                            <option value="school">School</option>
                            <option value="business">Business</option>
                            <option value="government">Government</option>
                            <option value="nonProfit">Non-Profit</option>

                        </select>
                    </div>

                    <div className='form-group'>
                        <label htmlFor="licensetotal">Number of Licenses:</label>
                        <input 
                            type="number" 
                            required id="licensetotal" 
                            placeholder="License total" 
                            value={licensetotal} 
                            onChange={(Event) => setLicenseTotalandCalculateBill(Event.target.value)} 
                        />        
                    </div>

                    <div className='form-group'>
                        
                        <label htmlFor="role">Your Role: </label>

                        <select required name="role" id="role" placeholder="user" onChange={(Event) => selectRoleHandler(Event.target.value)} >

                            <option value="user">User</option>
                            <option value="admin">Admin</option>

                        </select>
                    </div>

                        
                    <br/>
                    <br/>

                    <center>

                    <h1 className='large'>Organization Information</h1>
                    

                    <br/>

                    <h4 style={{color: "orange", fontSize: "20px"}}>If you are registering a single license for yourself please check the box</h4>
                    
                    </center>
                    
                    <input 
                        type="checkbox" 
                        id="self" 
                        name="self" 
                        value='true' 
                        onClick={(value) => toggleTextboxDisabled(value)}
                    />
                    <br/>

                    <div className='form-group'>  
                        <label htmlFor="orgName">Organization:</label>
                        <input 
                            type="text" 
                            required={isSinglePerson} 
                            id="orgName" 
                            placeholder="Organization Name" 
                            value={orgName} 
                            disabled={isSinglePerson} 
                            onChange={(Event) => setOrgName(Event.target.value)} 
                        />
                    </div>  

                    <div className='form-group'>
                        <label htmlFor="orgAddressOrg">Address:</label>
                        <input 
                            type="text" 
                            required={isSinglePerson} 
                            id="orgAddress" 
                            placeholder="Address" 
                            value={orgAddress} 
                            disabled={isSinglePerson} 
                            onChange={(Event) => setOrgAddress(Event.target.value)} 
                        />  
                    </div>
                    
                    <div className='form-group'>
                        <label htmlFor="orgCity">City:</label>
                        <input 
                            type="text" 
                            required={isSinglePerson} 
                            id="orgCity" 
                            placeholder="City" 
                            value={orgCity} 
                            disabled={isSinglePerson} 
                            onChange={(Event) => setOrgCity(Event.target.value)} 
                        />        
                    </div>

                    <div className='form-group'>  
                        <label htmlFor="orgStates">State:</label>
                        <input 
                            type="text" 
                            required={isSinglePerson} 
                            id="orgStates" 
                            placeholder="State" 
                            value={orgStates} 
                            disabled={isSinglePerson} 
                            onChange={(Event) => setOrgStates(Event.target.value)} 
                        />
                    </div>
                
                    <div className='form-group'>  
                        <label htmlFor="orgZipcode">Zip Code:</label>
                        <input 
                            type="text" 
                            required={isSinglePerson} 
                            id="orgZipcode" 
                            placeholder="Zip Code" 
                            value={orgZipcode} 
                            disabled={isSinglePerson} 
                            onChange={(Event) => setOrgZipcode(Event.target.value)} 
                        />
                    </div>

                    <div className='form-group'>  
                        <label htmlFor="orgPhone">Phone Number:</label>
                        <input 
                            type="tel" 
                            required={isSinglePerson} 
                            id="orgPhone" 
                            placeholder="Phone" 
                            value={orgPhone} 
                            disabled={isSinglePerson} 
                            onChange={(Event) => setOrgPhone(Event.target.value)} 
                        />
                    </div>
                    
                    <div className='form-group'>
                        <br/>

                        <div className='button-holder'>
                            <button onClick={() => setVisiblity(true)} type="button" className="form-button"><h2>Review</h2></button>
                        </div>
                    
                    </div>

                    {/**This following JSX code is used to show and confirm the user register information so
                     * they can change it if need and they then enter a company license id number previousely 
                     * purchased by a representaitve or admin. Or they can purchase the course vie Stripe with
                     * a credit/debit card
                     */}

                    <div ref={reviewFormRef} style={{display: isVisible ? 'block' : 'none'}}>

                        <br/>
                        <br/>
                        <hr/>

                        <h2>Review Registration Information</h2>

                        <div style={{margin: 10}}>
                            <table>
                                <tr>
                                    <th>Information</th>
                                    <th className="marginLeft50">User Entry</th>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Username:</span></td>
                                    <td><span className="formReviewEntry">{username}</span></td>
                                
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Email:</span></td>
                                    <td><span className="formReviewEntry">{email}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">First Name:</span></td>
                                    <td><span className="formReviewEntry">{firstName}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Middle Name:</span></td>
                                    <td><span className="formReviewEntry">{middleName}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Last Name:</span></td>
                                    <td><span className="formReviewEntry">{lastName}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Address:</span></td>
                                    <td><span className="formReviewEntry">{address}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">City:</span></td>
                                    <td><span className="formReviewEntry">{city}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">State:</span></td>
                                    <td><span className="formReviewEntry">{states}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Zip Code:</span></td>
                                    <td><span className="formReviewEntry">{zipcode}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">month:</span></td>
                                    <td><span className="formReviewEntry">{month}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">day:</span></td>
                                    <td><span className="formReviewEntry">{day}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">year:</span></td>
                                    <td><span className="formReviewEntry">{year}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Gender:</span></td>
                                    <td><span className="formReviewEntry">{gender}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Phone Number:</span></td>
                                    <td><span className="formReviewEntry">{phone}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Account Type:</span></td>
                                    <td><span className="formReviewEntry">{accountType}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">License Total:</span></td>
                                    <td><span className="formReviewEntry">{licensetotal}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Organization:</span></td>
                                    <td><span className="formReviewEntry">{orgName}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Address:</span></td>
                                    <td><span className="formReviewEntry">{orgAddress}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">City:</span></td>
                                    <td><span className="formReviewEntry">{orgCity}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">State:</span></td>
                                    <td><span className="formReviewEntry">{orgStates}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Zip Code:</span></td>
                                    <td><span className="formReviewEntry">{orgZipcode}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Phone Number:</span></td>
                                    <td><span className="formReviewEntry">{orgPhone}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="formReviewLabel">Price of license:</span></td>
                                    <td><span className="formReviewEntry">${billingAmount}</span></td>
                                </tr>
                            
                            </table>
                            
                            <br/>
                        </div>
                        
                        <hr/>
                        <br/>

                        <center>

                        <h1 className='large'>Payment Information</h1>

                        <br/>

                        <span style={paymentButton} onClick={() => displayLicenseCodeInputs()} >Code Number</span>  <span style={paymentButton} onClick={() => displayCreditCardInputs()} >Credit Card</span>

                        <br/>
                        <br/>
                        <br/>



                        <div style={{display: showLicenseCode ? 'block' : 'none'}}>

                            

                            
                            <h2>License Company Code method:</h2>

                            <div className='form-group'>
                                <label htmlFor="registeredOrgName">Registered Organization Name:</label>
                                <br/>
                                <input 
                                    type="text" 
                                    id="registeredOrgName" placeholder="Registered Organization" 
                                    value={registeredOrgName} 
                                    onChange={(Event) => setRegisteredOrgName(Event.target.value)} 
                                />  
                            </div>

                            <br/>
                        
                            <div className='form-group'>
                                
                                <label htmlFor="licenseIdNumber">License Id Number:</label>
                                <br/>
                                <input 
                                    type="text" 
                                    id="licenseIdNumber" 
                                    placeholder="License Id Number" 
                                    value={licenseIdNumber} 
                                    onChange={(Event) => setlicenseIdNumber(Event.target.value)} 
                                />  
                            </div>

                            <br/>

                            <button type="submit" className="form-button"><h2>Submit code and Register</h2></button>

                        
                        </div>




                        <div style={{display: showCreditCard ? 'block' : 'none'}}>
                            <h2>Credit Card payment method:</h2>
                                    
                                <br/>

                                <div style={{border: "1px solid black", borderRadius: "10px"}}>
                                    <CardElement options={ cardElementOptions}/>
                                </div>

                                <br/>
                                
                                <button type="submit" className="form-button" disabled={isProcessing}> { isProcessing ? <h2>Processing...</h2> : <h2>Pay and Register</h2>} </button>

                            
                        </div>

                        </center>
                        
                        <br/>

                        <span style={{fontSize: "20px", color: 'green'}}>{ registeredMessage }</span>
                        <span style={{fontSize: "20px", color: 'red'}}>{ errorMessage }</span> 
                        {errorMessage && <span> you have an error </span>}

                        <br/>

                        <span >Already have an account? <Link to="/login">Login</Link></span>

                    </div>

                    <br/>  

                </form>

            </div>
            
        </div>
    );

}





export default RegisterScreen



