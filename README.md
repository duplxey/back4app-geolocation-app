# back4app-social-network

This repository demonstrates how to build a geolocation app with [Back4app](https://www.back4app.com/) and [React Native](https://reactnative.dev/)/[Expo](https://expo.dev/).

To learn more check out the [article](#).

## Development (frontend)

1. Install the dependencies via NPM.

    ```bash
   $ npm install
   ```

2. Create the *.env.local* environmental variables file:

    ```bash
   EXPO_PUBLIC_PARSE_APPLICATION_ID=<parse_app_id>
   EXPO_PUBLIC_PARSE_JAVASCRIPT_KEY=<parse_javascript_key>
   ```
   
   > Make sure to replace `<parse_app_id>` and `<parse_javascript_key>` with your actual ID and key. To obtain your credentials navigate to your Back4app app and select "App Settings > Security & Keys" in the sidebar.
   
3. Run the Expo development server.

    ```bash
   $ expo start
   ```
   
4. Press `A` to open your app in the emulator/connected Android device.
