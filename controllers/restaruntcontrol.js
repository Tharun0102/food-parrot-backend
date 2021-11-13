const Restaurant = require('../models/restaurant');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerRestaurant = (req, res) => {

    bcrypt.hash(req.body.password,saltRounds, function (err,hash)
   {
       const newUser = new Restaurant({
           username: req.body.username,
           password: hash,
           restaurantname: req.body.restaurantname,
           address: req.body.address
       });
       newUser.save();
       if (err) 
       {
           console.log(err);
       } 
       else 
       {
           res.send("Successfully Register ");
       }
      
   });
   

}

const getRestaurant = (req, res) => {

   const { username, password } = req.body;
   Restaurant.findOne({ username }, function(err,user){
       if (user) 
       {
           bcrypt.compare(password,user.password,function (err,result) {
               if (result===true) 
               {
                   res.send("User Found");
               } 
               else
               {
                   res.send("Wrong Password");
               }
               
           })
           
       }
       else 
       {
           res.send("User Not Found");
       }
   });
}




module.exports = { registerRestaurant, getRestaurant };