import './notification.css'

export default function Notification({title, message, createdAt, clear}) {
    return (
        <div className="notification-card">
            <div className="notification-content">
                <span className="notification-header">
                    <p className="notification-title">{title}</p>
                    <p className="notification-date">{createdAt}</p>
                </span>
                <p className="notification-message">{message}</p>
            </div>

            <button className="notification-clear-btn" onClick={clear}>
                <i className="fa-regular fa-bell-slash"></i>
            </button>
        </div>
    )
}