import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <title>Arcano Challenge</title>
      </Head>
      <body className={`bg-slate-800 text-slate-300 font-sourcesanspro`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
