# react e-commerce webapp

## react-router-dom 6

The Navigation Component is made the Parent Route, which nests other Route components.
within the Navigation component the Navbar and an Outlet component is inserted.
At this point, instead of the Outlet, what was enclosed by the Navigation component is displayed, and depending which path is present, one or the other component is rendered: in this case either Home or Shop

```sh
<Routes>
   <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />         
        <Route path="shop" element={<Shop />} />         
    </Route>    
</Routes>
```

- navigation.component.jsx

```sh
<div className="navigation">
    <div>Logo</div>
    <div className="nav-links-container">
        <Link className="nav-link" to="/shop">
            SHOP
        </Link>    
    </div>
    <Outlet />
</div>
```

--- 

## Firebase as backend

- go to firebase console
- create new projekt 
- install firebase package
  
```sh
npm i firebase
```

- create a sign-in page
- connect firebase instance with the app 
  - create src/utils/firebase/firebase.utils.js
  - go to the firebase console, click the "web" button
  - register your app (choose an appropriate name)
  - copy the firebaseConfig code that you got from firebase and paste it into the firebase.utils.js
  - with the firebase package you have installed a bunch of micro-libraries, that are helping to interact with the firebase instance
  - after the connection is done and handled by initializeApp and the firebase config, which returns an firebase instance, for the authentication you have to use another micro-lib which is under "firebase/auth", from there you need "getAuth" (additionally we need that auth instance), as well as the GoogleAuthProvider and  the functions: signInWithRedirect and signInWithPopup
  - back in firebase console go to Authentication and choose a sign-in method
  - click google, enable it and give it a valid support email-address and hit save
  - and thats all it takes
- if you now test out the logGoogleUser function on your sign-in page, you should get back an Object with many user credentials informations like: 
   - access_token (see below authentication flow)
   - displayName of your google account
   - email address of your google account
   - a uid - unique id
   - and many more
    
---

## Sign-in with Google (Facebook, Github,..) Authentication Flow

Lets say you have 3 services involved: the app, firebase and google.
On google servers there are all the credentials of the users based on their gmail account.
And because the user has authenticated as the person as he say he is, google can share that information with different applications. 
The main purpose is convience because with that service the user doesnt have to create an account for the application, since his authentication status is already verified with google.\
Flow:
- create a button "Sign in with Google" 
- request to the google server, saying: i want to sign in for this user
- the user sees a pop-up where he can choose his google account (or has to type his username & password)
- if the credentials are correct and the person could be verified, google generates an auth token (which is just an unique hashed string)
- google will send that auth_token back to the app
- from there it is gonna send to firebase (or in general: the backend/server)
- but: firebase doesnt know if this auth_token is valid, it cant trust the source where it got the auth_token from (it could be copied somewhere and send it over), so firebase has to check itself if it is a valid auth_token and asks google if it can verify it
- google takes the token und checks if it is the one, that google has issued before
- google would then send a verification token (which confirms that the auth_token is valid) back to Firebase, otherwise it would send an error
- Firebase then knows that the user is valid and creates an access_token (which defines what this specific user is able to access)
- Firebase sends this access token back to the app and for every further request that the user makes (like creating, reading, updating or deleting data) this access_token will be send alongside with the request
- and with this access_token Firebase knows if the user is authorized(!) for the specific (crud) action
- if he is authorized, firebase performs the crud action, and returns an appropriate response back to the app
- and if not authorized, firebase of course returns an appropriate (error-) response to the app as well 

---

## Reducers

The most common libraries inside the react eco-system that you have to get used to when it comes to being a professional React developer is of course Redux.

But in order to understand Redux you will need to understand the concept of a reducer!

As you remember with the context api you have a context inside your app, a build-in state management. 

Lets take the user context as an example:\
This context lives somewhere and wraps the entire app.
You are able to make an update to the user data, that lives inside this User Context. This user data as you know could be anything, but in the case of this app its just a single value: "currentUser"\
..which could be null or the actual user (an object)

The main thing is that the User Context lives outside of the application, in a sense, that it is at the parent level, so that you can get and setCurrentUser from anywhere in the app no matter how far deep down in the component tree it is.

**In other words currentUser is gloablly available in the entire application and we're doing this by leveraging this User Context as a react component, meaning: utilzing useState and useEffect in order to update the value of the UserContext' state inside of this Context component.**

Key thing to remember: This is Reacts context api which is the default state management solution that React ships with.

Its one state management strategy..


Redux on the other hand is an external library, that serves a very similar purpose.

To make the changes of the code understandable i have created a new branch. That way you can follow and reproduce it easier i believe.

So context api and redux are slightly different, and i will break down the differences and why you want to choose one over the other.

But as said, before tackling redux, you first need to understand reducers..

Reducers are simply a pattern for a state management, which is not specific/related to redux. You can actually even use Reducers in the (User-) Context.

If you think about the User Context, it really just holds an object which has the value of currentUser which is either null or an object. A very simple context, that is just storing one thing.

The cart context is a more complex example.   
It contains multiple values: cartItems which is an array of cartItem objects. Additionally it stores the cartCount (an integer that represents the total number of cartItems) and a cartTotal which represents the total cost of goods inside of the cart.

So lets say you want to add a product to the cart. CartContext will of course update the cartItems array with the added product. Also what needs to happen is the update of CartCount and CartTotal. 
These 3 different values all update due to an item being added to the cart.

**And the way that i manage this inside of the CartContext as a react component, is that we have the useEffects that trigger whenever the useState value of the cartItems changes.**

And if you remember in fact each of these 3 values are being stored as separated useStates! How they update is based of of useEffect.
So its a kind of hook architecture that i ve setup inside the context in order to make this work and this is a very react defined way of updating these 3 values. 

Reducers are pretty similar. The Reducer is still an object.

Lets look at the cartReducer: Its an object and stores the same values
(addionally the open/close boolean)

```sh
{
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  isCartOpen: false
}
```

What changes now is that instead of leveraging useState and useEffect in order to update these values, you now utilize something called "action".

An Action is also just an object which has 2 values on it:
- a type value which points to a string
- and it has an optional (!) payload value which can be anything (obj, int, array, undefined, null,..)

And how does the update work?

Lets say you have an Action like:
```sh 
{
    type: "TOGGLE_CART_IS_OPEN"
}
```
you can add an optional payload value like:
```sh
{
  type: "TOGGLE_CART_IS_OPEN",
  payload: undefined
}
```

But in this case it doesnt make sense since we are just toggling the value from true to false and vice versa, the payload isnt neccessary.
And what happens is that only the isCartOpen value reacts to that action.
The other 3 values do not need to update.

Lets say you now want to store a product in the cart with the following action:

```sh
{ 
  type: "ADD_ITEM_TO_CART"
  payload: {...}  // product object
}
```

And the Reducer would take the payload and update the corresponding value that care. (cartItems, cartCount and cartTotal)
In this case the 4th value "isCartOpen" is uneffected by that update.

**Conclusion: reducers are really just these object representations of these values that receive actions. And then these action intern will update the values inside of the reducer object.**

First i start with the change of the previous written userContext with now using a userReducer.

From this point i switch to a new branch which i call "reducers"!
Further explanations in the files that i ll push to that branch.