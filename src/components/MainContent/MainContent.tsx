import React, { useContext, useEffect } from "react";
import File from "../File/File";
import {
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  calc,
} from "@chakra-ui/react";
import { ApiContext } from "../../api/apiContext";

import { ActionTypes } from "../../reducer";
import { ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";

type Props = {
  state: any;
  dispatch: any;
  jwtToken: any;
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
const MainContent: React.FC<Props> = ({ state, dispatch, jwtToken }) => {
  const ctxt = useContext(ApiContext);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ActionTypes.SET_LOADING_FILES });
      if (state.selectedFolderName !== null) {
        const data = await fetch(
          `${ctxt.apiEndpointHost}/folders/${state.selectedFolderName}?populate=true`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken.getJwtToken()}`,
            },
          }
        )
          .then((res) => res.json())
          .catch((err) =>
            dispatch({ type: ActionTypes.SET_ERROR, payload: err })
          );

        if (data.success) {
          console.log("data: ", data);
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
              <Button variant="ghost">
                <ExternalLinkIcon />
              </Button>
            )}
        </Stack>

        <Divider />

        <SimpleGrid
          minChildWidth="180px"
          spacing="30px"
          scrollBehavior={"smooth"}
          overflowY={"auto"}
          overflowX={"hidden"}
          maxH={{
            base: "calc(50vh + 100px)",
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
          {!state.loadingFiles && state.files.length === 0 && (
            <Heading size="md">
              This folder looks lonely😪😫, upload something😃😎
            </Heading>
          )}
          {!state.loadingFiles &&
            state.files.map((file: fileType) => {
              return (
                <File
                  file={file}
                  key={file._id}
                  state={state}
                  dispatch={dispatch}
                />
              );
            })}
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default MainContent;
