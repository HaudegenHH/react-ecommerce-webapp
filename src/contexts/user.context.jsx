import { createContext, useState, useEffect } from "react";

import { onAuthStateChangeListener, createUserDocumentFromAuth } from '../utils/firebase/firebase.utils';

// actual value you want to access from the context
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

export const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)
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
*/