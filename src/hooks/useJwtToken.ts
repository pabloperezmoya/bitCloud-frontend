import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const useJwtToken = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const saveTokenToLocalStorage = async () => {
      try {
        const jwtToken = (await getToken({ template: "userIDJWT" })) ?? "";
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
      console.log("Token JWT actualizado correctamente.");
    } catch (error) {
      console.error("Error al obtener el token JWT:", error);
    }
  };

  const getJwtToken = () => {
    const storedToken = localStorage.getItem("jwtToken");
    return storedToken;
  };

  return { getJwtToken };
};

export default useJwtToken;
