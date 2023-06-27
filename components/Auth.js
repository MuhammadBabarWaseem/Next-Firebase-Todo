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
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log(token)
                const user = result.user;
                console.log(user)
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage)
                const email = error.customData.email;
                console.log(email)
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(credential)
            });
    };
    return (
        <Box position={"relative"} top="5%" right="5%">
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



