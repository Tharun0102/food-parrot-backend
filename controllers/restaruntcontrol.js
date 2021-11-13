const Restaurant = require('../models/restaurant');


const registerRestaurant = async (req,res) =>{
    try{
      const newUser = new Restaurant({
        username:req.body.username,
        password:req.body.password,
        restaurantname:req.body.restaurantname,
        address:req.body.address
    })
        await newUser.save();
        // res.render("adminlogin");
        res.send("Successfully Register ");
    }
    catch(error)
    {
        res.status(400).send({error});
    }
    
}


const getRestaurant = async (req,res) => {
    try 
    {
        const {username,password} = req.body;
        const user = await Restaurant.findOne({username});
        if (user && await password===user.password ) 
        {
            res.send("User Found");
            
        } 
        else 
        {
            res.send("User Not Found");
        } 
        
    } 
    catch (error) 
    {
        throw new Error(error.message);
    }
}

module.exports={registerRestaurant,getRestaurant};