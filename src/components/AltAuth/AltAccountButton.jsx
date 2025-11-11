import './alt-account-button.css'

async function handleGoogleSignIn(register) {
    try{
        await register();
    } catch (error) {
        localStorage.setItem("toastMessage", error.message);
        localStorage.setItem("toastType", "error");
        console.error("Google Sign-In Error:", error);
    }
}

export default function AltAccountButton({ register }) {
    return (
        <>
            <button className="auth-account alt-account-btn google" onClick={() => handleGoogleSignIn(register)}>
                <i className="ti ti-brand-google"></i>
                Google
            </button>
        </>
    )
}