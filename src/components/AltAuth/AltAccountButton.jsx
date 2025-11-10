import './alt-account-button.css'

async function handleGoogleSignIn(register) {
    try{
        await register();
    } catch (error) {
        localStorage.setItem("toastMessage", error.message);
        localStorage.setItem("toastType", "error");
        console.error("Google Sign-In Error:", error);
        window.location.reload();
    }
    setTimeout(()=>{
        window.location.reload();
    }, 1000)
}

async function handleGoogleLogin(login){
    try{
        await login();
    } catch (error) {
        localStorage.setItem("toastMessage", error.message);
        localStorage.setItem("toastType", "error");
        console.error("Google Login Error:", error);
    }
    setTimeout(()=>{
        window.location.reload();
    }, 1000)
}

export default function AltAccountButton({ register, login }) {
    return (
        <>
            {register &&
                <button className="auth-account alt-account-btn google" onClick={() => handleGoogleSignIn(register)}>
                    <i className="ti ti-brand-google"></i>
                    Google
                </button>
            }

            {login &&
                <button className="auth-account alt-account-btn google" onClick={() => handleGoogleLogin(login)}>
                    <i className="ti ti-brand-google"></i>
                    Google
                </button>
            }
        </>
    )
}