<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <!-- Logo -->
        <q-btn flat round icon="school" color="white" class="q-mr-md" />

        <!-- Site Name -->
        <q-toolbar-title>
          title here
        </q-toolbar-title>

        <!-- Navigation Menu (Large Screens) -->
        <div class="desktop-nav q-gutter-md" v-if="!isMobile">
          <q-btn
            v-for="(item, index) in navItems"
            :key="index"
            flat
            :label="item.label"
            class="text-white"
            @click="navigateTo(item.route)"
          />
        </div>

        <!-- Drawer Toggle Button (Small Screens) -->
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="mobile-nav"
          @click="drawer = true"
          v-if="isMobile"
        />

      </q-toolbar>

      <!-- Drawer -->
      <q-drawer
        v-model="drawer"
        side="left"
        overlay
        class="bg-primary text-white"
      >
        <q-list>
          <q-item
            v-for="(item, index) in navItems"
            :key="index"
            clickable
            @click="navigateTo(item.route); drawer = false"
          >
            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </q-header>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const drawer = ref(false);

    const navItems = [
      { label: "Home", route: "/" },
      { label: "About", route: "/about" },
      { label: "lecturerMain", route: "/lecturerMain" },
      { label: "lecturerCalendar", route: "/lecturerCalendar" },
      { label: "StudentMainCalendar", route: "/StudentMainCalendar" },
      { label: "enrollment", route: "/enrollment" },
      { label: "payment", route: "/payment" },
      { label: "main", route: "/main" },
      { label: "admin", route: "/admin" },
    ];

    // Responsive check
    const isMobile = computed(() => window.innerWidth <= 600);

    const navigateTo = (route) => {
      this.$router.push(route);
    };

    return {
      drawer,
      navItems,
      isMobile,
      navigateTo,
    };
  },
};
</script>

<style scoped>
.desktop-nav {
  display: flex;
  gap: 1rem;
}

.mobile-nav {
  display: flex;
}

@media (max-width: 600px) {
  .desktop-nav {
    display: none;
  }
}

@media (min-width: 601px) {
  .mobile-nav {
    display: none;
  }
}
</style>
