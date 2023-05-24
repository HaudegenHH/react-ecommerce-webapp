import { initializeApp  } from 'firebase/app';
import { 
    getAuth,
    GoogleAuthProvider, 
    signInWithRedirect, 
    signInWithPopup, 
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAQt972WvnLec6uXMKU7yuJickTxoi4Ihw",
    authDomain: "react-ecommerce-webapp-92cfc.firebaseapp.com",
    projectId: "react-ecommerce-webapp-92cfc",
    storageBucket: "react-ecommerce-webapp-92cfc.appspot.com",
    messagingSenderId: "142873094300",
    appId: "1:142873094300:web:3d0ef4e92bb494eabe2559"
};
  
const firebaseApp = initializeApp(firebaseConfig);

// specific configuration that google demands
const provider = new GoogleAuthProvider();
// means: every time somebody interacts with the provider, you want to 
// always force them to select an account 
provider.setCustomParameters({
prompt: "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
