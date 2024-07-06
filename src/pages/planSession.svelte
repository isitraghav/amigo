<script>
  import { Navbar, Page } from "framework7-svelte";
  import { writable } from "svelte/store";
  export let sub;

  const timer = writable(localStorage.getItem(`timer${sub}`));

  setTimeout(() => {
    timer.set(localStorage.getItem(`timer${sub}`));
  }, 1000);

  let startTime = Date.now();
  let timeString = localStorage.getItem(`timer${sub}`);
  if (timeString) {
    let [minutes, seconds] = timeString.split(":");
    startTime =
      Date.now() - (parseInt(minutes) * 60000 + parseInt(seconds) * 1000);
  }
  let timerInterval = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    let minutes = Math.floor(elapsedTime / 60000);
    let seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
    let timeString =
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    localStorage.setItem(`timer${sub}`, timeString);
    timer.set(timeString);
  }, 1000);
</script>

<Page>
  <Navbar backLink title={sub} large />
  <div class="text-4xl mt-2 flex items-center justify-center">
    {$timer || "00:00"}
  </div>
</Page>
