<script setup lang="ts">
//@ts-ignore
import { clearUser, getUser } from '@/stores/user'
//@ts-ignore
import { clearToken } from '@/stores/token'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

const isProfileMenuOpen = ref(false)

function toggleProfileMenu() {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}
const user = getUser()
const logout = () => {
  clearUser(), clearToken()
  router.push('/')
}

const name = 'Nav'
</script>

<template>
  <nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <ul>
              <li>
                <router-link class="xl text-red-600 font-semibold" to="/currency/usd">
                  Airtel Money
                </router-link>
              </li>
            </ul>
          </div>
          <div class="hidden sm:ml-6 sm:block justify-center">
            <div id="navlinks" class="flex space-x-4">
              <router-link to="/currency/cdf">CDF</router-link>
              <router-link to="/currency/usd">USD</router-link>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <p class="text-white">{{ user?.UserName }}</p>
          <button
            type="button"
            class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {{ user?.user.UserName }}
          </button>

          <!-- Profile dropdown -->
          <div class="relative ml-3" :aria-expanded="isProfileMenuOpen">
            <div>
              <button
                @click="toggleProfileMenu"
                type="button"
                class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
            </div>

            <div
              :class="{ hidden: !isProfileMenuOpen }"
              class="menu absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <!-- Active: "bg-gray-100", Not Active: "" -->
              <a
                class="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="user-menu-item-0"
                >Profile</a
              >
              <a
                @click="logout"
                href=""
                class="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="user-menu-item-1"
                >Déconnexion</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
#navlinks {
  display: flex;
  justify-content: center;
  color: white;
  font-size: 18px;
}
</style>
