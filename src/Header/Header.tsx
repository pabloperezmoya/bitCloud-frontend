import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  Stack,
  Text,
  InputRightAddon,
  Flex,
  Kbd,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Input,
  ModalBody,
  useDisclosure,
  useBreakpointValue,
  ResponsiveValue,
} from "@chakra-ui/react";
import { UserButton } from "@clerk/clerk-react";

import React, { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data?: {
    fileName: string;
    size: string;
    format: string;
    uploadedAt: string;
    owner: string;
    sharedWith: string[];
  };
};

export const SearchModal: React.FC<ModalProps> = ({
  isOpen,
  onOpen,
  onClose,
}) => {
  const [input, setInput] = useState("");
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <InputGroup size={"xl"} gap={5} outline={"transparent"}>
              <InputLeftAddon
                children={<Search2Icon />}
                background={"transparent"}
                border={0}
              />
              <Input
                placeholder="Search Items"
                border={0}
                className="search-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </InputGroup>
          </ModalHeader>

          {input.length > 0 && <ModalBody>Search Results...</ModalBody>}
        </ModalContent>
      </Modal>
    </>
  );
};

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    function handleKeyDown(event: any) {
      // Verificar si se presiona la combinación de teclas Ctrl + K
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
        onOpen(); // Abrir el modal
      }
      if (isOpen && event.ctrlKey && event.key === "k") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpen, onClose, isOpen]);

  // Breakpoints
  // const headerText = useBreakpointValue({
  //   base: "🌧️+⚡",
  //   sm: "🌧️+⚡",
  //   md: "bitCloud🌧️+⚡",
  // }) as ResponsiveValue<any>;

  const searchButtonShowKBD = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
  }) as ResponsiveValue<any>;

  const columnSearch = useBreakpointValue({
    base: {
      start: 3,
      end: 4,
    },
    sm: {
      start: 3,
      end: 4,
    },
    md: {
      start: 4,
      end: 8,
    },
  }) as ResponsiveValue<any>;

  const showFullSearch = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
  }) as ResponsiveValue<any>;

  return (
    <SimpleGrid marginTop={3} marginBottom={5} columns={[3, 3, 10]}>
      <Box w={80}>
        <Text fontSize={"2xl"} fontWeight={"bold"} fontFamily={"mono"}>
          bitCloud🌧️+⚡
        </Text>
      </Box>

      <Stack
        direction={"row"}
        alignItems={"center"}
        gridColumnStart={columnSearch.start}
        gridColumnEnd={columnSearch.end}
        justifySelf={"center"}
        w={"100%"}
      >
        <InputGroup size={"sm"}>
          {showFullSearch == true ? (
            <InputLeftAddon children={<Search2Icon />} border={0} />
          ) : (
            <Button
              onClick={onOpen}
              w={"auto"}
              color={"grey"}
              borderRadius={0}
              children={<Search2Icon />}
            />
          )}

          {showFullSearch && (
            <Button onClick={onOpen} color={"grey"} borderRadius={0} w={"100%"}>
              Search Items
            </Button>
          )}
          <SearchModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

          {searchButtonShowKBD && (
            <InputRightAddon
              border={0}
              children={
                <Flex alignItems={"center"}>
                  <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
                </Flex>
              }
            />
          )}
        </InputGroup>
      </Stack>

      <Box justifySelf={"end"} gridColumnStart={10}>
        <UserButton />
      </Box>
    </SimpleGrid>
  );
};
