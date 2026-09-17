import { router } from '@inertiajs/react';

export default function VerifyEmail() {
    function resendVerification() {
        router.post('/email/verification-notification');
    }

    return (
        <main>
            <h1>Verify Your Email</h1>

            <p>
                Please verify your email address to continue using LIRA.
            </p>

            <button type="button" onClick={resendVerification}>
                Resend Verification Email
            </button>
        </main>
    );
}
