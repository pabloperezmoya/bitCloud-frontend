import React, { createContext, useState } from "react";

const initialApiEndpointHost =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_ENDPOINT_HOST_DEV
    : import.meta.env.VITE_API_ENDPOINT_HOST_PROD;

export const ApiContext = createContext({
  apiEndpointHost: initialApiEndpointHost,
  jwtToken: "" && null,
});
