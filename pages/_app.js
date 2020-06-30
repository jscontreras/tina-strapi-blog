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
        sidebar: false,
        toolbar: pageProps.preview,
        enabled: pageProps.preview,
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
      <StrapiProvider onLogin={enterEditMode} onLogout={exitEditMode}>
        <Component {...pageProps} />
      </StrapiProvider>
    </TinaProvider>
  );
}

const enterEditMode = () => {
  return fetch(`/api/preview`).then(() => {
    window.location.href = window.location.pathname;
  });
};

const exitEditMode = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload();
  });
};
