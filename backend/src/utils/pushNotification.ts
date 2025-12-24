
//@ts-ignore
import FCM  from 'fcm-notify'

const serverKey = "../config/pos-software-test-firebase-adminsdk-9uk3u-2dd43ecc1c.json"
var fcm = new FCM(serverKey);

const pushNotification = (token: string, title:string, body:string, data: string) => {
    
    let message = {
        token,
       
        notification: {
            title,
            body,          
        },
        data: {  
            notification: data,
        }
    }
    //@ts-ignore
    return fcm.send(message, function (err, response) {
        
    })


};

export default pushNotification;