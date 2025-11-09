import './alt-account-button.css'

export default function AltAccountButton({ register }) {
    return (
        <button className="auth-account alt-account-btn google" onClick={register}>
            <i className="ti ti-brand-google"></i>
            Google
        </button>
    )
}