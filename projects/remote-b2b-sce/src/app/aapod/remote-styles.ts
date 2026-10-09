import { environment } from "../../environments/environment";
 
declare let versionDataList: any;
declare let environmentAllData: any;
declare let versionWebDataList: any;
 
export function loadRemoteStyles(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const isWeb = environment.PLATFORM_NAME === 'WEB';
      const baseDomain = isWeb ? environmentAllData.apiBaseUrl + '/3in1web/' : environmentAllData.apiBaseUrl + '/DPAOP/';
      const baseUrl = isWeb
        ? `${baseDomain}remote-b2b-sce/${versionWebDataList?.["b2b-sce"] ?? ''}/`
        : `${baseDomain}remote-sce/${versionDataList?.["b2b-sce"] ?? ''}/`;

      // Set langJsonUrl early with a default value
      (window as any).langJsonUrl = `${baseUrl}assets/i18n/`;
      // (window as any).langJsonUrl = 'http://localhost:4300/assets/i18n/';

      if (isWeb) {
        // WEB: Try to get styles.[hash].css from index.html
        const indexUrl = baseUrl + 'index.html';
        // const indexUrl = 'http://localhost:4300/index.html'
        fetch(indexUrl)
          .then(res => res.text())
          .then(html => {
            try {
              const match = html.match(/href="(styles(?:\.[a-z0-9]+)?\.css)"/);
              const cssFile = match?.[1] ?? 'styles.css';
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = baseUrl + cssFile;
              // link.href = 'http://localhost:4300/styles.css'
              document.head.appendChild(link);
              resolve();
            } catch (parseError) {
              console.error('Error parsing index.html:', parseError);
              resolve();
            }
          })
          .catch((err) => {
            console.error('Failed to fetch index.html:', err);
            resolve();
          });
      } else {
        // APP: Directly use styles.css without fetching index.html
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = baseUrl + 'styles.css';
        document.head.appendChild(link);
        resolve();
      }
    } catch (outerError) {
      console.error('Unexpected error in loadRemoteStyles():', outerError);
      resolve();
    }
  });
}
 