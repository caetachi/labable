import "./home.css";
import Icon from "../../assets/Icon.svg";
import laundryVideo from "../../assets/laundry_process.mp4";
import helloVideo from "../../assets/hello_laundry.mp4";

export default function Home() {
  return (
    <main className="homepage-container">
      <section className="hero-section">
        <div className="content">
          <h1>Welcome</h1>
          <h2>Laundry Shop Management System</h2>
          <p>
            Labable: Smart Laundry Management System. Labable simplifies your
            laundry experience with an organized, efficient, and user-friendly
            system. Manage wash schedules, track orders, and monitor performance
            all in one place. Designed for both customers and business owners,
            Labable ensures clean clothes and smoother operations—anytime,
            anywhere.
          </p>
          <div className="hero-buttons">
            <button className="btn create-order-btn">
              Create Your Order <i className="fa-regular fa-heart"></i>
            </button>
            <button className="btn signup-btn">
              Signup now <i className="fa-regular fa-heart"></i>
            </button>
          </div>
        </div>
        <div className="hero-image">
          <video
              src={helloVideo}
              autoPlay
              loop
              playsInline
              className="w-full h-auto object-cover"
            />
        </div>
      </section>

      <section id="services" className="service-section">
        <h2>Our Services</h2>
        <p>Complete laundry care solutions htmlFor your every need</p>
        <div className="service-container">
          <div className="service-card">
            <div className="icon-container">
              <i className="ti ti-shirt"></i>
            </div>
            <h3>Dry</h3>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <i className="ti ti-ironing-2"></i>
            </div>
            <h3>Iron</h3>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <i className="ti ti-wash"></i>
            </div>
            <h3>Wash</h3>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <i className="ti ti-jacket"></i>
            </div>
            <h3>Fold</h3>
          </div>
          <div className="service-card">
            <div className="icon-container">
              <i className="ti ti-package"></i>
            </div>
            <h3>Service Package</h3>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2>How it Works</h2>
        <p>Simple, fast, and efficient laundry service in three easy steps</p>
        <div className="how-it-works-container">
          <div className="how-it-works">
            <div className="step-card">
              <div className="icon-container">
                <i className="ti ti-calendar-clock"></i>
              </div>

              <div className="detail">
                <span className="title">
                  <p className="order">01</p>
                  <p>Schedule Laundry</p>
                </span>
                <p className="desc">Choose your preferred date and time htmlFor laundry pickup</p>
              </div>
            </div>
            <div className="step-card">
              <div className="icon-container">
                <i className="ti ti-sparkles"></i>
              </div>

              <div className="detail">
                <span className="title">
                  <p className="order">02</p>
                  <p>We Process</p>
                </span>
                <p className="desc">Professional cleaning with care and attention to detail</p>
              </div>
            </div>
            <div className="step-card">
              <div className="icon-container">
                <i className="ti ti-cube-send"></i>
              </div>

              <div className="detail">
                <span className="title">
                  <p className="order">03</p>
                  <p>Fast Delivery/Pickup</p>
                </span>
                <p className="desc">
                  Get your fresh, clean clothes delivered to your doorstep or
                  pick up by you
                </p>
              </div>
            </div>
          </div>
          <div className="how-it-works-image">
            <video
              src={laundryVideo}
              autoPlay
              muted
              loop
              controls
              playsInline
              className="w-full h-auto object-cover"
              onClick={(e) => (e.target.muted = !e.target.muted)} 
            />
          </div>
        </div>
      </section>

      <section className="get-in-touch-section">
        <h2>Get In Touch</h2>
        <p>
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
        <div className="contact-container">
          <form className="contact-form">
            <div className="name">
              <div className="form-group">
                <label htmlFor="contact-first-name">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  name="contactFirstName"
                  id="contact-first-name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-last-name">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  name="contactLastName"
                  id="contact-last-name"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                name="contactEmail"
                id="contact-email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-feedback">Message</label>
              <textarea
                name="contactFeedback"
                id="contact-feedback"
                placeholder="Your feedback means a lot to us and our service"
              ></textarea>
            </div>
            <button type="submit" className="submit">
              Send Message
            </button>
          </form>
          <div className="contact-info">
            <div className="info">
              <div className="icon-container">
                <i className="ti ti-phone"></i>
              </div>

              <div className="info-group">
                <h4>Phone</h4>
                <p>+63 0909 180 5447</p>
              </div>
            </div>
            <div className="info">
              <div className="icon-container">
                <i className="ti ti-mail"></i>
              </div>

              <div className="info-group">
                <h4>Email</h4>
                <p>Jerson@gmail.com</p>
              </div>
            </div>
            <div className="info">
              <div className="icon-container">
                <i className="ti ti-map-pin"></i>
              </div>

              <div className="info-group">
                <h4>Address</h4>
                <p>Malolos Guinhawa, Bulacan.</p>
              </div>
            </div>
            <div className="business-hours">
              <h4>Business Hours</h4>

              <div className="business-hours-container">
                <p>Weekdays: 8:00am - 8:00pm</p>
                <p>Saturdays: 9:00am - 6:00pm</p>
                <p>Sundays: 10:00am - 5:00pm</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
