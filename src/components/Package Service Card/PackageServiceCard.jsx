import './package-service-card.css';

export default function PackageServiceCard({ image_name, title, services_included, description }) {
  return (
    <div className="package-service-card">
      <div className="image-container">
        <h4>{title}</h4>
        <img src={image_name} alt={title} />
        <p>{services_included}</p>
      </div>
      <div className="description-container">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}