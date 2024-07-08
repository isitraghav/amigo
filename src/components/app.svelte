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
  import routes, { hideToolbar } from "../js/routes";
  import { loggedin, userData } from "../lib/firebase";
  import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
  import eruda from "eruda";

  import { FirebaseFirestore } from "@capacitor-firebase/firestore";

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

  let setupopened = false;

  loggedin.subscribe(async (value) => {
    if (value) {
      if (localStorage.getItem("setup") !== "done") {
        const snapshots = await FirebaseFirestore.getDocument({
          reference: "users/" + $userData.uid + "/setup/data",
        });

        if (snapshots.snapshot.data === null) {
          setupopened = true;
        } else {
          localStorage.setItem("setup", "done");
        }
      }
    }
  });

  let pickerDevice;
  function onPageInit() {
    pickerDevice = f7.picker.create({
      inputEl: "#demo-picker-device",
      cols: [
        {
          textAlign: "center",
          values: ["11th", "12th", "Dropper"],
        },
      ],
    });
  }
  onMount(() => {
    onPageInit();
  });

  let subjects = [];
  let studyGrade = "";
  let username = "";
  let usernameinfo = "";

  async function finishSetup() {
    if (
      subjects.length === 0 ||
      studyGrade === "" ||
      username === "" ||
      usernameinfo !== ""
    ) {
      f7.toast
        .create({
          text: "Please fill all the fields",
          position: "center",
          closeTimeout: 3000,
        })
        .open();
    } else {
      try {
        subjects.forEach(async (sub) => {
          await FirebaseFirestore.setDocument({
            reference: "users/" + $userData.uid + "/" + sub + "/data",
            data: {
              goal: "",
              streak: 0,
              lastStreak: 0,
            },
          });
        });
        await FirebaseFirestore.setDocument({
          reference: "users/" + $userData.uid + "/setup/data",
          data: {
            setup: true,
          },
        });
        await FirebaseFirestore.setDocument({
          reference: "users/" + $userData.uid,
          data: {
            subjects: subjects,
            studyGrade: studyGrade,
          },
        });
        await FirebaseFirestore.setDocument({
          reference: "username/" + username,
          data: {
            uid: $userData.uid,
          },
        });
      } catch (error) {
        f7.toast
          .create({
            text: error.message,
            position: "center",
            closeTimeout: 3000,
          })
          .open();
      } finally {
        localStorage.setItem("setup", "done");
        setupopened = false;
        loggedin.set(false);
        loggedin.set(true);
      }
    }
  }

  let usernamevailable = true;
  async function validateusername() {
    username = username.replace(/[^a-zA-Z0-9]/g, "");
    const snapshot = await FirebaseFirestore.getDocument({
      reference: "username/" + username,
    });
    if (snapshot.snapshot.data === null) {
      usernamevailable = true;
      usernameinfo = "";
    } else {
      usernamevailable = false;
      usernameinfo = "Username not available";
    }
  }
</script>

<App {...f7params}>
  <Views tabs class="safe-areas">
    <Toolbar tabbar icons bottom>
      <Link tabLink="#view-home" tabLinkActive iconIos="f7:house_fill" />
      <!-- <Link tabLink="#view-planner" iconIos="f7:calendar" /> -->
      <!-- <Link tabLink="#view-streak" iconIos="f7:flame" /> -->
      <Link tabLink="#view-profile" iconIos="f7:person" />
    </Toolbar>

    <View id="view-home" main tab tabActive url="/" />
    <View id="view-planner" name="planner" tab url="/planner/" />
    <View id="view-streak" name="streak" tab url="/streak/" />
    <View id="view-profile" name="profile" tab url="/profile/" />

    <LoginScreen opened={setupopened}>
      <div class="mt-4">
        <LoginScreenTitle>
          <div class="text-4xl">Setup</div>
          <div class="text-sm font-light mt-1">Let us guide you better</div>
        </LoginScreenTitle>
        <List outline strong>
          <ListInput
            type="text"
            value={username}
            placeholder="Choose a username"
            onInput={(e) => {
              username = e.target.value;
              validateusername();
            }}
            info={usernameinfo}
          >
            <div slot="media">@</div>
          </ListInput>
          <ListInput
            type="text"
            placeholder="Set Studing Grade"
            readonly
            onChange={(e) => {
              studyGrade = e.target.value;
            }}
            inputId="demo-picker-device"
          />

          <ListItem
            title="Subjects"
            smartSelect
            smartSelectParams={{
              openIn: "popup",
              searchbar: true,
              searchbarPlaceholder: "Search Subjects",
            }}
          >
            <select
              name="Subjects"
              multiple
              on:change={(e) => {
                subjects = [];
                Object.entries(e.target.selectedOptions).forEach((e) => {
                  subjects.push(e[1].value);
                });
              }}
            >
              <optgroup label="Core Subjects">
                {#each ["Physics", "Chemistry", "Mathematics", "English", "Biology"] as sub}
                  <option value={sub}>
                    {sub}
                  </option>
                {/each}
              </optgroup>
              <optgroup label="Other">
                {#each ["Computer Science", "Physical Education"] as sub}
                  <option value={sub}>
                    {sub}
                  </option>
                {/each}
              </optgroup>
            </select>
          </ListItem>

          <ListButton title="Finish Setup" onClick={finishSetup} />
        </List>
      </div>
    </LoginScreen>

    <!-- Login Screen Modals -->

    <LoginScreen opened={!$loggedin}>
      <div
        class="flex flex-col gap-2 w-full h-full justify-center items-center"
      >
        <LoginScreenTitle>
          <div class="text-4xl">Amigo</div>
          <div class="text-sm font-light mt-1">your study planner</div>
        </LoginScreenTitle>
        <div class="mt-4">
          <Button
            onClick={async () => {
              const result = await FirebaseAuthentication.signInWithGoogle();
            }}
            tonal
            class="rounded-full w-42 gap-2 p-3 flex items-center justify-center"
          >
            <Icon f7="logo_google" size={20} />
            Continue With Google
          </Button>
        </div>
      </div>
    </LoginScreen>
  </Views>
</App>
