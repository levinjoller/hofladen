import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "@/services/toast-service";

export const user = ref<any | null>(null);

/**
 * Versucht, einen Benutzer mit E-Mail und Passwort anzumelden.
 * Zeigt Toasts direkt aus dem Service an.
 * @param email Die E-Mail des Benutzers.
 * @param password Das Passwort des Benutzers.
 * @returns Ein Promise, das 'true' bei Erfolg oder 'false' bei Misserfolg auflöst.
 */
export async function login(email: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Login error:", error.message);
      presentToast(error.message, "danger");
      return false;
    } else {
      console.log("User logged in:", data.user);
      user.value = data.user;
      presentToast("Login erfolgreich!", "success");
      return true;
    }
  } catch (err: any) {
    console.error("Unexpected login error:", err);
    presentToast("Ein unerwarteter Fehler ist aufgetreten.", "danger");
    return false;
  }
}

/**
 * Meldet den Benutzer ab.
 * Zeigt Toasts direkt aus dem Service an.
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error && error.message !== "Auth session missing!") {
      throw new Error(error.message);
    }

    user.value = null;

    presentToast("Sie wurden erfolgreich abgemeldet.", "success", 2000);
  } catch (err: any) {
    console.error("Logout-Fehler:", err.message);
    presentToast(`Fehler beim Abmelden: ${err.message}`, "danger", 3000);
  }
}

export async function getCurrentUser() {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  user.value = currentUser;
  return currentUser;
}
