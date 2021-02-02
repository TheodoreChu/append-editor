# Monaco Editor Workers

This folder contains the workers required to make full use of the Monaco Editor. Build them in the `dist` folder by running `yarn run build`, then copy the workers from `dist` to `../public/monaco` by running `yarn run copy`. Create React App will bundle the remaining of the necessary files because we import the Monaco Editor in [Editor.tsx](../src/components/Editor.tsx) with `import * as monaco from 'monaco-editor';`.
