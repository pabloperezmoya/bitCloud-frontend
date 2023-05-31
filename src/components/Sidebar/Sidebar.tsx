/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Button,
  Divider,
  Flex,
  ResponsiveValue,
  useBreakpointValue,
  Text,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";

import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { NewButton } from "../NewButton/NewButton";
import { ActionTypes } from "../../reducer";
import { ApiContext } from "../../api/apiContext";

type Props = {
  state: any;
  dispatch: any;
  jwtToken: any;
};

type folderType = {
  _id: string;
  ownerId: string;
  folderName: string;
  files: string[];
  sharedWith: string[];
  createdAt: string;
  updatedAt?: string;
  __v: number;
};

type responseType = {
  success: boolean;
  message: string;
  data?: any;
};

const Sidebar: React.FC<Props> = ({ state, dispatch, jwtToken }) => {
  const direction = useBreakpointValue({
    base: {
      flexDir: "row",
      dividerOrientation: "vertical",
    },
    sm: {
      flexDir: "row",
      dividerOrientation: "vertical",
    },
    md: {
      flexDir: "column",
      dividerOrientation: "horizontal",
    },
  }) as ResponsiveValue<any>;

  const handleClickOnFolder = (folder: folderType) => {
    dispatch({
      type: ActionTypes.SET_SELECTED_FOLDER,
      payload: folder,
    });
    dispatch({
      type: ActionTypes.SET_SELECTED_FOLDER_NAME,
      payload: folder.folderName,
    });
    dispatch({
      type: ActionTypes.PERSIST_SELECTED_FOLDER_NAME,
      payload: folder.folderName,
    });
  };

  const ctxt = useContext(ApiContext);
  useEffect(() => {
    // fetch folders
    const fetchFolders = async () => {
      dispatch({ type: ActionTypes.SET_LOADING_FOLDERS });

      const data: responseType = await fetch(
        `${ctxt.apiEndpointHost}/folders?populate=true`,
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
        dispatch({
          type: ActionTypes.SET_FOLDERS,
          payload: data.data.folders,
        });
      } else {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: data,
        });
      }
    };
    fetchFolders();
  }, [state.fetchFolders]);

  useEffect(() => {
    // recover persisted folder name
    dispatch({
      type: ActionTypes.RECOVER_SELECTED_FOLDER_NAME,
      payload: true,
    });
  }, []);

  return (
    <aside className="sidebar">
      <NewButton state={state} dispatch={dispatch} />

      <Divider
        orientation="horizontal"
        marginTop={2}
        marginBottom={2}
        borderRadius={5}
        size="md"
      />

      <Flex
        direction={direction.flexDir}
        gap={2}
        overflowX={"auto"}
        wrap={"wrap"}
      >
        {state.loadingFolders && (
          <Stack gap={2} padding={2}>
            <Skeleton height={5} padding={0} />
            <Skeleton height={5} padding={0} />
            <Skeleton height={5} padding={0} />
            <Skeleton height={5} padding={0} />
            <Skeleton height={5} padding={0} />
          </Stack>
        )}
        {!state.loadingFolders &&
          state.folders.map((folder: folderType, i: number) => {
            return (
              <Button
                isActive={state.selectedFolderName === folder.folderName}
                _active={{
                  boxShadow: "0px 5px 10px -7px grey",
                  color: "black",
                  backgroundColor: i < 2 ? "#bee3f8" : "#f8d3be",
                }}
                isDisabled={state.selectedFolderName === folder.folderName}
                _disabled={{
                  opacity: 1,
                  cursor: "default",
                }}
                _hover={{
                  backgroundColor:
                    state.selectedFolderName === folder.folderName
                      ? "none"
                      : "blue.50",
                }}
                colorScheme={i < 2 ? "blue" : "yellow"}
                variant={"ghost"}
                justifyContent={"start"}
                leftIcon={<FolderOutlinedIcon fontSize="small" />}
                key={folder._id}
                onClick={() => handleClickOnFolder(folder)}
              >
                <Text fontSize={"sm"} noOfLines={1}>
                  {folder.folderName.replace(/\b\w/g, function (l) {
                    return l.toUpperCase();
                  })}
                </Text>
              </Button>
            );
          })}
      </Flex>
    </aside>
  );
};

export default Sidebar;
