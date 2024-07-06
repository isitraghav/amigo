<script>
  import { List, ListButton, ListItem, Page } from "framework7-svelte";
  import { loggedin, userData } from "../lib/firebase";
  import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
</script>

<Page>
  <div class="mt-3 w-full flex flex-col justify-center items-center">
    <img
      src={$userData.photoUrl}
      class="object-cover m-auto rounded-full w-24 h-24 aspect-square"
      alt=""
    />
    <h1 class="text-2xl font-bold">{$userData.displayName}</h1>
    <p class="text-gray-500">{$userData.email}</p>
  </div>
  <List strongIos inset>
    <ListButton
      color="red"
      onClick={async () => {
        await FirebaseAuthentication.signOut();
        location.reload();
      }}
      title="Sign Out"
    />
  </List>
</Page>
