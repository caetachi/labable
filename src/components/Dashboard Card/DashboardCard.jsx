import './dashboard-card.css';

function DashboardCard({ iconClass, title, value, subTitle }) {
    return (
        <div className="dashboard-card">  
            <div className="info">
                <h4>{title}</h4>
                <h2>Php {value}</h2>
                <p>{subTitle}</p>
            </div>
            <div className="icon">
                <i className={iconClass}></i>
            </div>
        </div>
    );
}

export default DashboardCard;