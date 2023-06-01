import React, { useContext, useEffect } from "react";
import File from "../File/File";
import {
  Button,
  Divider,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  useToast,
  Image,
  Center,
  Text,
} from "@chakra-ui/react";
import { ApiContext } from "../../api/apiContext";

import { ActionTypes } from "../../reducer";
import { DeleteIcon, ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";

type Props = {
  state: any;
  dispatch: any;
};

export type fileType = {
  createdAt: string;
  fileKey: string;
  folderId: string;
  mimetype: string;
  originalName: string;
  shareId: string;
  sharedWith: string[];
  size: number;
  userId: string;
  __v: number;
  _id: string;
};
const MainContent: React.FC<Props> = ({ state, dispatch }) => {
  const ctxt = useContext(ApiContext);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (state.selectedFolderName !== null) {
        const data = await fetch(
          `${ctxt.apiEndpointHost}/folders/${state.selectedFolderName}?populate=true`,
          {
            headers: {
              Authorization: `Bearer ${ctxt.jwtToken}`,
            },
          }
        )
          .then((res) => res.json())
          .catch((err) =>
            dispatch({ type: ActionTypes.SET_ERROR, payload: err })
          );

        if (data.success) {
          dispatch({
            type: ActionTypes.SET_FILES,
            payload: data.data.folder.files,
          });
        } else {
          dispatch({ type: ActionTypes.SET_ERROR, payload: data.message });
        }
      }
    };
    fetchData();
  }, [state.selectedFolder, state.folders, state.fetchFiles]);

  const handleClickOnReload = () => {
    dispatch({ type: ActionTypes.FETCH_FILES });
  };

  const handleClickOnDeleteFolder = async () => {
    //dispatch({ type: ActionTypes.DELETE_FOLDER });
    try {
      const res = await fetch(
        `${ctxt.apiEndpointHost}/storage/folder/${state.selectedFolderName}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${ctxt.jwtToken}`,
          },
        }
      )
        .then((res) => res.json())
        .catch((err) =>
          dispatch({ type: ActionTypes.SET_ERROR, payload: err })
        );

      if (res.success) {
        dispatch({
          type: ActionTypes.DELETE_FOLDER,
          payload: state.folders.filter(
            (folder: any) => folder.folderName !== state.selectedFolderName
          ),
        });

        dispatch({
          type: ActionTypes.SET_SELECTED_FOLDER_NAME,
          payload: "root",
        });

        toast({
          title: "Folder Deleted",
          description: "Folder deleted successfully.",
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
    <>
      <Stack gap={1}>
        <Stack
          direction="row"
          spacing={3}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <Heading size="md">
            {state.selectedFolderName.replace(/\b\w/g, function (l: string) {
              return l.toUpperCase();
            })}{" "}
            folder
          </Heading>

          <Button variant="ghost" onClick={handleClickOnReload}>
            <RepeatIcon />
          </Button>
          {state.selectedFolderName !== "root" &&
            state.selectedFolderName !== "shared" && (
              <>
                <Button variant="ghost">
                  <ExternalLinkIcon />
                </Button>
                <Button
                  variant="ghost"
                  color={"orange.600"}
                  onClick={handleClickOnDeleteFolder}
                >
                  <DeleteIcon />
                </Button>
              </>
            )}
        </Stack>

        <Divider />

        <SimpleGrid
          minChildWidth={["120px", "120px", "180px"]}
          spacing="15px"
          scrollBehavior={"smooth"}
          overflowY={"auto"}
          overflowX={"hidden"}
          maxH={{
            base: "calc(50vh + 110px)",
            md: "calc(100vh - 150px)",
          }}
          p={1}
        >
          {state.loadingFiles && (
            <>
              <Skeleton height={200} w={150} />
              <Skeleton height={200} w={150} />
              <Skeleton height={200} w={150} />
              <Skeleton height={200} w={150} />
            </>
          )}
          {!state.loadingFiles && state.files && state.files.length === 0 && (
            <Center flexDirection={"column"}>
              <Image
                src="/icons/empty_folder.png"
                alt="empty folder"
                maxH={"200px"}
              />
              <Text fontWeight={"black"}>
                Upload, create or share files to see them here.
              </Text>
            </Center>
          )}
          {!state.loadingFiles && !state.searchQuery ? (
            state.files.map((file: fileType, i) => {
              return (
                <File file={file} key={i} state={state} dispatch={dispatch} />
              );
            })
          ) : (
            <>
              {!state.loadingFiles &&
                state?.files
                  ?.filter((file: fileType) =>
                    file?.originalName?.includes(state.searchQuery)
                  )
                  ?.map((file: fileType) => (
                    <File
                      file={file}
                      key={file._id}
                      state={state}
                      dispatch={dispatch}
                    />
                  ))}
            </>
          )}
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default MainContent;
