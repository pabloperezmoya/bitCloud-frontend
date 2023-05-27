import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverBody,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Input,
  Text,
  List,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { useRef, useContext, useState } from "react";
import { ApiContext } from "../../api/apiContext";
import { ActionTypes } from "../../reducer";

const NewFolderModal = ({ isOpen, onClose, toast, ctxt, state, dispatch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleCreateFolderButton = async () => {
    const regex = /^[a-zA-Z0-9_-]+$/g;
    if (inputValue && inputValue.length < 20 && regex.test(inputValue)) {
      const res = await fetch(
        `${ctxt.apiEndpointHost}/folders/${inputValue.toLowerCase()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ctxt.jwtToken}`,
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));

      if (res.success) {
        dispatch({ type: ActionTypes.FETCH_FOLDERS });
        toast({
          title: "Folder created",
          description: "Folder created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong while creating the folder",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Invalid folder name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Folder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text p={2} color={"grey"}>
            Folder Name must be :
            <UnorderedList p={2} color={"grey"}>
              <ListItem>Less than 20 characters.</ListItem>
              <ListItem>
                Only letters, numbers, underscores and dashes.
              </ListItem>
              <ListItem>
                <span style={{ fontWeight: "bolder" }}>Unique</span> (on the
                scope of your folders).
              </ListItem>
            </UnorderedList>
          </Text>
          <Input
            variant="outline"
            placeholder="Folder Name"
            onChange={(e) => setInputValue(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={async () => {
              await handleCreateFolderButton();
              onClose();
            }}
          >
            Create
          </Button>
          <Button variant="ghost">Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const FileUploadComponent = () => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Realiza la lógica deseada con el archivo seleccionado
    console.log(file);
  };

  const handleButtonClick = () => {
    fileInputRef?.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button onClick={handleButtonClick}>Seleccionar archivo</button>
    </div>
  );
};

export const handleFileSelected = async (
  file,
  ctxt,
  state,
  dispatch,
  toast
) => {
  if (file && file.size / 1024 / 1024 < 50) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      toast({
        title: "Uploading",
        description: "Uploading file",
        status: "info",
        duration: 9000,
        isClosable: true,
      });
      const res = await fetch(
        `${ctxt.apiEndpointHost}/storage/upload/${state.selectedFolderName}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ctxt.jwtToken}`,
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          toast({
            title: "Success",
            description: "File uploaded",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          dispatch({
            type: ActionTypes.FETCH_FILES,
          });
        }, 3000);
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Error uploading file",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  } else {
    toast({
      title: "Error",
      description: "File too big. Must be less than 50MB",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  }
};

export const NewButton = ({ state, dispatch }) => {
  const fileInputRef = useRef(null);
  const ctxt = useContext(ApiContext);
  const toast = useToast();

  const handleNewFolderClick = async () => {};

  const handleUploadFileClick = () => {
    fileInputRef?.current.click();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex alignItems={"center"}>
      <Popover>
        <PopoverTrigger>
          <Button colorScheme="green" rightIcon={<AddIcon />} width={"100%"}>
            New
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent w={"3xs"}>
            <PopoverBody>
              <Flex direction={"column"} gap={2}>
                <Button
                  colorScheme="yellow"
                  variant={"outline"}
                  onClick={onOpen}
                >
                  New Folder
                </Button>
                <NewFolderModal
                  isOpen={isOpen}
                  onClose={onClose}
                  toast={toast}
                  ctxt={ctxt}
                  state={state}
                  dispatch={dispatch}
                />
              </Flex>
            </PopoverBody>
            <Divider borderWidth={1} w={"auto"} />
            <PopoverBody>
              <Flex direction={"column"} gap={2}>
                <Button
                  colorScheme="green"
                  variant={"outline"}
                  onClick={handleUploadFileClick}
                >
                  Upload File
                </Button>
                <Button colorScheme="blue" variant={"outline"}>
                  Upload Folder
                </Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={(e) =>
          handleFileSelected(e.target.files[0], ctxt, state, dispatch, toast)
        }
      />
    </Flex>
  );
};
