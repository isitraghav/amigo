<script>
  import { Block, BlockHeader, Navbar, Page } from "framework7-svelte";
  import { userData } from "../lib/firebase";
</script>

<Page>
  <Navbar title="Amigo"></Navbar>
  <Block>
    <div>
      <p class="text-2xl">
        Hello {($userData.displayName || "  ").split(" ")[0]}!
      </p>
    </div>
  </Block>
</Page>
