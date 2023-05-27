/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer, useContext } from "react";
import useSWR, { mutate } from "swr";
import { appReducer, ActionTypes } from "../reducer";
import { ApiContext } from "../api/apiContext";
import { useAuth } from "@clerk/clerk-react";

export const fetcher = async (url: string, jwtTokenFunc: any) => {
  try {
    const jwtToken = await jwtTokenFunc();
    console.log("jwtToken", jwtToken);
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error al obtener los datos de la API");
  }
};

export function useAPI(endpoint: string) {
  const { getToken } = useAuth();

  const { apiEndpointHost } = useContext(ApiContext);

  const completeEndpoint = `${apiEndpointHost}${endpoint}`;

  const initialState = {
    selectedFolder: null,
    loading: true,
    error: null,
    folders: [],
    data: null,
    files: [],
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  const { isLoading, data, error } = useSWR(
    completeEndpoint,
    (url: string) => fetcher(url, () => getToken({ template: "userIDJWT" })),
    {
      onSuccess: (data) => {
        dispatch({
          type: ActionTypes.FETCH_SUCCESS,
          payload: data,
        });
      },
      onError: (error) => {
        dispatch({
          type: ActionTypes.FETCH_ERROR,
          payload: error,
        });
      },
    }
  );

  const reload = async (endpoint: string) => {
    await mutate(`${apiEndpointHost}${endpoint}`);
  };

  return {
    state,
    loading: isLoading,
    dispatch,
    reload,
  };
}
