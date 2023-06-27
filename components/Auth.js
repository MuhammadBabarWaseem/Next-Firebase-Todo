import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi"
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";
import Nav from "./Navbar";

const Auth = () => {

    const { isLoggedIn, user } = useAuth();

    const handleAuth = async () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    };
    return (
        <Box position={"sticky"} top="5%" right="5%">
            {isLoggedIn && (
                <>
                {console.log(user)}
                    <Nav url={user.photoURL} name={user.displayName} email={user.email} button1={
                        <Button left={12} onClick={() => auth.signOut()} leftIcon={<FiLogOut />}>
                            Logout
                        </Button>
                    } />

                </>
            )}
            {!isLoggedIn && (
                <>
                    <Nav button={
                        <Button left={5} leftIcon={<FaGoogle />} onClick={() => handleAuth()}>
                            Login with Google
                        </Button>
                    } />
                </>
            )}
        </Box>
    );
};
export default Auth;



