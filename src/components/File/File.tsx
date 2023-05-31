import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  DownloadIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  InfoIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Select,
  Image,
  Box,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Button,
  Text,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  UnorderedList,
  ListItem,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { fileType } from "../MainContent/MainContent";
import { ApiContext } from "../../api/apiContext";
import { ActionTypes } from "../../reducer";
import { saveAs } from "file-saver";

type ModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data?: fileType;
};

const InfoModal: React.FC<ModalProps> = ({ isOpen, onOpen, onClose, data }) => {
  return (
    <>
      <Button onClick={onOpen} variant={"ghost"}>
        <InfoIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data?.originalName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UnorderedList>
              <ListItem>
                Size:{" "}
                {data?.size / 1024 / 1024 > 1
                  ? `${(data?.size / 1024 / 1024).toFixed(1)}MB`
                  : `${(data?.size / 1024).toFixed(2)}KB`}
              </ListItem>
              <ListItem>Format: {data?.mimetype}</ListItem>
              <ListItem>Uploaded at: {data?.createdAt}</ListItem>
              <ListItem>Owner: {data?.userId}</ListItem>
              <ListItem>Shared With: {data?.sharedWith}</ListItem>
            </UnorderedList>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

type MenuProps = {
  fileKey: string;
  fileName: string;
  state: any;
  dispatch: any;
};

const MenuComponent: React.FC<MenuProps> = ({
  fileKey,
  fileName,
  state,
  dispatch,
}) => {
  const toast = useToast();
  const { jwtToken, apiEndpointHost } = useContext(ApiContext);

  const handleOnClickDownload = async () => {
    toast({
      title: "Download Started",
      description: "Download will start in a few seconds.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    try {
      const response = await fetch(
        `${apiEndpointHost}/storage/files/${fileKey}/stream`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      ).catch((err) => dispatch({ type: ActionTypes.SET_ERROR, payload: err }));

      if (response.ok) {
        const blob = await response.blob();
        saveAs(blob, fileName);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Something went wrong while downloading the file.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleClickOnShare = async () => {
    try {
      const res = await fetch(
        `${apiEndpointHost}/storage/files/${fileKey}/share`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
        .then((res) => res.json())
        .catch((err) =>
          dispatch({ type: ActionTypes.SET_ERROR, payload: err })
        );

      if (res.success) {
        // dispatch ? not sure
        // paste to clipboard
        const url = `${window.location.origin}/dashboard/shared/${fileKey}/${res.data.shareId}`;
        navigator.clipboard.writeText(url);
        // generate link

        // toast
        toast({
          title: "Share Link Copied",
          description: `Share link copied to clipboard. ${url}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Something went wrong while sharing the file.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleClickOnDelete = async () => {
    try {
      const res = await fetch(`${apiEndpointHost}/storage/${fileKey}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((res) => res.json())
        .catch((err) =>
          dispatch({ type: ActionTypes.SET_ERROR, payload: err })
        );

      if (res.success) {
        dispatch({
          type: ActionTypes.DELETE_FILE,
          payload: state.files.filter(
            (file: fileType) => file.fileKey !== fileKey
          ),
        });

        toast({
          title: "File Deleted",
          description: "File deleted successfully.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "File Deletion Failed",
        description: "Something went wrong while deleting the file.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Menu>
      <MenuButton as={Button} variant={"ghost"}>
        <HamburgerIcon boxSize={"5"} />
      </MenuButton>
      <MenuList>
        <MenuItem gap={1} onClick={handleOnClickDownload}>
          <DownloadIcon />
          Download
        </MenuItem>
        {state.selectedFolderName !== "shared" && (
          <MenuItem gap={1} onClick={handleClickOnShare}>
            <ExternalLinkIcon />
            Share
          </MenuItem>
        )}
        {state.selectedFolderName !== "shared" ? (
          <MenuItem gap={1} onClick={handleClickOnDelete}>
            <DeleteIcon />
            Delete
          </MenuItem>
        ) : (
          <MenuItem gap={1} onClick={handleClickOnDelete}>
            <DeleteIcon />
            Delete for me
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

type Props = {
  file: fileType;
  state: any;
  dispatch: any;
};

type CardModalProps = {
  disc: any;
  file: fileType;
  toast: any;
  state: any;
  dispatch: any;
};

const CardModal: React.FC<CardModalProps> = ({
  disc,
  file,
  toast,
  state,
  dispatch,
}) => {
  const ctxt = useContext(ApiContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pdfRef = useRef<HTMLObjectElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewable, setPreviewable] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      setLoading(true);
      if (
        file.mimetype.split("/")[0] != "audio" ||
        file.mimetype != "application/pdf" ||
        file.mimetype.split("/")[0] != "image"
      ) {
        setPreviewable(false);
        setLoading(false);
      }
      if (previewable) {
        const res = await fetch(
          `${ctxt.apiEndpointHost}/storage/files/${file.fileKey}/stream`,
          {
            headers: {
              Authorization: `Bearer ${ctxt.jwtToken}`,
            },
          }
        );

        if (res.ok) {
          const blob = await res.blob();

          if (blob.type.split("/")[0] == "audio") {
            const url = URL.createObjectURL(blob);
            audioRef.current.src = url;
            audioRef.current.load();
            //audioRef.current.play();
          } else if (blob.type == "application/pdf") {
            const url = URL.createObjectURL(blob);
            pdfRef.current.data = url;
          } else if (blob.type.split("/")[0] == "image") {
            const url = URL.createObjectURL(blob);
            imageRef.current.src = url;
          } else {
            setPreviewable(false);
          }
        }
        setLoading(false);
      }
    };

    fetchStream();
  }, []);

  const handleOnClickDownload = async () => {
    toast({
      title: "Download Started",
      description: "Download will start in a few seconds.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    try {
      const response = await fetch(
        `${ctxt.apiEndpointHost}/storage/files/${file.fileKey}/stream`,
        {
          headers: {
            Authorization: `Bearer ${ctxt.jwtToken}`,
          },
        }
      ).catch((err) => dispatch({ type: ActionTypes.SET_ERROR, payload: err }));

      if (response.ok) {
        const blob = await response.blob();
        saveAs(blob, file.originalName);
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Something went wrong while downloading the file.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal
      isOpen={disc.isOpen}
      onClose={disc.onClose}
      size={file.mimetype != "audio/mpeg" ? "2xl" : "md"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text noOfLines={1}>{file.originalName}</Text>
        </ModalHeader>

        <ModalBody>
          <Center>
            {previewable && <Text>Not Preview Available</Text>}

            {loading && <Spinner />}
            {file.mimetype.split("/")[0] == "audio" && (
              <audio
                style={{ width: "100%" }}
                ref={audioRef}
                controls
                autoPlay
              ></audio>
            )}
            {file.mimetype == "application/pdf" && (
              <object
                ref={pdfRef}
                type="application/pdf"
                width="100%"
                style={{ height: "calc(75vh - 100px)" }}
              ></object>
            )}
            {file.mimetype.split("/")[0] == "image" && (
              <Image ref={imageRef} maxW={"600px"} maxH={"300px"} />
            )}
          </Center>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleOnClickDownload}
            leftIcon={<DownloadIcon />}
          >
            Download
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={disc.onClose}
            variant={"ghost"}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const File: React.FC<Props> = ({ file, state, dispatch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disc = useDisclosure();
  const toast = useToast();

  return (
    <Card
      maxW={200}
      maxH={295}
      w="100%"
      //onMouseEnter={(e) => handleClickOnHeader(e, file)}
      border={"1px"}
      borderColor={"grey"}
      _hover={{
        boxShadow:
          "0px 10px 10px -10px grey, 0px 0px 30px -10px rgba(214, 214, 214, 1) inset",
        borderWidth: "1px",
        borderColor: "grey",
        transition: "all",
        transitionDuration: "0.5s",
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <div onClick={disc.onOpen}>
        {disc.isOpen && (
          <CardModal
            disc={disc}
            file={file}
            toast={toast}
            state={state}
            dispatch={dispatch}
          />
        )}
        <CardHeader paddingBottom={0}>
          <Center>
            <Image
              src={
                file?.mimetype?.includes("audio")
                  ? "/icons/sound_file.png"
                  : "/icons/doc_file.png"
              }
              alt="file icon"
              boxSize="100%"
              maxH="120px"
              p={10}
              objectFit="contain"
              borderRadius={10}
            />
          </Center>
        </CardHeader>

        <CardBody paddingBottom={0}>
          <Text fontSize={"md"} noOfLines={1} fontWeight={"semibold"}>
            {file.originalName}
          </Text>
          <Text fontSize={"sm"} color={"gray.600"} fontWeight={"semibold"}>
            {file.size / 1024 / 1024 > 1
              ? `${(file.size / 1024 / 1024).toFixed(1)}MB`
              : `${(file.size / 1024).toFixed(2)}KB`}
          </Text>
        </CardBody>
      </div>
      <CardFooter justify="space-between" alignItems="center">
        <InfoModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          data={file}
        />
        <MenuComponent
          fileKey={file.fileKey}
          fileName={file.originalName}
          state={state}
          dispatch={dispatch}
        />
      </CardFooter>
    </Card>
  );
};

export default File;
