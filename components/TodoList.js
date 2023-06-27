import {
    Badge,
    Button,
    Box,
    Heading,
    SimpleGrid,
    Text,
    useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { deleteTodo, toggleTodoStatus } from "../api/todo";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const { user } = useAuth();
    const toast = useToast();

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
                title: "Todo deleted successfully",
                status: "success",
                position: 'top',
            });
        }
    };

    const handleToggle = async (id, status) => {
        const newStatus = status === "completed" ? "pending" : "completed";
        await toggleTodoStatus({ docId: id, status: newStatus });
        toast({
            title: `Todo marked ${newStatus}`,
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

        const truncatedDescription = todo.description.slice(0, 30);
        const fullDescription = todo.description;

        const isLargeText = todo.description.length > 100;

        return (
            <Box
                key={todo.id}
                p={3}
                boxShadow="2xl"
                shadow={"dark-lg"}
                transition="0.2s"
                _hover={{ boxShadow: "sm" }}
                h={isExpanded ? "auto" : "fit-content"} // Adjust the height based on expansion state
            >
                <Heading as="h3" fontSize={"xl"}>
                    {todo.title}
                </Heading>
                <Text>
                    {isExpanded ? (
                        <div>
                            {fullDescription}
                            {isLargeText && (
                                <Button size='xs' variant='ghost' onClick={handleCollapse}>Show Less</Button>
                            )}
                        </div>
                    ) : (
                        <div>
                            {truncatedDescription}
                            {isLargeText && (
                                <Button size='xs' variant='ghost' onClick={() => handleExpand(todo.id)}>Show More</Button>
                            )}
                        </div>
                    )}
                </Text>
            </Box>
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
