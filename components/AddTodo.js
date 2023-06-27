import React, { useState } from "react";
import {
    Box,
    Input,
    Button,
    Textarea,
    Stack,
    Select,
    useToast,
} from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import { addTodo } from "../api/todo";


const AddTodo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const { isLoggedIn, user } = useAuth();

    const handleTodoCreate = async () => {
        if (!isLoggedIn) {
            toast({
                title: "You must be logged in to create a todo",
                variant: 'left-accent',
                position: 'top',
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        const todo = {
            title,
            description,
            status,
            userId: user.uid,
        };

        if (todo.title === '' || todo.description === '') {
            toast({
                title: "All Fields Are Required",
                variant: 'left-accent',
                position: 'top',
                status: "warning",
                duration: 4000,
                isClosable: true,
            });
            return;
        }

        await addTodo(todo);
        setIsLoading(false);
        setTitle("");
        setDescription("");
        setStatus("pending");
        toast({
            title: "Todo created successfully",
            position: 'top',
            variant: 'left-accent',
            status: "success",
            duration: 4000,
            isClosable: true,
        });
    };


    return (
        <Box w={["100%", "40%"]} m="0 auto" display="block">
            <Stack direction="column">
                <Input
                    size={["md", "md"]}
                    placeholder="Title"
                    value={title}

                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option
                        value={"pending"}
                        style={{ color: "yellow", fontWeight: "bold" }}
                    >
                        Pending ⌛
                    </option>
                    <option
                        value={"completed"}
                        style={{ color: "green", fontWeight: "bold" }}
                    >
                        Completed ✅
                    </option>
                </Select>
                <Button
                    onClick={() => handleTodoCreate()}
                    variantcolor="teal"
                    variant="solid"
                >
                    Add
                </Button>
            </Stack>
        </Box>
    );
};
export default AddTodo;