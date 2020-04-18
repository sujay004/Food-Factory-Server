# FOOD FACTORY APP API DOC
--------------------------

# Dbconfig

Connection Url : mongodb://localhost:27017

db Name : food_factory



# URL

/api/user/create

### Method:

POST

### Example Body Data 

{
		"first_name": "sujay",
          "last_name": "nandha",
          "user_name": "sujay",
          "password": "admin",
          "email_id": "admin@gmail.com",
          "mobile_number": "8056329132",
          "created_at": "2020-04-18T13:28:10.923Z",
          "active":"1"
}




### Example Success Response:

Success Response: 200
Error Response:403



# URL

/api/user/authentication

### Method:

GET

### Query Params 

user_name=admin&password=admin


### Example Success Response:

Success Response: 200
Error Response:403



# URL

/api/user/resetPassword

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

### Example Success Response:

Success Response: 200
Error Response:403


# URL

/api/user/deactive

### Method:

GET

### Query Param


user_name=sujay


### Example Success Response:

Success Response: 200
Error Response:403



# URL

/api/order/getAllOrder

### Method:

GET

### Query Param


user_id=5e9b2fcdcf73c13d4c3d20e4


### Example Success Response:

[{"_id":"5e9b332d412e8d55b412b76e","user_id":"5e9b2fcdcf73c13d4c3d20e4","order_name":"pizza","food_id":"5e9a8ed7f04936dc7abf3f3b","qty":"2","offer_price":"150","original_price":"250","offer_name":"cashback50","active":1}]


# URL

/api/order/create

### Method:

POST

### Body Data 

{
      "user_id": "5e9b2fcdcf73c13d4c3d20e4",
      "order_name": "p_izza with icecream",
      "food_id": "5e9a8ed7f04936dc7abf3f3b",
      "qty": "2",
      "offer_price": "150",
      "original_price": "300",
      "offer_name": "cashback50%",
      "active": 1
}



### Example Success Response:

Success Response: 200
Error Response:403




# URL

/api/ingredient/getThresoldQty

### Method:

GET

### No Params


### Example Success Response:

[{"_id":"5e9a8f15f04936dc7abf3f4f","ingredient_name":"Bread","cost":30,"remaining_qty":50,"vendor_id":"5e9a9275f04936dc7abf4055","available":"1"}]

# URL

/api/ingredient/getBySameVendor

### Method:

GET

### Query Param


vendor_id=5e9a9275f04936dc7abf4055


### Example Success Response:

[{"_id":"5e9a8f15f04936dc7abf3f4f","ingredient_name":"Bread","cost":30,"remaining_qty":50,"vendor_id":"5e9a9275f04936dc7abf4055","available":"1"}]


# URL

/api/food/getListOverSellingCost

### Method:

GET

### No Params


### Example Success Response:

[{"_id":"5e9a8ed7f04936dc7abf3f3b","food_name":"pizza","category":"north_indian","ingredients_id":["2","5","8","7"],"total_ingredients_cost":230,"production_cost":750,"selling_cost":500,"active":1}]
