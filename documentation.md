# Food Factory App Backend Api Documentation
--------------------------
# Start Server
    npm start


# Environment Variable File Configuration
    File Name - .env.dev

#### Configuration

    PORT=3000
    APP_ENV=dev
    DB_HOST=localhost
    DB_NAME=food_factory
    DB_PORT=27017
    DB_USER=root
    DB_PASS=root


# URL

    http://localhost:3000/api/user/create

### Method:

POST

### Example Body Data 

      {
	      "first_name": "srihari",
          "last_name": "s",
          "user_name": "srihari",
          "password": "srihari",
          "email_id": "srihari@gmail.com",
          "mobile_number": "9756315489",
          "created_at": "2020-04-18T13:28:10.923Z",
          "active":"1"
      }




### Example Response:

    Success Response: 
    {
        "message": "User Created Successfully..!!"
    }

    Error Response:
    {
        "message": "User Exist..!! Try Different..!!"
    }



# URL

    http://localhost:3000/api/user/authentication?user_name=srihari&password=srihari

### Method:

    GET

### Query Params 

    user_name=srihari&password=srihari


### Example Response:

    Success Response: 
    {"message":"Login Success..!!"}
    Error Response:
    {"message":"Incorrect Credentials..!!"}



# URL

    http://localhost:3000/api/user/resetPassword

### Method:

    GET

### Query Param

    email_id=admin@gmail.com

### Note
    In this api i was implemented sending mail for the new his email id.
    The Location of the Mail Config available in user.js file
### Mail Config
    auth: {
        user: 'xxxx@gmail.com',
        pass: 'xxxxxx'
      }

### Example Response:

Success Response: 200
Error Response:403


# URL

    [/api/user/deactive](http://localhost:3000/api/user/deactive?user_name=srihari)

### Method:

    GET

### Query Param


    user_name=srihari


### Example Response:

    Success Response: 
    {"message":"User Deactivate Success..!!"}



# URL

    [/api/order/getAllOrder](http://localhost:3000/api/order/getAllOrder?user_id=5ea5217568a0ea35d0ed67c8)

### Method:

    GET

### Query Param


    user_id=5ea5217568a0ea35d0ed67c8


### Example Response:

    [{"_id":"5ea52303f3a8a553f0be7c6f","user_id":"5ea5217568a0ea35d0ed67c8","order_name":"pizza","food_id":"5e9a8ed7f04936dc7abf3f3b","qty":"2","offer_price":"150","original_price":"250","offer_name":"cashback50","active":1},{"_id":"5ea523556b516335ccec0018","user_id":"5ea5217568a0ea35d0ed67c8","order_name":"pizza","food_id":"5e9a8ed7f04936dc7abf3f3b","qty":"2","offer_price":"150","original_price":"250","offer_name":"cashback50","active":1},{"_id":"5ea5236a0b255d5fb003ff86","user_id":"5ea5217568a0ea35d0ed67c8","order_name":"pizza","food_id":"5e9a8ed7f04936dc7abf3f3b","qty":"2","offer_price":"150","original_price":"250","offer_name":"cashback50","active":1}]

# URL

    [/api/order/create](http://localhost:3000/api/order/create)

### Method:

    POST

### Body Data 

    {
      "user_id": "5ea5217568a0ea35d0ed67c8",
      "order_name": "pizza",
      "food_id": "5e9a8ed7f04936dc7abf3f3b",
      "qty": "2",
      "offer_price": "150",
      "original_price": "250",
      "offer_name": "cashback50",
      "active": 1
    }


### Example Response:

    Success Response: 
    {
        "message": "Order created successfully..!!"
    }


# URL

    [/api/ingredient/getThresoldQty](http://localhost:3000/api/ingredient/getThresoldQty)

### Method:

    GET

### No Params


### Example Response:

    [{"_id":"5e9a8f15f04936dc7abf3f4f","ingredient_name":"bread","cost":30,"remaining_qty":50,"vendor_id":"5e9a9275f04936dc7abf4055","available":"1"}]

# URL

    [/api/ingredient/getBySameVendor](http://localhost:3000/api/ingredient/getBySameVendor?vendor_id=5e9a9275f04936dc7abf4055)

### Method:

    GET

### Query Param


    vendor_id=5e9a9275f04936dc7abf4055


### Example Response:

    [{"_id":"5e9a8f15f04936dc7abf3f4f","ingredient_name":"bread","cost":30,"remaining_qty":50,"vendor_id":"5e9a9275f04936dc7abf4055","available":"1"}]

# URL

    [/api/food/getListOverSellingCost](http://localhost:3000/api/food/getListOverSellingCost)

### Method:

    GET

### No Params


### Example Response:

    [{"_id":"5e9a8ed7f04936dc7abf3f3b","food_name":"pizza","category":"north_indian","ingredients_id":["5e9a8f15f04936dc7abf3f4f","5","8","7"],"total_ingredients_cost":230,"production_cost":750,"selling_cost":500,"active":1}]
