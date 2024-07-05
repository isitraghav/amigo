<script>
  import { onMount } from "svelte";
  import { getDevice } from "framework7/lite-bundle";
  import {
    f7,
    f7ready,
    App,
    Panel,
    Views,
    View,
    Popup,
    Page,
    Navbar,
    Toolbar,
    NavRight,
    Link,
    Block,
    BlockTitle,
    LoginScreen,
    LoginScreenTitle,
    List,
    ListItem,
    ListInput,
    ListButton,
    BlockFooter,
    Input,
    Button,
    Icon,
  } from "framework7-svelte";

  import capacitorApp from "../js/capacitor-app";
  import routes from "../js/routes";

  const device = getDevice();
  let f7params = {
    name: "amigo", // App name
    theme: "ios", // Automatic theme detection
    colors: {
      primary: "#007aff",
    },
    darkMode: true,

    routes: routes,
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };
  onMount(() => {
    f7ready(() => {
      // Init capacitor APIs (see capacitor-app.js)
      if (f7.device.capacitor) {
        capacitorApp.init(f7);
      }
      // Call F7 APIs here
    });
  });

  import { loggedin } from "../lib/firebase";
  import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
  import eruda from "eruda";
  eruda.init();
</script>

<App {...f7params}>
  <Views tabs class="safe-areas">
    <Toolbar tabbar icons bottom>
      <Link tabLink="#view-home" tabLinkActive iconIos="f7:house_fill" />
      <Link tabLink="#view-streak" iconIos="f7:flame" />
      <Link tabLink="#view-settings" iconIos="f7:person" />
    </Toolbar>

    <View id="view-home" main tab tabActive url="/" />
    <View id="view-catalog" name="catalog" tab url="/catalog/" />
    <View id="view-settings" name="settings" tab url="/settings/" />
  </Views>

  <LoginScreen opened={!$loggedin}>
    <div class="flex flex-col gap-2 w-full h-full justify-center items-center">
      <LoginScreenTitle>
        <div class="font-light">Amigo</div>
      </LoginScreenTitle>
      <div class="mt-4">
        <Button
          onClick={async () => {
            const result = await FirebaseAuthentication.signInWithGoogle();
            console.log(result);
          }}
          class="rounded-full w-42 flex items-center justify-center"
        >
          <Icon icon="google" class="mr-1" />
          continue with Google
        </Button>
      </div>
    </div>
  </LoginScreen>
</App>
