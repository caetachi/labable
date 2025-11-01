import "./about-us.css";

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
            scheduling pickups to tracking orders and managing deliveries.
            Labable fulfills the gap between customers and laundry shops with
            care and trust.
          </span>
        </div>

        <div className="values">
          <div className="values-container">
            <div className="value-card value-revolutionize">
              <div className="value-title">
                <i className="ti ti-target"></i>
                <h2>Revolutionize</h2>
              </div>

              <p className="value-desc">
                To revolutionize laundry services with smart, efficient, and
                user-friendly management solutions that save time and deliver
                exceptional results.
              </p>
            </div>

            <div className="value-card value-customer">
              <div className="value-title">
                <i className="ti ti-user-filled"></i>
                <h2>Customer-centric</h2>
              </div>

              <p className="value-desc">
                We put our customers at the heart of everything we do, ensuring
                satisfaction through quality service and transparent
                communication.
              </p>
            </div>

            <div className="value-card value-quality">
              <div className="value-title">
                <i className="ti ti-carambola-filled"></i>
                <h2>Highest Quality</h2>
              </div>

              <p className="value-desc">
                We maintain the highest standards in garment care, using premium
                products and advanced techniques for optimal results.
              </p>
            </div>

            <div className="value-card">
              <div className="value-title value-care">
                <i className="ti ti-heart-filled"></i>
                <h2>Utmost Care</h2>
              </div>

              <p className="value-desc">
                Your clothes are precious to us. We handle every item with care
                and build lasting relationships based on trust.
              </p>
            </div>
          </div>
          <h2>Values that guide us in what we do</h2>
        </div>
      </div>
    </>
  );
}
