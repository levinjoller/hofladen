import { ref } from 'vue'

export const showToast = ref(false)
export const toastMessage = ref('')
export const toastColor = ref<'success' | 'danger' | 'warning' | 'primary' | string>('primary')
export const toastDuration = ref(3000)

/**
 * Zeigt eine Toast-Nachricht an.
 * @param message Die anzuzeigende Nachricht.
 * @param color Die Farbe des Toasts (z.B. 'success', 'danger', 'warning', 'primary'). Standard: 'primary'.
 * @param duration Die Dauer, für die der Toast sichtbar ist (in ms). Standard: 3000ms.
 */
export const presentToast = (
    message: string,
    color: 'success' | 'danger' | 'warning' | 'primary' | string = 'primary',
    duration = 3000
) => {
    toastMessage.value = message
    toastColor.value = color
    toastDuration.value = duration
    showToast.value = true
}

/**
 * Composable zur Anzeige von Ionic Toast-Nachrichten.
 * Bietet eine einfache Funktion 'presentToast' zum Anzeigen von Benachrichtigungen.
 * Hinweis: Die Komponente <IonToast> muss im Template verwendet werden.
 *
 * Diese Version ist hauptsächlich für die Verwendung in Vue-Komponenten gedacht,
 * die reaktive Bindungen zum Toast-Status benötigen (z.B. das <ion-toast> Element).
 */
export function useToast() {
    return { presentToast, showToast, toastMessage, toastColor, toastDuration }
}