import React, { useRef, useState, useEffect } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi"
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";
import Nav from "./Navbar";
import { collection, query, getFirestore, getDocs } from "firebase/firestore";
import Chart from "chart.js";

const Auth = () => {

    const { isLoggedIn, user } = useAuth();

    const chartRef = useRef(null);
    const [totalTodos, setTotalTodos] = useState(0);
    const [completedTodos, setCompletedTodos] = useState(0);
    const [pendingTodos, setPendingTodos] = useState(0);


    useEffect(() => {
        const fetchTodos = async () => {
            const db = getFirestore();

            try {
                const todosQuery = query(collection(db, 'todo'));
                const querySnapshot = await getDocs(todosQuery);
                const todos = querySnapshot.docs.map((doc) => doc.data());
                const SNo = todos.length;

                setTotalTodos(todos.length);

                const completedCount = todos.filter((todo) => todo.status === 'completed').length;
                setCompletedTodos(completedCount);

                const pendingCount = todos.length - completedCount;
                setPendingTodos(pendingCount);

                // Create the chart
                const chartCtx = chartRef.current.getContext('2d');
                new Chart(chartCtx, {
                    type: 'line',
                    data: {
                        labels: ['Total Todos', 'Completed Todos', 'Pending Todos'],
                        datasets: [
                            {
                                label: 'Todo Counts',
                                data: [totalTodos, completedTodos, pendingTodos],
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                                fill: false,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
            } catch (error) {
                console.error('Error retrieving todos:', error);
            }
        };

        fetchTodos();
        console.log(totalTodos, completedTodos, pendingTodos)
    }, []);



    const handleAuth = async () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                const email = error.customData.email;
                console.log(email);
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(credential);
            });
    };
    return (
        <Box position={"relative"} top="5%" right="5%">
            {isLoggedIn && (
                <>
                    <Nav url={user.photoURL} name={user.displayName} email={user.email} button1={
                        <Button left={12} onClick={() => auth.signOut()} leftIcon={<FiLogOut />}>
                            Logout
                        </Button>
                    } />


                    <Flex justifyContent="center" alignItems="center">
                        <Box width={700} height={400}>
                            <canvas ref={chartRef} />
                        </Box>
                    </Flex>
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



