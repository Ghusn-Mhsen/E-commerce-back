const Fcm = require('../../config/notifications/notifications')


class Notifications {


async sendPushNotification(req, res) {
    try {
     
const {title,body,data,fcm_token} = req.body
      let message = {
        notification:{
            title:title,
            body:body
        },
        data:data,
        token:fcm_token
      }
      Fcm.send(message,(err,res)=>{
        if(err){
            return res.status(500).json({
                message: err,
                status: false,
                data: null,
              });
        }else{
            return res.status(200).json({
                message: "Send Notification  Successfully",
                status: true,
                data: null,
              });
        }
      })

      return res.json({
        message: "get Disputes By Email Successfully",
        status: "success",
        data: dispute,
      });
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }

  async sendTopicNotification(req, res) {
    try {
     
const {title,body,data,topic} = req.body
      let message = {
        notification:{
            title:title,
            body:body
        },
        data:data,
        topic:topic
      }
      Fcm.send(message,(err,res)=>{
        if(err){
            return res.status(500).json({
                message: err,
                status: false,
                data: null,
              });
        }else{
            return res.status(200).json({
                message: "Send Notification  Successfully",
                status: true,
                data: null,
              });
        }
      })

  
    } catch (err) {
      console.log(err);
      return res.json({
        message: err,
        status: false,
      });
    }
  }

}
module.exports = new Notifications()