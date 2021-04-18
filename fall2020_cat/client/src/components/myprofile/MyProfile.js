import './MyProfile.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';







/**This component is used to display the user's information they registered with. It has two table forms and
 * each has its own submit handler functions that send sperate server patch requests to different API endpoints.
 * the user can update their information on their account using this component and is accessible once logged in.
 */
const MyProfile = () => {

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [states, setStates] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [year, setYear] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");

    const [licenseIdNumber, setLicenseIdNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [userInfo, setUserInfo] = useState();

    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [successPersonalChange, setSuccessPersonalChange] = useState(false);
    const [successAccountChange, setSuccessAccountChange] = useState(false);

    const [failPersonalChange, setFailPersonalChange] = useState(false);
    const [failAccountChange, setFailAccountChange] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { userState } = useAuth();


    //
    useEffect(() => {

        getUserData();

    }, []);

    const getUserData = async () => {

        if(userState.loggedIn){

            const config = {
                header: {"Content-Type": "application/json"}
            }

            try {
                //fetch the users personal data to display from the server
                const userData = await axios.get(`/api/auth/userinfo/userdata/${userState.email}`, config);

                console.log("userData: " + JSON.stringify(userData.data.user));

                setFirstName(userData.data.user.firstName);
                setMiddleName(userData.data.user.middleName);
                setLastName(userData.data.user.lastName);
                setAddress(userData.data.user.address);
                setCity(userData.data.user.city);
                setStates(userData.data.user.states);
                setZipcode(userData.data.user.zipcode);
                setMonth(userData.data.user.month);
                setDay(userData.data.user.day);
                setYear(userData.data.user.year);
                setGender(userData.data.user.gender);
                setPhone(userData.data.user.phone);

                setLicenseIdNumber(userData.data.user.licenseIdNumber);
                setUsername(userData.data.user.username);

                setUserInfo(userData.data.user);

                

            } catch (error) {

                console.log(error);
                
            }

        }

    }




    //handler function to set gender in the select dropdown menu
    const selectGenderHandler = Event => {
        setGender(Event);
    }





    //handler function for changing PERSONAL information of the user if anything has changed
    const changePersonalInfoHandler = async (Event) => {
        Event.preventDefault();
        console.log("handlerPersonalInfo");

        //JSON object to send and add to if anything has changed in the inputs
        let userPersonalInfoChanged = { email: userState.email };

        //Check to see if any of the user information has changed and add to the JSON object to send
        if(firstName != userInfo.firstName){
            userPersonalInfoChanged["firstName"] = firstName;
            //test-console.log("firstName has changed");
        }
        if(middleName != userInfo.middleName){
            userPersonalInfoChanged["middleName"] = middleName;
        }
        if(lastName != userInfo.lastName){
            userPersonalInfoChanged["lastName"] = lastName;
            //test-console.log("lastSName has changed");
        }
        if(address != userInfo.address){
            userPersonalInfoChanged["address"] = address;
        }
        if(city != userInfo.city){
            userPersonalInfoChanged["city"] = city;
        }
        if(states != userInfo.states){
            userPersonalInfoChanged["states"] = states;
        }
        if(zipcode != userInfo.zipcode){
            userPersonalInfoChanged["zipcode"] = zipcode;
        }
        if(month != userInfo.month){
            userPersonalInfoChanged["month"] = month;
        }        
        if(day != userInfo.day){
            userPersonalInfoChanged["day"] = day;
        }
        if(year != userInfo.year){
            userPersonalInfoChanged["year"] = year;
        }
        if(gender != userInfo.gender){
            userPersonalInfoChanged["gender"] = gender;
        }
        if(phone != userInfo.phone){
            userPersonalInfoChanged["phone"] = phone;
        }

        const config = {
            header: { "Content-Type": "application/json" }
        }

        try {
            //Change the user's data to update the server
            const userChangedResponse = await axios.patch("/api/auth/userinfo/changeuserdata", userPersonalInfoChanged);

            if(userChangedResponse.data.success){
                setIsSuccess(true);
                setSuccessMessage(userChangedResponse.data.message);

                setSuccessPersonalChange(true); 

                setInterval(() => {
                    setIsSuccess(false);
                    setSuccessPersonalChange(false); 

                }, 5000);
                
            }else{
                setIsError(true); 
                setErrorMessage(userChangedResponse.data.message);

                setFailPersonalChange(true);  

                setInterval(() => {
                    setIsError(false);
                    setFailPersonalChange(false);                   
                }, 5000);
            }
            
        } catch (error) {
            console.log(error);
            
            setIsError(true);
            setErrorMessage("Profile Error: " + error);

            setInterval(() => {
                setIsError(false);
                setErrorMessage("");
            }, 5000 )
        }
    }






    //handler function to change the ACCOUNT information if it has changed
    const changeAccountInfoHandler = async (Event) => {
        Event.preventDefault();
        console.log("handlerAccountInfo");

        //JSON object to send and add to if anything has changed in the inputs
        let userAccountInfoChanged = { email: userState.email };

        //Check to see if any of the user information has changed and add to the JSON object to send
        if(username != userInfo.username){
            userAccountInfoChanged["username"] = username;
            //test-console.log("firstName has changed");
        }
        if(password != newPassword){
            userAccountInfoChanged["password"] = password;
            userAccountInfoChanged["newPassword"] = newPassword;
        }

        try {

            const userAccountChangedResponse = await axios.patch("/api/auth/userinfo/changeaccountdata", userAccountInfoChanged);

            if(userAccountChangedResponse.data.success){
                setIsSuccess(true); 
                setSuccessMessage(userAccountChangedResponse.data.message);

                setSuccessAccountChange(true);  

                setInterval(() => {
                    setIsSuccess(false);
                    setSuccessAccountChange(false); 

                }, 5000);
                
            }else{
                setIsError(true); 
                setErrorMessage(userAccountChangedResponse.data.message);

                setFailAccountChange(true);  

                setInterval(() => {
                    setIsError(false);
                    setFailAccountChange(false);                   
                }, 5000);
            }
            
        } catch (error) {
            console.log(error);
            
            setIsError(true);
            setErrorMessage("Profile Error: " + error);
            
            setInterval(() => {
                setIsError(false);
                setErrorMessage("");
            }, 5000 )
        }

    }





    //the JSX has two tables to display the user information. A Personal table and and Account table. Each has 
    //its own submit handler functions that access different API endpoint. 
    return(

        <>

            <div className="main-grid-layout">

                <p style={{display: isSuccess ? "block" : "none", textAlign: "center", fontSize: "30px", color: "green", fontWeight: "bold"}}>{successMessage}</p> 
                <p style={{display: isError ? "block" : "none", textAlign: "center", fontSize: "20px", color: "red", fontWeight: "bold"}}>{errorMessage}</p>



                <div className="centerProfileContainer">



             
                    <table className="profileTable" style={{float: "left"}}>
                        <tr>
                            <th className="headerStyle" colSpan="2">Personal Information</th>   
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">FIRST NAME</label>
                            </td>
                            <td>
                                <input type="text" id="firstName" placeholder="xxxxx" 
                                    value={firstName} onChange={(Event) => setFirstName(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td >
                                <label className="spanLabel">MIDDLE NAME</label>
                            </td>
                            <td>
                                <input type="text" id="middleName" placeholder="xxxxx" 
                                    value={middleName} onChange={(Event) => setMiddleName(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">LAST NAME</label>
                            </td>
                            <td>
                                <input type="text" id="lastName" placeholder="xxxxx" 
                                    value={lastName} onChange={(Event) => setLastName(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">ADDRESS</label>
                            </td>
                            <td>
                                <input type="text" id="address" placeholder="xxxxx" 
                                    value={address} onChange={(Event) => setAddress(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">CITY</label>
                            </td>
                            <td>
                                <input type="text" id="city" placeholder="xxxxx" 
                                    value={city} onChange={(Event) => setCity(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">STATE</label>
                            </td>
                            <td>
                                <input type="text" id="states" placeholder="xxxxx" 
                                    value={states} onChange={(Event) => setStates(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">ZIPCODE</label>
                            </td>
                            <td>
                                <input type="text" id="zipcode" placeholder="xxxxx" 
                                    value={zipcode} onChange={(Event) => setZipcode(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">MONTH</label>
                            </td>
                            <td>
                                <input type="text" id="month" placeholder="xxxxx" 
                                    value={month} onChange={(Event) => setMonth(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">DAY</label>
                            </td>
                            <td>
                                <input type="text" id="day" placeholder="xxxxx" 
                                    value={day} onChange={(Event) => setDay(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">YEAR</label>
                            </td>
                            <td>
                                <input type="text" id="year" placeholder="xxxxx" 
                                    value={year} onChange={(Event) => setYear(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">GENDER</label>
                            </td>
                            <td>
                            <select className="profileSelect" name="gender" id="gender" placeholder="male" onChange={(Event) => selectGenderHandler(Event.target.value)} >

                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>

                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="spanLabel">PHONE</label>
                            </td>
                            <td>
                                <input type="text" id="phone" placeholder="xxxxx" 
                                    value={phone} onChange={(Event) => setPhone(Event.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style={{textAlign: "center"}}>
                                <button className="buttonOrange" onClick={changePersonalInfoHandler}><h2>Save Changes</h2></button>
                            </td>
                        </tr>
                        <tr >
                            <td colSpan="2" style={{backgroundColor: "#105e7a", textAlign: "center", fontWeight: "bold", fontSize: "25px", color:"white"}}>
                                <span style={{display: successPersonalChange ? "block" : "none"}}>Sucessfully Save Change</span>
                                <span style={{display: failPersonalChange ? "block" : "none"}}>Failed Save Change</span>
                            </td>
                        </tr>
                        
                    </table>




                    <div className="accountInfo">

                        <table className="profileTable">
                                
                            <tr>
                                <th className="headerStyle" colSpan="2">Account Information</th>   
                            </tr>
                            <tr>
                                <td>
                                    <label className="spanLabel">LICENSE NUMBER</label>
                                </td>
                                <td>
                                    <input type="text" id="licenseIdNumber" placeholder="xxxxx" 
                                        value={licenseIdNumber} readOnly/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="spanLabel">USERNAME</label>
                                </td>
                                <td>
                                    <input type="text" id="username" placeholder="xxxxx" 
                                        value={username} onChange={(Event) => setUsername(Event.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="spanLabel">PASSWORD</label>
                                </td>
                                <td>
                                    <input type="password" id="password" placeholder="xxxxx" 
                                        value={password} onChange={(Event) => setPassword(Event.target.value)}  />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label className="spanLabel">NEW PASSWORD</label>
                                </td>
                                <td>
                                    <input type="password" id="newPassword" placeholder="xxxxx" 
                                        value={newPassword} onChange={(Event) => setNewPassword(Event.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" style={{textAlign: "center"}}>
                                    <button className="buttonOrange" onClick={changeAccountInfoHandler}><h2>Change</h2></button>
                                </td>
                            </tr>
                            <tr >
                            <td colSpan="2" style={{backgroundColor: "#105e7a", textAlign: "center", fontWeight: "bold", fontSize: "25px", color:"white"}}>
                                <span style={{display: successAccountChange ? "block" : "none"}}>Sucessfully Save Change</span>
                                <span style={{display: failAccountChange ? "block" : "none"}}>Failed Save Change</span>
                            </td>
                        </tr>
                        
                        </table>
                    </div>

                <div>
                
                
                </div>

                <br/>
            </div>

            </div>

        </>

    );
}



export default MyProfile;