<script lang="ts">
  import { onMount } from "svelte";
  import { sineIn } from "svelte/easing";
  import { pwaInfo } from "virtual:pwa-info";
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import {
    Drawer,
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
    Sidebar,
    SidebarBrand,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
  } from "flowbite-svelte";
  import { HomeOutline } from "flowbite-svelte-icons";

  import "../app.css";

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
  let offline = false;
  $: offline;

  onMount(async () => {
    if (pwaInfo) {
      const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
        immediate: true,
        onRegistered(r) {
          r &&
            setInterval(() => {
              console.log(`Checking for sw update: ${r}`);
              // since r.sync isn't avilable

              r.update();
            }, 20000 /* 20s for testing purposes */);
        },
        onRegisterError(error) {
          console.log("SW registration error", error);
        },
        onOfflineReady() {
          console.log("SW ready for offline");
          // setTimeout(() => close(), 5000);
        },
      });

      if (needRefresh) {
        console.log("Updating sw");
        updateServiceWorker(true);
      }

      if (offlineReady) {
        console.log("Offline Ready");
        offline = true;
      }
    }
  });
</script>

<svelte:head>
  {@html webManifest}
</svelte:head>

<main>
  <div style="height:100%;" class="pb-8 pl-5 pr-5 pt-8">
    <slot />
  </div>
</main>
