import {
  ClerkProvider,
  RedirectToSignIn,
  SignIn,
  SignInButton,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";

import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import theme from "./theme.ts";

import Layout from "./components/Layout/Layout";
import { ChakraProvider } from "@chakra-ui/react";

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

function PublicPage() {
  const { isSignedIn, isLoaded } = useAuth();

  const { fileKey, shareId } = useParams();

  return (
    <>
      <h1>Public page</h1>
      <h1>{fileKey}</h1>
      <h1>{shareId}</h1>
      {isLoaded && isSignedIn ? (
        <>
          <Link to="/dashboard">Go to Dashboard🚀</Link>
          <UserButton />
        </>
      ) : (
        <SignInButton afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
      )}

      {/* TODO: App index page */}
    </>
  );
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route path="/" element={<PublicPage />} />

        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
        />
        <Route
          path="/dashboard/"
          element={
            <>
              <SignedIn>
                <Layout receiveShare={false} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/dashboard/shared/:fileKey/:shareId"
          element={
            <>
              <SignedIn>
                <Layout receiveShare={true} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <ClerkProviderWithRoutes />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
