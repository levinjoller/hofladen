import { ref } from 'vue'

/**
 * Composable zur Anzeige von Ionic Toast-Nachrichten.
 * Bietet eine einfache Funktion 'presentToast' zum Anzeigen von Benachrichtigungen.
 * Hinweis: Die Komponente <IonToast> muss im Template verwendet werden.
 */
export function useToast() {
    const showToast = ref(false)
    const toastMessage = ref('')
    const toastColor = ref<'success' | 'danger' | 'warning' | 'primary' | string>('primary')
    const toastDuration = ref(3000)

    /**
     * Zeigt eine Toast-Nachricht an.
     * @param message Die anzuzeigende Nachricht.
     * @param color Die Farbe des Toasts (z.B. 'success', 'danger', 'warning', 'primary').
     * @param duration Die Dauer, für die der Toast sichtbar ist (in ms). Standard: 3000ms.
     */
    const presentToast = (
        message: string,
        color: 'success' | 'danger' | 'warning' | 'primary' | string = 'primary',
        duration = 3000
    ) => {
        toastMessage.value = message
        toastColor.value = color
        toastDuration.value = duration
        showToast.value = true
    }

    // Das Composable gibt die Funktion 'presentToast' und die Toast-States zurück,
    // die in den Komponenten verwendet werden können.
    return { presentToast, showToast, toastMessage, toastColor, toastDuration }
}
