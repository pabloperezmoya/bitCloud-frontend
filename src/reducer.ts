/* eslint-disable @typescript-eslint/no-explicit-any */
export const initialState = {
  selectedFolder: {
    folderName: "root",
  },
  loading: true,
  loadingFiles: true,
  loadingFolders: true,
  error: null,
  folders: [],
  data: null,
  files: [],
  persistSelectedFolderName: null,
  selectedFolderName: "root",
  recoverSelectedFolderName: null,
  fetchFiles: false,
  fetchFolders: false,
  searchQuery: null,
};

type appActionType = {
  type: string;
  payload?: any;
};

enum ActionTypes {
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",

  SET_LOADING_FOLDERS = "SET_LOADING_FOLDERS",
  SET_LOADING_FILES = "SET_LOADING_FILES",

  FETCH_FOLDERS_SUCCESS = "FETCH_FOLDERS_SUCCESS",
  FETCH_FOLDERS_ERROR = "FETCH_FOLDERS_ERROR",
  SET_SELECTED_FOLDER = "SET_SELECTED_FOLDER",
  SET_SELECTED_FOLDER_NAME = "SET_SELECTED_FOLDER_NAME",
  PERSIST_SELECTED_FOLDER_NAME = "PERSIST_SELECTED_FOLDER_NAME",
  RECOVER_SELECTED_FOLDER_NAME = "RECOVER_SELECTED_FOLDER_NAME",

  SET_FILES = "SET_FILES",
  SET_FOLDERS = "SET_FOLDERS",
  FETCH_FILES = "FETCH_FILES",
  FETCH_FOLDERS = "FETCH_FOLDERS",
  DELETE_FILE = "DELETE_FILE",
  DELETE_FOLDER = "DELETE_FOLDER",
  SET_SEARCH_QUERY = "SET_SEARCH_QUERY",
}

const appReducer = (state = initialState, action: appActionType) => {
  switch (action.type) {
    case ActionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case ActionTypes.DELETE_FOLDER:
      return {
        ...state,
        folders: action.payload,
      };

    case ActionTypes.FETCH_FOLDERS:
      return {
        ...state,
        fetchFolders: !state.fetchFolders,
      };
    case ActionTypes.FETCH_FILES:
      return {
        ...state,
        fetchFiles: !state.fetchFiles,
      };

    case ActionTypes.DELETE_FILE:
      return {
        ...state,
        files: action.payload,
      };

    case ActionTypes.SET_LOADING_FILES:
      return {
        ...state,
        loadingFiles: true,
        error: null,
      };

    case ActionTypes.SET_LOADING_FOLDERS:
      return {
        ...state,
        loadingFolders: true,
        error: null,
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ActionTypes.SET_FOLDERS:
      return {
        ...state,
        loadingFolders: false,
        error: null,
        folders: action.payload,
      };

    case ActionTypes.SET_FILES:
      return {
        ...state,
        loadingFiles: false,
        error: null,
        files: action.payload,
      };

    case ActionTypes.PERSIST_SELECTED_FOLDER_NAME:
      return {
        ...state,
        persistSelectedFolderName: action.payload,
      };

    case ActionTypes.RECOVER_SELECTED_FOLDER_NAME:
      return {
        ...state,
        recoverSelectedFolderName: action.payload,
      };

    case ActionTypes.SET_SELECTED_FOLDER_NAME:
      return {
        ...state,
        loading: false,
        error: null,
        selectedFolderName: action.payload,
      };

    case ActionTypes.SET_SELECTED_FOLDER:
      return {
        ...state,
        loading: false,
        error: null,
        selectedFolder: action.payload,
        files: action.payload.files,
      };

    default:
      return state;
  }
};

export { appReducer, ActionTypes };
