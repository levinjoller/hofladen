import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/supabase";
import { presentToast } from "@/services/toast-service";
import type { User, Subscription } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isInitialized = ref(false);
  const authSubscription = ref<Subscription | null>(null);

  async function initialize() {
    if (isInitialized.value) return;
    const { data } = await supabase.auth.getUser();
    user.value = data.user;
    if (!authSubscription.value) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          user.value = session?.user ?? null;
          if (event === "SIGNED_OUT") {
            user.value = null;
          }
        },
      );
      authSubscription.value = authListener.subscription;
    }
    isInitialized.value = true;
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        presentToast(error.message, "danger");
        return false;
      }
      if (data.user) {
        user.value = data.user;
        presentToast("Login erfolgreich!", "success");
        return true;
      }
      return false;
    } catch (err) {
      presentToast("Ein unerwarteter Fehler ist aufgetreten.", "danger");
      return false;
    }
  }

  async function logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== "Auth session missing!") throw error;
      user.value = null;
      presentToast("Erfolgreich abgemeldet.", "success", 2000);
    } catch (err: any) {
      presentToast(`Fehler: ${err.message}`, "danger", 3000);
    }
  }
  return { user, isInitialized, initialize, login, logout };
});
