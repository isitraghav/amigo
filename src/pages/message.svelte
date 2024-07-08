<script>
  import {
    Icon,
    Message,
    Messagebar,
    Messages,
    Navbar,
    Page,
  } from "framework7-svelte";
  import axios from "axios";
  import { userData } from "../lib/firebase";
  import { onMount } from "svelte";
  export let sub;
  export let topic;

  let apiendpoint = "https://groq-api-xi.vercel.app";

  if (process.env.NODE_ENV === "development") {
    console.log("dev");
    apiendpoint = "http://localhost:3000";
  }

  if (sub === undefined) {
    sub = "what they ask";
  }

  console.log(sub, topic);

  let messages = [];
  let messageText = "";
  let placeholder = "Ask something...";

  function ask(q) {
    messageText = "";
    let p = {
      sysprompt: `You are a personal teacher of ${$userData.displayName}. You are now messaging with him, help him with anything related to ${sub}, keep replies short in normal, and long when he asks something.`,
      prompt: `help with ${topic}`,
    };

    if (q) {
      p = {
        sysprompt: `You are a personal teacher of ${$userData.displayName}. You are now messaging with him, help him with anything related to ${sub}, help him with ${topic}, keep replies short in normal, and long when he asks something.`,
        prompt: q,
      };
      messages = [
        ...messages,
        {
          answer: q,
          type: "sent",
        },
      ];
    }

    let context = [];
    messages.forEach((msg) => {
      context = [
        ...context,
        {
          role: msg.type === "sent" ? "user" : "system",
          content: msg.answer,
        },
      ];
    });

    p["context"] = context;
    axios.post(apiendpoint + "/api/completion", p).then((res) => {
      messages = [
        ...messages,
        {
          answer: res.data,
          type: "received",
        },
      ];
    });
  }

  import { parse } from "marked";
  onMount(() => {
    ask();
  });
</script>

<Page noToolbar>
  <Navbar backLink={"/" + sub} backLinkShowText={false} title="Amigo" />
  <Messages class="gap-2">
    {#each messages as message}
      <Message type={message.type} tail>
        {@html parse(message.answer)}
      </Message>
    {/each}
  </Messages>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <Messagebar
    {placeholder}
    value={messageText}
    onInput={(e) => (messageText = e.target.value)}
  >
    <!-- <span class="link icon-only" slot="inner-start">
      <Icon ios="f7:camera_fill" md="material:camera_alt" />
    </span> -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <button
      class="w-8 flex justify-center"
      slot="inner-end"
      on:click={() => {
        if (messageText !== "") {
          ask(messageText);
        }
      }}
    >
      <Icon ios="f7:chevron_right_2" size={20} />
    </button>
  </Messagebar>
</Page>
