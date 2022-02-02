auth:  
  1. user-register: '/api/user/register', POST 
     payload:{
       name,
       password
     }
  2. user-login: '/api/user/login', POST
      payload:{
       name,
       password
     }
  3. restaurant-register: '/api/restaurant/register',POST
      payload:{
        name,
        password,
        address: {
          street: String,required,
          city: String,required
          zip: String,required
          lat: Number
          long: Number
        }
      }
  4. restaurant-login:'/api/restaurant/login',POST
      payload:{
        name,
        password
      }
User:
  1. get user: '/api/user/:id', GET
  2. edit user:'/api/user/:id', POST
  3. update cart: '/api/user/:id/cart', POST
  4. get cart: '/api/user/:id/cart', GET

restaurant details:
  1. get a restaurant(details): '/api/restaurant/:id', GET
  2. edit restaurant:'/api/restaurant/edit', POST
  3. get all restaurants: '/api/restaurant/all', GET
   =>  get restaurants by search: '/api/restaurant/all/?text="city_name / restaurant"', GET
  4. get restaurant stats: /api/restaurant/:id/stats', GET
  5. add menu item : '/api/restaurant/:id' , POST 
  6. get all menu items: /api/restaurant/:id/all', GET
  
MenuItem: 
  1. get a menu item: '/api/menuItem/:id', GET
  2. edit menu item: '/api/menuItem/:id', POST
  3. delete menu item: '/api/menuItem/:id', DELETE

Orders:
  1. create an order: '/api/order/create', POST
  2. edit an order: '/api/order/:orderId', POST
  3. get all orders: '/api/order/all', POST






