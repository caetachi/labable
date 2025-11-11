import "./about-us.css";
import Bacang from '../../assets/team_bacang.jpg';
import Flores from '../../assets/team_flores.jpg';
import Pavia from '../../assets/team_pavia.jpg';
import Santiago from '../../assets/team_santiago.jpg';
import Valdez from '../../assets/team_valdez.jpg';
import TeamCard from "../../components/Team Card - About Us/TeamCard";
import ValueCard from "../../components/Value Card - About Us/ValueCard";

export default function AboutUs() {
  return (
    <>
      <div className="about-us-container">
        <div className="hero">
          <div className="hero-text-content">
            <h1>
              Transforming the laundry experience with innovative technology and
              exceptional service.
            </h1>
          </div>
        </div>

        <div className="about-us">
          <h2>Our Story</h2>

          <span className="about-us-desc">
            Labable was started as an idea for a project to automate and solve
            real world problem. The foundation came from the idea of having an
            automated system for students who struggles to balance their
            personal life chores and school activities. The main target of this
            was the students of Bulacan State University who temporarily resides
            on dormnitories, apartment and boarding houses. But in general, all
            people can use this, whether you're a busy professional, a growing
            family, or a business owner running a laundry service, you deserve
            tools that make your life easier.
            <br />
            <br />
            Our platform streamlines every aspect of the laundry process from
            scheduling pick-ups to tracking orders and managing deliveries.
            Labable fulfills the gap between customers and laundry shops with
            care and trust.
          </span>
        </div>

        <div className="values">
          <h2>Our Values</h2>

          <div className="values-container">
            <ValueCard
              iconClass="ti ti-target"
              title="Revolutionize"
              description="To revolutionize laundry services with smart, efficient, and user-friendly management solutions that save time and deliver exceptional results."
              extraClass="value-revolutionize"
            />
            <ValueCard
              iconClass="ti ti-user-filled"
              title="User-centric"
              description="We put you at the heart of everything we do, ensuring satisfaction through quality service and transparent communication."
              extraClass="value-user"
            />
            <ValueCard
              iconClass="ti ti-carambola-filled"
              title="Highest Quality"
              description="We maintain the highest standards in garment care, using premium products and advanced techniques for optimal results."
              extraClass="value-quality"
            />
            <ValueCard
              iconClass="ti ti-heart-filled"
              title="Utmost Care"
              description="Your clothes are precious to us. We handle every item with care and build lasting relationships based on trust."
              extraClass="value-care"
            />
          </div>
        </div>

        <div className="team">
            <h2>Meet the Team</h2>
            <p className="desc">
              The minds behind the idea of <b>Labable</b> and how it has been brought to life.
            </p>

            <div className="team-container">
              <TeamCard 
                imageSrc={Bacang}
                name="Bacang, John Raizel"
                role="Developer"
                facebookUrl="https://www.facebook.com/raixeru"
                githubUrl="https://github.com/sin-raixel"
              />

              <TeamCard 
                imageSrc={Flores}
                name="Flores, Janver"
                role="Developer"
                facebookUrl="https://www.facebook.com/flrsver"
                githubUrl="https://github.com/caetachi"
              />
              <TeamCard 
                imageSrc={Pavia}
                name="Pavia, Marc Justin"
                role="Developer"
                facebookUrl="https://www.facebook.com/marcjustin.pavia"
                githubUrl="https://github.com/Jusen1"     
              />
              <TeamCard 
                imageSrc={Santiago}     
                name="Santiago, Jan Rei"
                role="Developer"
                facebookUrl="https://www.facebook.com/jear8008569"
                githubUrl="https://github.com/DaddyJiAr"
              />
              <TeamCard 
                imageSrc={Valdez}     
                name="Valdez, Jerson Patrick"
                role="Developer"
                facebookUrl="https://www.facebook.com/valdez.jerson.5"
                githubUrl="https://github.com/Jerson-Valdez"
              />
            </div>
        </div>
      </div>
    </>
  );
}
