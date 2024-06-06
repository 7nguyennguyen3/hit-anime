import Script from "next/script";

const GoogleAnalyticScripts = () => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-VV462XBT6W"
      />
      <Script strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VV462XBT6W');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalyticScripts;
