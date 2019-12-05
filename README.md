## How to run the app

1. Open this link: https://facebook.github.io/react-native/docs/getting-started
2. Select "React Native CLI Quickstart" > "Windows / macOS" > "Android".
3. Do "Installing dependencies" and "Preparing the Android device".  
**DO NOT** do anything else.
4. `git clone https://github.com/Elflyn/GeekOverflow.git && cd GeekOverflow/TritonDeal`
5. `npm install -g yarn && yarn install`
6. `npx react-native run-android`

## Note

Run `yarn install` whenever you see something like `warn Package xxx has been ignored because it contains invalid configuration. Reason: Cannot find module 'xxx/package.json'`.

To build the release version, `cd android && gradlew assembleRelease`. The output apk is located at `./android/app/build/outputs/apk/release`
