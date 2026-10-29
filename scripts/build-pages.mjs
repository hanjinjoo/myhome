import {build} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {copyFile,writeFile} from 'node:fs/promises';
const root=fileURLToPath(new URL('..',import.meta.url));
await build({
 configFile:false,
 root:resolve(root,'github-pages'),
 base:'/myhome/',
 plugins:[react()],
 define:{__FAMILY_API_ORIGIN__:JSON.stringify('https://our-family-garden-1028.ycqg-40.chatgpt.site')},
 build:{outDir:resolve(root,'pages-dist'),emptyOutDir:true},
});
await copyFile(resolve(root,'public/favicon.svg'),resolve(root,'pages-dist/favicon.svg'));
await writeFile(resolve(root,'pages-dist/.nojekyll'),'');

