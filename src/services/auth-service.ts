import { supabase } from "@/supabase";
import { ref } from "vue";
import { presentToast } from "@/services/toast-service";
import { User } from "@supabase/supabase-js";

export const user = ref<User | null>(null);

/**
 * Versucht, einen Benutzer mit E-Mail und Passwort anzumelden.
 * Zeigt Toasts direkt aus dem Service an.
 * @param email Die E-Mail des Benutzers.
 * @param password Das Passwort des Benutzers.
 * @returns true bei Erfolg, false bei Misserfolg
 */
export async function login(email: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login-Fehler:", error.message);
      presentToast(error.message, "danger");
      return false;
    }

    if (data.user) {
      console.log("User eingeloggt:", data.user);
      user.value = data.user;
      presentToast("Login erfolgreich!", "success");
      return true;
    }

    presentToast("Login fehlgeschlagen.", "danger");
    return false;
  } catch (err: any) {
    console.error("Unerwarteter Login-Fehler:", err);
    presentToast("Ein unerwarteter Fehler ist aufgetreten.", "danger");
    return false;
  }
}

/**
 * Meldet den Benutzer ab.
 * Zeigt Toasts direkt aus dem Service an.
 */
export async function logout(): Promise<void> {
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

/**
 * Holt den aktuell eingeloggten Benutzer.
 * @returns Der eingeloggte Benutzer oder null.
 */
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  user.value = currentUser;
  return currentUser;
}
