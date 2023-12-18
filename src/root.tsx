import { Insights } from "@builder.io/qwik-labs";
import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import { end, start } from "./routes/measure";

const isProd = !(import.meta.env.DEV || false);

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={`(${start})()`} />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <Insights publicApiKey={import.meta.env.PUBLIC_QWIK_INSIGHTS_KEY} />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
        <script dangerouslySetInnerHTML={`(${end})()`} />
        {isProd && (
          <script type="module">
            import from "/build/q-b8680498.js"; import from
            "/build/q-f226d786.js";
          </script>
        )}
      </body>
    </QwikCityProvider>
  );
});
