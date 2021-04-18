import axios from 'axios';




/**This component is used to send Email from the ContactUs.js component. It is a public service that so
 * the people don't have to be logged in to contact us. It uses the SendGrid API and service for email
 * forwarding
 */
export const sendContactUsEmail = async ({email, subject, message, config}) => {


    try{

        const config = {
            header: {"Content-Type": "application/json"}
        }

        const serverResponse = await axios.post("/api/public/contactus", {email, subject, message, config});

        return serverResponse.data

    }catch(error){

        return error.response.data.error;

    }

}