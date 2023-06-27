import {
    Badge,
    Button,
    Box,
    Heading,
    SimpleGrid,
    Flex,
    Spacer,
    Text,
    useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { collection, onSnapshot, query, where, getFirestore, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { deleteTodo, toggleTodoStatus } from "../api/todo";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const { user } = useAuth();
    const toast = useToast();

    // const [totalTodos, setTotalTodos] = useState(0);
    // const [completedTodos, setCompletedTodos] = useState(0);
    // const [pendingTodos, setPendingTodos] = useState(0);

    // useEffect(() => {
    //     const fetchTodos = async () => {
    //         const db = getFirestore();

    //         try {
    //             const todosQuery = query(collection(db, 'todo'));
    //             const querySnapshot = await getDocs(todosQuery);
    //             const todos = querySnapshot.docs.map((doc) => doc.data());

    //             setTotalTodos(todos.length);

    //             const completedCount = todos.filter((todo) => todo.status === 'completed').length;
    //             setCompletedTodos(completedCount);

    //             const pendingCount = todos.length - completedCount;
    //             setPendingTodos(pendingCount);
    //         } catch (error) {
    //             console.error('Error retrieving todos:', error);
    //         }
    //     };

    //     fetchTodos();
    // }, []);

    const refreshData = () => {
        if (!user) {
            setTodos([]);
            return;
        }
        const q = query(collection(db, "todo"), where("user", "==", user.uid));
        onSnapshot(q, (querySnapchot) => {
            let ar = [];
            querySnapchot.docs.forEach((doc) => {
                ar.push({ id: doc.id, ...doc.data() });
            });
            setTodos(ar);
        });
    };

    useEffect(() => {
        refreshData();
    }, [user]);



    const handleTodoDelete = async (id) => {
        if (confirm("Are you sure you want to delete this todo?")) {
            deleteTodo(id);
            toast({
                position: 'top',
                duration: 4000,
                variant: 'left-accent',
                title: "Todo deleted successfully",
                status: "success",
            });
        }
    };

    const handleToggle = async (id, status) => {
        const newStatus = status === "completed" ? "pending" : "completed";
        await toggleTodoStatus({ docId: id, status: newStatus });
        toast({
            title: `Todo marked ${newStatus}`,
            duration: 4000,
            variant: 'left-accent',
            status: newStatus === "completed" ? "success" : "warning",
            position: 'top',
        });
    };

    const TodoItem = ({ todo }) => {
        const [expandedId, setExpandedId] = useState(null);

        const handleExpand = (id) => {
            setExpandedId(id);
        };

        const handleCollapse = () => {
            setExpandedId(null);
        };

        const isExpanded = expandedId === todo.id;

        const truncatedDescription = todo.description.slice(0, 20);
        const fullDescription = todo.description;

        const isLargeText = todo.description.length > 100;

        return (


            <Flex>

                <Box
                    key={todo.id}
                    p={3}
                    boxShadow="2xl"
                    shadow={"dark-lg"}
                    transition="0.2s"
                    _hover={{ boxShadow: "sm" }}
                    h={isExpanded ? "auto" : "fit-content"}
                >
                    <Heading as="h3" fontSize={"xl"}>
                        {todo.title}{" "}
                        <Badge
                            color="red.500"
                            bg="inherit"
                            transition={"0.2s"}
                            _hover={{
                                bg: "inherit",
                                transform: "scale(1.2)",
                            }}
                            float="right"
                            size="xs"
                            onClick={() => handleTodoDelete(todo.id)}
                        >
                            <FaTrash />
                        </Badge>

                        <Badge ml={3}
                            color={todo.status === "pending" ? "gray.500" : "green.500"}
                            bg="inherit"
                            transition={"0.2s"}
                            _hover={{
                                bg: "inherit",
                                transform: "scale(1.2)",
                            }}
                            float="right"
                            size="xs"
                            onClick={() => handleToggle(todo.id, todo.status)}
                        >
                            {todo.status === "pending" ? <FaToggleOff size={18} /> : <FaToggleOn size={18} />}
                        </Badge>
                        <Badge ml={9}
                            float="right"
                            opacity="0.8"
                            bg={todo.status === "pending" ? "yellow.500" : "green.500"}
                        >
                            {todo.status}
                        </Badge>
                    </Heading>
                    <div>
                        {isExpanded ? (
                            <Text>
                                {fullDescription}
                                {isLargeText && (
                                    <Button size='xs' variant='ghost' onClick={handleCollapse}>Show Less</Button>
                                )}
                            </Text>
                        ) : (
                            <Text>
                                {truncatedDescription}
                                {isLargeText && (
                                    <Button size='xs' variant='ghost' onClick={() => handleExpand(todo.id)}>Show More</Button>
                                )}
                            </Text>
                        )}
                    </div>
                </Box>
            </Flex>
        );
    };

    return (
        <Box mt={5}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {todos && todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
            </SimpleGrid>
        </Box>
    );
};

export default TodoList;
