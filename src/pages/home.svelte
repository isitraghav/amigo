<script>
  import {
    Block,
    BlockHeader,
    Button,
    Card,
    CardContent,
    CardHeader,
    Icon,
    Link,
    List,
    ListItem,
    Navbar,
    Page,
    SkeletonBlock,
  } from "framework7-svelte";
  import { loggedin, userData } from "../lib/firebase";

  import { FirebaseFirestore } from "@capacitor-firebase/firestore";
  import { writable } from "svelte/store";

  let subjects = [];
  const playerState = writable({});
  const playerTime = writable({});

  loggedin.subscribe(async (value) => {
    if (value) {
      const snapshots = await FirebaseFirestore.getDocument({
        reference: "users/" + $userData.uid,
      });
      if (snapshots.snapshot.data) {
        subjects = snapshots.snapshot.data.subjects;

        Object.entries(subjects).forEach((key) => {
          key = key[1];
          playerTime.update((n) => {
            n[key] = localStorage.getItem(`timer${key}`);
            return n;
          });
        });
      }
    }
  });

  let timerInterval = {};
  function startTimer(name) {
    let startTime = Date.now();
    let timeString = localStorage.getItem(`timer${name}`);
    if (timeString) {
      let [hours, minutes, seconds] = timeString.split(":").map(Number);
      startTime =
        Date.now() -
        (isNaN(hours) ? 0 : hours * 3600000) -
        (isNaN(minutes) ? 0 : minutes * 60000) -
        (isNaN(seconds) ? 0 : seconds * 1000);
    }
    timerInterval[name] = setInterval(() => {
      let elapsedTime = Date.now() - startTime;
      let hours = Math.floor(elapsedTime / 3600000);
      let minutes = Math.floor((elapsedTime % 3600000) / 60000);
      let seconds = Math.floor((elapsedTime % 60000) / 1000);
      let timeString =
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");
      localStorage.setItem(`timer${name}`, timeString);
      playerTime.update((n) => {
        n[name] = timeString;
        return n;
      });
    }, 1000);
  }
  function stopTimer(name) {
    clearInterval(timerInterval[name]);
  }

  function activateSubTimer(sub) {
    if (!$playerState[sub]) {
      playerState.update((state) => {
        Object.keys(state).forEach((key) => {
          state[key] = false;
          stopTimer(key);
        });
        state[sub] = true;
        return state;
      });
      startTimer(sub);
    } else {
      playerState.update((state) => {
        state[sub] = false;
        stopTimer(sub);
        return state;
      });
    }
  }
</script>

<Page>
  <Navbar title="Amigo" />
  <Block>
    <div>
      <p class="text-2xl">
        Hello {($userData.displayName || "  ").split(" ")[0]}!
      </p>
      <p class="text-gray-300">
        Welcome to Amigo. Here you can keep track of your study progress.
      </p>
    </div>
  </Block>
  <div class="mx-3">
    {#if subjects.length === 0}
      <SkeletonBlock
        class="h-10 rounded-md mb-2 skeleton-text skeleton-effect-wave"
      />
      <SkeletonBlock
        class="h-10 rounded-md skeleton-text skeleton-effect-wave"
      />
    {/if}
    {#each subjects as sub}
      <div class="flex flex-col bg-[#242323] p-1 mb-2 rounded-md">
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="flex gap-1 items-center h-10">
          <span
            type="button"
            on:click={activateSubTimer(sub)}
            class="rounded-full ml-2 cursor-pointer p-1 pb-1.5 flex justify-center items-center"
          >
            {#if $playerState[sub]}
              <Icon f7="pause" size={25} color="green" />
            {:else}
              <Icon f7="play" size={25} color="red" />
            {/if}
          </span>
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <p class="text-xl" on:click={activateSubTimer(sub)}>{sub}</p>
          <p class="ml-auto pr-6">
            {$playerTime[sub] ? $playerTime[sub] : "00:00:00"}
          </p>
        </div>
        {#if $playerState[sub]}
          <span class="mx-4">
            <div class="mb-2 flex gap-1">
              <Button tonal round small>
                <Link href="/plan/{sub}">Plan Session</Link>
              </Button>
              <Button
                onClick={() => {
                  playerTime.update((n) => {
                    n[sub] = "00:00:00";
                    localStorage.setItem(`timer${sub}`, "00:00:00");
                    return n;
                  });
                  stopTimer(sub);
                  startTimer(sub);
                }}
                class="ml-auto"
                color="red"
              >
                <Icon size={17} f7="gobackward" />
              </Button>
            </div>
          </span>
        {/if}
      </div>
    {/each}
  </div>
</Page>
