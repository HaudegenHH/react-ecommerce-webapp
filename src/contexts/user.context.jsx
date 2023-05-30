import { createContext, useState, useEffect, useReducer } from "react";

import { onAuthStateChangeListener, createUserDocumentFromAuth } from '../utils/firebase/firebase.utils';

import { createAction } from "../utils/reducer/reducer.utils";

// actual value you want to access from the context
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

// for the switch case you could create some sort of enums
// or rather constants like 
export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER'
}

const userReducer = (state, action) => {
  // destructuring off type and payload from the action
  const { type, payload } = action;
  
  console.log("dispatched");
  console.log(action);

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return {
        // spread the same values of the previous state object
        ...state,
        // and overwrite the currentUser with the payload
        currentUser: payload
      }
    default:
      throw new Error(`Unhandled type ${type} in userR  educer`); 
  }
}

const INITIAL_STATE = {
  currentUser: null
}

export const UserProvider = ({children}) => {
    // const [currentUser, setCurrentUser] = useState(null)
    
    // const [ state, dispatch ] = useReducer(userReducer, INITIAL_STATE);
    // const { currentUser } = state;
    // or destructuring currentUser off in one step
    const [ { currentUser }, dispatch ] = useReducer(userReducer, INITIAL_STATE);
    
    console.log(currentUser);

    // you also need to create a new setCurrentUser method (which came previously
    // from useState)
    const setCurrentUser = (user) => {
      dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));
    }

    const value = { currentUser, setCurrentUser };

    useEffect(() => {
      const unsubscribe = onAuthStateChangeListener((user) => {
        if (user) {
          createUserDocumentFromAuth(user)        
        }
        setCurrentUser(user);
        console.log(user);
      });

      // returned effect/clean-up fn which fires when comp. unmounts
      return unsubscribe; 
    }, []);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/* 
state management with context

on every context there is a Provider, and this provider is a component that will 
wrap around any other components that need access to the values inside

Lets say you wrap the App with this UserProvider

<UserProvider>
  <App /> 
</UserProvider>


..then the App would be the "children"

So finally you want to store an user object (currentUser for example) and a setter. 
Thats easily achieved with the useState hook and null as initial value for the 
currentUser. Put both into an object (currentUser and the setter) and assign it to
the value which the UserContext.Provider provides then for all its children. 

That way the value of the currentUser and the setter is available in the entire component
tree that is nested within this Provider.

Since the authentication is ready, you now want the SignInForm to be able to access
this context, because whenever the User signs in, you want to take the user object
that firebase returns and store it inside the context.

For that you will need to import the useContext hook and the actual UserContext 
object which will give back whatever value which was passed to it as value.
(and the value is, as said, the currentUser as well as the setter function)

Destructuring the setter from the Context..
const { setCurrentUser } = useContext(UserContext);
..which will be then used when the user gets returned from firebase to store 
this user in the context.

To test it, you could access it in the Navigation component by displaying either
a sign-in or a sign-out Button depending on the auth status (if currentUser is null 
or contains an actual user)

Another way (apart from manually setting the currentUser) is to use whats called 
an observable listener with the "onAuthStateChange", which allows to hook into 
a stream of events. whether these are sign-in events or sign-out events, you are 
able to trigger sth based on these changes.

"onAuthStateChange" returns back a listener thats i called it in the helper fn in 
the firebase.utils.js "onAuthStateChangeListener". 
Once when the Component UserProvider mounts (with useEffect) i call this newly 
created fn. And when it unmounts it should unsubscribe.

------------------------------------------------------------------------

change to reducers

const userReducer = (state, action) => {
  return {
    currentUser: null
  }
}

The userReducer returns an object and this object is the state, the current value 
of currentUser. And the Reducer receives the previous state and action.
And based on the state and the action you can determine what object (the new state)
you want to return. 

How to utilize these reducers inside of the existing context/provider?
- first you need to import the "useReducer" hook. And this hook is very similar 
to useState. 
- now you can comment out the useState of currentUser
- the UserContext stays untouched cause thats what is needed to expose the values
- and then instead of the useState in the UserProvider you create the userReducer 
  showing above
- then to utilize the userReducer, you use the useReducer hook which takes 2 arguments
  - the userReducer
  - the initial value for the state (which you can define separately)
And this hook will return always the state and a dispatch function

The way that it works is that whenever you call dispatch you pass it an action
object, which the userReducer receives, runs through the switch statement 
and updates the state accordingly. 
- since state is an object you can destructure off the currentUser
- and lastly you'd need a new setCurrentUser fn (the one before came from useState)

The point with the UserProvider though is that you still need to get some subscription
value via useEffect whenever the auth state changes. All of this will still work.
Only difference: Instead of using useState you now are using a Reducer!

For testing just console.log the currentUser in the provider and also the action
in the userReducer.
..and the result would be: 
1. null (for the initial value of currentUser)
2. then because of the authStateListener you'd get 
"dispatched" in the console if the user is currently signed in, he will get signed in, 
because the auth state is being kept for you by firebase. And it dispatches out a new
action with SET_CURRENT_USER as type and the user object as payload.
3. thus the action would be logged to the console and 
4. because of this new state object which is created based on this action.type, the
useReducer hook recognize that there is a new reducer value and re-runs consequnetly
the whole functional Component UserProvider with its "children" inside, in other words
it dispatches out a currentUser update to all of the listeners that are hooked into 
this context.

Thats the whole flow of a Reducer. As said: very similar to useState: Whenever 
setXYState gets called it gets updated and the functional component re-runs.
With Reducer: Whenever dispatch gets called and a new state object is returned, 
then it ll also re-run the functional component.

Note: Most of the time for a context that simple where you just store one value and 
one setter function, you might not want to use a Reducer and just use useState, which 
is perfectly fine, but the value of using reducers becomes more apparent in more
complex cases, such as the cart context!
And reducers have actually proven to scale quite well when it comes to state management.
Hence the popularity of libraries like Redux.
*/