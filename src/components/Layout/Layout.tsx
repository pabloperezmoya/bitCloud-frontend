/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserButton, useAuth } from "@clerk/clerk-react";
import MainContent from "../MainContent/MainContent";
import Sidebar from "../Sidebar/Sidebar";
import { useEffect, useReducer, useState, useContext } from "react";
import { appReducer, ActionTypes, initialState } from "../../reducer";

import { ApiContext } from "../../api/apiContext";

import {
  Container,
  Flex,
  ResponsiveValue,
  Spacer,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";

import "./Layout.css";
import { Header } from "../../Header/Header";
import useJwtToken from "../../hooks/useJwtToken";
import Dropzone from "../Dropzone/Dropzone";
import { useParams, useNavigate } from "react-router-dom";
//import { useAPI } from "../../hooks/useApi";

const Layout = ({ receiveShare }) => {
  const { fileKey, shareId } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(appReducer, initialState);
  const jwtToken = useJwtToken();
  const ctxt = useContext(ApiContext);
  ctxt.jwtToken = jwtToken.getJwtToken() as string;
  const toast = useToast();

  useEffect(() => {
    if (state.persistSelectedFolderName) {
      // SI SE QUIERE PERSISTIR ALGO
      localStorage.setItem(
        "persistedFolderName",
        state.persistSelectedFolderName
      );
    }
  }, [state.persistSelectedFolderName]);

  useEffect(() => {
    if (state.recoverSelectedFolderName) {
      // SI SE QUIERE RECUPERAR ALGO
      const persistedFolderName = localStorage.getItem("persistedFolderName");
      console.log({ persistedFolderName });
      if (persistedFolderName) {
        dispatch({
          type: ActionTypes.SET_SELECTED_FOLDER_NAME,
          payload: persistedFolderName,
        });
      }
    }
  }, [state.recoverSelectedFolderName]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `${ctxt.apiEndpointHost}/storage/files/${fileKey}/share/${shareId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${ctxt.jwtToken}`,
          },
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log({ err }));

      if (data.success) {
        navigate("/dashboard");
        dispatch({
          type: ActionTypes.SET_SELECTED_FOLDER_NAME,
          payload: "shared",
        });

        toast({
          title: "File Received",
          description: "File received successfully. Saved in Shared Folder",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    if (receiveShare && fileKey && shareId) {
      fetchData();
    }
  }, []);

  // Breakpoints.ts
  const direction = useBreakpointValue({
    base: "column",
    sm: "column",
    md: "row",
  }) as ResponsiveValue<any>;

  const maxWMainContent = useBreakpointValue({
    sm: "100%",
    md: "80%",
  }) as ResponsiveValue<any>;

  const maxWSideBar = useBreakpointValue({
    sm: "100%",
    md: "15%",
  }) as ResponsiveValue<any>;
  // Breakpoints.ts x

  return (
    <Container
      maxW="1200px"
      minW={360}
      width="100%"
      maxH={"100vh"}
      overflowY={"hidden"}
    >
      <Header />

      <Flex direction={direction} padding={0}>
        <Container maxW={maxWSideBar} padding={0} marginBottom={10}>
          <Sidebar
            state={state}
            dispatch={dispatch}
            jwtToken={jwtToken}
            //reload={reload}
          />
        </Container>

        <Spacer />

        <Container maxW={maxWMainContent} padding={0} margin={0}>
          {/* <Dropzone ctxt={ctxt} state={state} dispatch={dispatch} toast={toast}> */}
          <MainContent state={state} dispatch={dispatch} jwtToken={jwtToken} />
          {/* </Dropzone> */}
        </Container>
      </Flex>
    </Container>
  );
};

export default Layout;