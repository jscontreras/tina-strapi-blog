import "../styles/index.css";

import {
  StrapiMediaStore,
  StrapiProvider,
  TinaStrapiClient,
} from "react-tinacms-strapi";
import { TinaCMS, TinaProvider } from "tinacms";

import { useMemo } from "react";

export default function MyApp({ Component, pageProps }) {
  const cms = useMemo(
    () =>
      new TinaCMS({
        sidebar: { hidden: true },
        toolbar: { hidden: false },
        apis: {
          strapi: new TinaStrapiClient(),
        },
        media: {
          store: new StrapiMediaStore(),
        },
      })
  );
  return (
    <TinaProvider cms={cms}>
      <StrapiProvider
        onLogin={() => {
          /* we'll come back to this */
        }}
        onLogout={() => {
          /* we'll come back to this */
        }}
      >
        <Component {...pageProps} />
      </StrapiProvider>
    </TinaProvider>
  );
}
