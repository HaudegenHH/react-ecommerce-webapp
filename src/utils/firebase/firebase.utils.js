import { initializeApp  } from 'firebase/app';
import { 
    getAuth,
    GoogleAuthProvider, 
    signInWithRedirect, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';

// just like firebase-app or firebase-auth, firestore is a different service.
// with doc you get the specific document instance but
// if you want get data from that document you will need getDoc and setDoc for 
// setting the data for that document
import { 
    getFirestore,
    doc,
    getDoc,
    setDoc,
 } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAQt972WvnLec6uXMKU7yuJickTxoi4Ihw",
    authDomain: "react-ecommerce-webapp-92cfc.firebaseapp.com",
    projectId: "react-ecommerce-webapp-92cfc",
    storageBucket: "react-ecommerce-webapp-92cfc.appspot.com",
    messagingSenderId: "142873094300",
    appId: "1:142873094300:web:3d0ef4e92bb494eabe2559"
};
  
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

// specific configuration that google demands
// means: every time somebody interacts with the provider, you want to 
// always force them to select an account 
provider.setCustomParameters({
    prompt: "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

// db is a singleton instance
export const db = getFirestore();

// this fn should receive an user authentication object
// ..so whatever Firebase returns you want to (partially) store in Firestore
export const createUserDocumentFromAuth = async (userAuth, additionalInformation) => {
    if(!userAuth) return;

    // first you need to check if there is an existing doc reference.
    // "Reference" is a special type of object that firestore uses, when
    // talking about an instance of a document model.
    // doc() takes in: the db instance, the name of the collection, and a
    // unique identifier for that document
    // conviently you'd take the uid from the firebase-auth response as the 
    // identifier of the document
    const userDocRef = doc(db, 'users', userAuth.uid);

    // console.log(userDocRef);

    const userSnapshot = await getDoc(userDocRef);

    // console.log(userSnapshot);

    // check based on a given document if any data / user with that uid exists
    //console.log(userSnapshot.exists());

    // if not, create that document (the reference was created above!)
    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            });
        } catch (error) {
            console.log(`error creating the user: ${error.message}`)
        }
    }

    // finally return the reference to the document
    return userDocRef;
}

//  create user with email and password
export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password);
}