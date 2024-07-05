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

  let activesetuptab = 0;
  let setup = [
    {
      input: "name",
      label: "Name",
      placeholder: "Your name",
      type: "text",
      clearButton: true,
    },
    {
      input: "email",
      label: "Email",
      placeholder: "Your email",
      type: "email",
      clearButton: true,
    },
    {
      input: "password",
      label: "Password",
      placeholder: "Your password",
      type: "password",
      clearButton: true,
    },
  ];

  let setupData = {
    name: "",
    email: "",
    password: "",
  };

  import { supabase } from "../lib/supabase";
</script>

<App {...f7params}>
  <!-- Views/Tabs container -->
  <Views tabs class="safe-areas">
    <!-- Tabbar for switching views-tabs -->
    <Toolbar tabbar icons bottom>
      <Link tabLink="#view-home" tabLinkActive iconIos="f7:house_fill" />
      <Link tabLink="#view-streak" iconIos="f7:flame" />
      <Link tabLink="#view-settings" iconIos="f7:person" />
    </Toolbar>

    <!-- Your main view/tab, should have "view-main" class. It also has "tabActive" prop -->
    <View id="view-home" main tab tabActive url="/" />

    <!-- Catalog View -->
    <View id="view-catalog" name="catalog" tab url="/catalog/" />

    <!-- Settings View -->
    <View id="view-settings" name="settings" tab url="/settings/" />
  </Views>

  <!-- Setup -->
  <LoginScreen opened>
    <LoginScreenTitle>
      <div class="font-light">Amigo</div>
    </LoginScreenTitle>
    <div class="mt-4 w-2/3 mx-auto">
      <div>
        <Input
          label={setup[activesetuptab].label}
          outline
          bind:value={setupData[setup[activesetuptab].input]}
          class="py-4 pl-3"
          onInput={(e) => {
            setupData[setup[activesetuptab].input] = e.target.value;
          }}
          type={setup[activesetuptab].type}
          placeholder={setup[activesetuptab].placeholder}
          clearButton={setup[activesetuptab].clearButton}
        />
        <Button
          class="rounded-full w-24"
          small
          disabled={!setupData[setup[activesetuptab].input]}
          tonal
          onClick={async () => {
            activesetuptab = activesetuptab + 1;
            if (activesetuptab >= setup.length) {
              activesetuptab = 0;
              console.log("setupData", setupData);
              try {
                await supabase.auth
                  .signUp({
                    email: setupData.email,
                    password: setupData.password,
                    options: {
                      data: {
                        name: setupData.name,
                      },
                    },
                  })
                  .then((res) => {
                    console.log("res", res);
                  });
              } catch (error) {
                await supabase.auth
                  .signInWithPassword({
                    email: setupData.email,
                    password: setupData.password,
                  })
                  .then((res) => {
                    console.log("res", res);
                  });
              }
              f7.loginScreen.close();
              f7.dialog.alert("You are now logged in!", "Success!");
            }
          }}
        >
          {#if activesetuptab < setup.length - 1}Next{:else}Finish{/if}
        </Button>
      </div>
    </div>
  </LoginScreen>
</App>
