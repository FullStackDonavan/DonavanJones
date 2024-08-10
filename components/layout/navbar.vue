<script setup lang="ts">
// import { userLogout } from "~/composables/useAuth";

// import { ref } from "@vue/reactivity";

// import { onClickOutside } from "@vueuse/core";

// const hideActions = ref(true);
// const userActions = ref(null);

// onClickOutside(userActions, () => (hideActions.value = true));
</script>

<template>
  <MenuContainer>
    <MobileMenuContainer>
      <MobileMenuButton />
      <ClickableLogo />
    </MobileMenuContainer>
    <MenuList />
    <IconList />
  </MenuContainer>
</template>
