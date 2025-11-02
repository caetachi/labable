import './team-card.css';

function TeamCard({ imageSrc, name, role, facebookUrl, githubUrl }) {
  return (
    <div className="team-card">
      <div className="image-container">
        <img src={imageSrc} alt={`${name}'s Image`} />
      </div>
      <h2>{name}</h2>
      <p>{role}</p>
      <div className="socials-bar">
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
      </div>
    </div>
  );
}

export default TeamCard;