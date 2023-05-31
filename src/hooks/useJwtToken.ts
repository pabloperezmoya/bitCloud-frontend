import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { get } from "http";

const useJwtToken = () => {
  const { getToken } = useAuth();
  let jwtToken;

  useEffect(() => {
    const saveTokenToLocalStorage = async () => {
      try {
        jwtToken = (await getToken({ template: "userIDJWT" })) ?? "";
        localStorage.setItem("jwtToken", jwtToken);
      } catch (error) {
        console.error("Error al obtener el token JWT:", error);
        // Intentar obtener un nuevo token
        await retryGetToken();
      }
    };

    saveTokenToLocalStorage();
  }, []);

  const retryGetToken = async () => {
    try {
      const jwtToken = (await getToken({ template: "userIDJWT" })) ?? "";
      localStorage.setItem("jwtToken", jwtToken);
    } catch (error) {
      console.error("Error al obtener el token JWT:", error);
    }
  };

  const getJwtToken = () => {
    const storedToken = localStorage.getItem("jwtToken");
    if (!storedToken) {
      console.error("No se encontró el token JWT en el localStorage.");
      retryGetToken().then(() => {
        getJwtToken();
      });
    }
    return storedToken;
  };

  return { getJwtToken };
};

export default useJwtToken;
