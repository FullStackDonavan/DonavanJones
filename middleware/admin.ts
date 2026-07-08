import { defineNuxtRouteMiddleware } from "#app";
import { useUser } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async () => {
  const user = await useUser()

  if (!user?.isAdmin) {
    return '/dashboard'
  }
})
