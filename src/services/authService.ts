import { supabase } from '@/supabase';

type PresentToastFunction = (message: string, color?: 'success' | 'danger' | 'warning' | 'primary' | string, duration?: number) => void;

export async function logout(presentToast: PresentToastFunction, router: any) {

    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }

        localStorage.removeItem('user_session');

        presentToast('Erfolgreich abgemeldet!', 'success', 2000);
        router.replace('/login');

    } catch (err: any) {
        console.error('Logout-Fehler:', err.message);
        presentToast(`Fehler beim Abmelden: ${err.message}`, 'danger', 3000);
    }
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}