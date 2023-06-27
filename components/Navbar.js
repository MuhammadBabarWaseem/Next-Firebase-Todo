import {
    Box,
    Flex,
    Avatar,
    Link,
    Button,
    Menu,
    MenuButton,
    MenuList,
    useColorModeValue,
    Stack,
    Text,
    Heading,
    useColorMode,
    Center,
} from '@chakra-ui/react';

import { FaMoon, FaSun } from "react-icons/fa";

// const NavLink = () => (
//     <Link
//         px={2}
//         py={1}
//         rounded={'md'}
//         _hover={{
//             textDecoration: 'none',
//             bg: useColorModeValue('gray.200', 'gray.700'),
//         }}
//         href={'#'}>
//         {children}
//     </Link>
// );

export default function Nav({ url, name, email, button1, button }) {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            <Box marginBottom={12} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Heading>TodoList</Heading>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={() => toggleColorMode()}>
                                {colorMode == "dark" ? <FaSun /> : <FaMoon />}
                            </Button>{" "}

                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'sm'}
                                        src={url}
                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'md'}
                                            src={url}
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <Heading size='sm'>{name}</Heading>
                                    </Center>
                                    <Center>
                                        <Text opacity={0.7} fontSize='sm' >{email}</Text>
                                    </Center>
                                    <br />
                                    {button1}
                                    {button}
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}