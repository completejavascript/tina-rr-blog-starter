// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import {
  Code,
  ColorSchemeScript,
  Container,
  mantineHtmlProps,
  MantineProvider,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import appConfig from "config";
import type { Route } from "./+types/root";
import "./app.css";
import LanguageProvider from "./context/LanguageContext";

// export const links: Route.LinksFunction = () => [
//   { rel: "preconnect", href: "https://fonts.googleapis.com" },
//   {
//     rel: "preconnect",
//     href: "https://fonts.gstatic.com",
//     crossOrigin: "anonymous",
//   },
//   {
//     rel: "stylesheet",
//     href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
//   },
// ];

export async function loader({ params }: Route.LoaderArgs) {
  const { language = appConfig.defaultLanguage } = params;

  return {
    data: {
      language,
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useLoaderData<typeof loader>();

  return (
    <html lang={data.language} {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>
          <LanguageProvider language={data.language}>
            {children}
          </LanguageProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container size="lg" py="xl" px="md">
      <Title order={1} mb="md">
        {message}
      </Title>
      <Text mb={stack ? "lg" : 0}>{details}</Text>

      {stack && (
        <Paper
          withBorder
          p="md"
          mt="md"
          style={{
            overflowX: "auto",
            backgroundColor: "var(--mantine-color-gray-0)",
          }}
        >
          <Code block>{stack}</Code>
        </Paper>
      )}
    </Container>
  );
}
