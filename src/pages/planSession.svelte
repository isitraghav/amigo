<script>
  import {
    Button,
    Icon,
    Input,
    Link,
    List,
    ListInput,
    ListItem,
    Navbar,
    Page,
  } from "framework7-svelte";
  import { writable } from "svelte/store";
  import { userData } from "../lib/firebase";
  import { FirebaseFirestore } from "@capacitor-firebase/firestore";

  export let sub;

  const timer = writable(localStorage.getItem(`timer${sub}`));

  setTimeout(() => {
    timer.set(localStorage.getItem(`timer${sub}`));
  }, 1000);

  let startTime = Date.now();
  let timeString = localStorage.getItem(`timer${sub}`);
  if (timeString) {
    let [hours, minutes, seconds] = timeString.split(":").map(Number);
    startTime =
      Date.now() -
      (isNaN(hours) ? 0 : hours * 3600000) -
      (isNaN(minutes) ? 0 : minutes * 60000) -
      (isNaN(seconds) ? 0 : seconds * 1000);
  }
  let timerInterval = setInterval(() => {
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
    localStorage.setItem(`timer${sub}`, timeString);
    timer.set(timeString);
  }, 1000);
  let newTask = "";
  let taskList = [];

  async function logTasks() {
    if (newTask) {
      await FirebaseFirestore.setDocument({
        reference: "users/" + $userData.uid + "/" + sub + "/data",
        data: {
          goal: [
            ...taskList,
            {
              task: newTask,
              subtasks: [],
              completed: false,
            },
          ],
          streak: 0,
          lastStreak: 0,
        },
      }).then(() => {
        taskList = [
          ...taskList,
          {
            task: newTask,
            subtasks: [],
            completed: false,
          },
        ];
        newTask = "";
      });
    }
  }

  FirebaseFirestore.getDocument({
    reference: "users/" + $userData.uid + "/" + sub + "/data",
  }).then((snapshots) => {
    if (snapshots.snapshot.data) {
      taskList = [...snapshots.snapshot.data.goal];
    }
  });
</script>

<Page>
  <Navbar
    onBackClick={() => {
      clearInterval(timerInterval);
    }}
    backLink="/"
    backLinkShowText={false}
    title={sub}
    large
  />
  <div class="text-4xl mt-2 flex items-center justify-center">
    {$timer || "00:00:00"}
  </div>
  <List>
    <div class="justify-center flex items-center">
      <Input
        value={newTask}
        onChange={(e) => {
          newTask = e.target.value;
        }}
        info="Let AI break it down for you"
        class="w-full mx-2"
        type="text"
        placeholder="What do you want to study"
      ></Input>
      <Button class="mx-2" round fill onClick={logTasks}>Log</Button>
    </div>
  </List>
  <List strong outline>
    {#if taskList.length !== 0}
      <div class="text-3xl mx-3 pt-3 mb-3">Tasks</div>
    {/if}
    {#each taskList as task}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="flex items-center">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="ml-2 flex items-center"
          on:click={() => {
            task.completed = !task.completed;
            FirebaseFirestore.setDocument({
              reference: "users/" + $userData.uid + "/" + sub + "/data",
              data: {
                goal: taskList,
              },
            });
          }}
        >
          {#if task.completed}
            <Icon f7="checkmark_alt_circle_filled" color="blue" size={20} />
            <ListItem title={task.task} class="line-through" />
          {:else}
            <Icon f7="checkmark_alt_circle" color="blue" size={20} />
            <ListItem title={task.task} />
          {/if}
        </div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="ml-auto mr-4">
          <Link href="/messages/{sub}/{task.task}/">
            <Icon f7="wand_stars" size={20} />
          </Link>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="mr-4"
          on:click={() => {
            taskList = taskList.filter((t) => t !== task);

            FirebaseFirestore.setDocument({
              reference: "users/" + $userData.uid + "/" + sub + "/data",
              data: {
                goal: taskList,
              },
            });
          }}
        >
          <Icon f7="trash" color="red" size={20} />
        </div>
      </div>
    {/each}
  </List>
</Page>
