import { initializeApp  } from 'firebase/app';
import { 
    getAuth,
    GoogleAuthProvider, 
    signInWithRedirect, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
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
    collection,
    writeBatch
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

export const auth = getAuth(firebaseApp);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

// db is a singleton instance
export const db = getFirestore();

/* ---------------------------------------------*/
/* upload SHOP_DATA section */

// collectionKey stands for the name of the collection like users or 
// categories 
export const addCollectionAndDocuments = async (
    collectionKey, 
    objectsToAdd,
    field
    ) => {
    // like the documentReference there is a collectionReference as well
    const collectionRef = collection(db, collectionKey);
    
    // creating a batch so that you can add all of the objects to the (eg) "categories"
    // collection in one (successful) transaction:
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
        // first you need to get the document reference
        // but instead of giving it the db, you gonna pass it the collectionRef
        // because this reference directly tells doc method what db and collection it
        // is that its gonna point to.
        // 2nd param is the title property on the object (see: shop-data.js)
        //const docRef = doc(collectionRef, object.title.toLowerCase());
        const docRef = doc(collectionRef, object[field].toLowerCase());

        // remember: firebase will return a document reference even if it doesnt 
        // exist yet. it would just point to that place for that specific key 
        // (defined by the objects title) inside of the collection
        // and here you saying: set that location and set it with the value of the 
        // object itself (you can pass it some json object and it will build out that
        // structure for you)
        batch.set(docRef, object);
    })
    
    // after you iterated over each object, you added an additional batch set-call on 
    // there, creating a new document reference for each of those objects, where the 
    // key is the title and the value is the object itself..
    // and with committing it, it ll begin firing it off
    await batch.commit();

    console.log('done');
    // see: products.context where the shopdata is loaded in
} 


/* ---------------------------------------------*/
/* create user document section */

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


/* ---------------------------------------------*/
/**
 * interface layer section 
 * extending the firebase lib function to yours needs
*/

//  create user with email and password
export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password);
}

// signing in with email and password
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;
    return await signInWithEmailAndPassword(auth, email, password);
}

// signing out
// gets as well the auth singleton, which is what informs the firebase signOut fn
// which user to find on the auth instance.
export const signOutUser = async () => await signOut(auth);

// 2nd param is the callback that run when the auth state changes
// and since i wrap the firebase fn with my own i can pass the cb when calling this fn.
// according to the documentation the onAuthStateChanged() function returns
// an unsubscribe function for the observer.
export const onAuthStateChangeListener = (cb) => onAuthStateChanged(auth, cb);
