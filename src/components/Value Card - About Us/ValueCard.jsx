import './value-card.css'

function ValueCard({ iconClass, title, description, extraClass }) {
  return (
    <div className={`value-card ${extraClass}`}>
      <div className="value-title">
        <i className={iconClass}></i>
        <h2>{title}</h2>
      </div>
      <p className="value-desc">{description}</p>
    </div>
  );
}

export default ValueCard;