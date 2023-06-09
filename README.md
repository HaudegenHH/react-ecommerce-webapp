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

First i start with the change of the previous written userContext with now using a userReducer. Then i migrate over the cartContext with a cartReducer.
And finally ill migrate to using Redux.

---
### New branch for transitioning to Redux via useReducer 

- created Context with reducers (useReducer hook) on the branch "reducers"

---

## Redux Flow

![Alt text](./redux_flow.jpg?raw=true "Title")

Redux has 3 core concepts: Store, Action and Reducer: 
  
- A store holds the state of the application\
- An action describes the changes in the state of the application\
- A reducer actually carries out the state transition depending on the action

The 3 principles en detail:

**1. principle\
"The state of your whole application is stored in an object tree within a single store"\
Meaning: Maintain your application state in a single object which would be managed by the Redux store.**

Lets assume you have a shop page and you are tracking the number of products

```sh
{
  products: 10
}
```

**2. principle\
"The only way to change the state is to emit an action, an object descibing  what happened"**

In simple terms:
If you want to update the state of your app, you need to let Redux know about that with an action. (you are not allowed to directly update the state object)**

shop example: someone wants to buy a product\
The action would be an object with a type property (indicating the intention):

```sh
{
  type: 'BUY_PRODUCT'
}
```

Fazit: State is readonly and the only way to change it is to emit/dispatch an action which is an object that describes what happens (what has to happen)

**3. principle\
"To specify how the state tree is transformed by actions, you write pure reducers"**

How the state is updated tells the 3rd principle. It tells to write pure fn to to determine how the state changes.

Pure reducers are simply pure functions that take the previous state and an action as inputs return the new state:

Reducer - (prevState, action) => newState

And being pure fn the reducer instead of updating the previous state, should return a newState object

in the shop example what has to happend inside the reducer?
A product is taken off the shelf, and the products count is reduced by 1.
in code it would be simplified:

```sh
const reducer = (state, action) => {
  switch (action.type) {
    case BUY_PRODUCT: return {
      numOfProducts: state.numOfProducts - 1
    }
  }
}
```

So the reducer is a function that accepts the current state and the action as parameters. Based on what the action.type is, a new state object is returned.

### Actions
Usually you'd use String constants..

```sh
const BUY_PRODUCT = 'BUY_PRODUCT'

function buyProduct() {
  return {
    type: BUY_PRODUCT,
    info: 'first redux action'
  }
} 
```

This fn is called an action creator cause its returns the action object with the type property.

If you follow the diagram the next "station" after the action would be the Reducer.
Actions only describe what happened but they dont describe how the application state changes. Thats what reducers are in charge of. 
In terms of code the reducers are functions thats accepts state and action as arguments and return the next state.

in the shop example we just keep track of one numeric value: the number of products, which represents the state.
According to principle no1 the state has to be represented by a single object:

```sh
const initialState = {
  numOfProducts: 10
} 
```

That initialState you pass as the default value for the state parameter into the reducer function.

```sh
const reducer = (state = initialState, action) => {
  switch(action.type) {
    case BUY_PRODUCT: 
       return {
          numOfProducts: state.numOfProducts - 1
       }
     default: return state
  }
}
```

If there is an action what you havent accounted for, you simply return the state as it is in the default case. 

Important to note is, that if BUY_PRODUCT case runs, you are not mutating the state object you are returning a new object!

If there are more than one property to keep track of, you want to spread out the values from the previous state object (...state) and overwrite only that values that needs to be be changed.

```sh
const reducer = (state = initialState, action) => {
  switch(action.type) {
    case BUY_PRODUCT: 
       return {
          ...state,
          numOfProducts: state.numOfProducts - 1
       }
     default: return state
  }
}
```

### Redux Store
- holds app state
- allows access to state via getState()
- allows state to be updated via dispatch(action)
- registers listeners via subscribe(listener)
- handles unregistering of listeners via the function returned by: subscribe(listener)

in code:
- first import redux\
import redux from 'redux'\
or the "old" way: const redux = require('redux')

- then you can grab the createStore method from that library\
const createStore = redux.createStore

- to utilize it\
const store = createStore(reducer)

- the reducer has the initial state, what is required for the store to make the state transition based on the actions that it receive (first responsibility solved)

- 2nd responsibility is to expose a method called getState() which serves the current state in the store \
console.log('Initial state', store.getState())

Since you havent performed any state transitions yet, the state should give back the initial state. 

- 4th: subscription\
const unsubscribe = store.subscribe(() => console.log('Updated state', store.getState()))

- 3rd: dispatching

store.dispatch(buyProduct()) \
store.dispatch(buyProduct()) \
store.dispatch(buyProduct())

- 5th and final part is to unsubsribe from the store by calling the function returned by the subscribe method.

unsubscribe()

Thats all the responsibilities of the redux store.
You could now test the "shop application".\
Assuming youve written all the code fragments above into one index.js
..you could run it as usual with \
node index 

...in the terminal and the output would be:
```sh
Initial state { numOfProducts: 10 } 
Updated state { numOfProducts: 9 }
Updated state { numOfProducts: 8 }
Updated state { numOfProducts: 7 }
```

in short:
```sh
const store = createStore(reducer)
console.log('Initial state', store.getState())
const unsubscribe = store.subscribe(() => console.log('Updated state', store.getState()))
store.dispatch(buyProduct())
store.dispatch(buyProduct())
store.dispatch(buyProduct())
unsubscribe()
```

- First you create the redux store
- then you log the initial state to the console
- then you set up a listener to the store: whenever the state updates, a callback fn will log the current state object to the console
- when you dispatch the first action (via action creator fn) the reducer sees the the type is "BUY_PRODUCT", it ll then go through the switch case and try to match the type. It matches the first case and returns the new state with the decremented numOfProducts and due to the listener this new state gets logged to the console
- same for the next 2 dispatches
- unsubscribe to the store