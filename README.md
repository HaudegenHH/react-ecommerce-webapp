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