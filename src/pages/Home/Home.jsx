import './home.css'
import Icon from '../../assets/Icon.svg'
import HIW from '../../assets/how-it-works.svg'


export default function Home(){
    return(
        <main className='homepage-container'>
            <section className='hero-section'>
                <div className='content'>
                    <h1>Welcome</h1>
                    <h2>Laundry Shop Management System</h2>
                    <p>
                        Labable: Smart Laundry Management System. Labable simplifies your laundry experience with an organized, efficient, and user-friendly system. Manage wash schedules, track orders, and monitor performance all in one place. Designed for both customers and business owners, Labable ensures clean clothes and smoother operations—anytime, anywhere.
                    </p>
                    <div className='hero-buttons'>
                        <button className='btn create-order-btn'>Create Your Order  <i className='fa-regular fa-heart'></i></button>
                        <button className='btn signup-btn'>Signup now  <i className='fa-regular fa-heart'></i></button>
                    </div>
                </div>
                    <div className='hero-image'>
                        <img src={Icon} alt="Labable" />
                    </div>
            </section>

            <section className='service-section'>
                <h2>Our Services</h2>
                <p>Complete laundry care solutions for your every need</p>
                <div className='service-container'>
                    <div className="service-card">
                        <img src="" alt="" />
                        <h3>Dry</h3>
                    </div>
                    <div className="service-card">
                        <img src="" alt="" />
                        <h3>Iron</h3>
                    </div>
                    <div className="service-card">
                        <img src="" alt="" />
                        <h3>Wash</h3>
                    </div>
                    <div className="service-card">
                        <img src="" alt="" />
                        <h3>Fold</h3>
                    </div>
                    <div className="service-card">
                        <img src="" alt="" />
                        <h3>Service Package</h3>
                    </div>
                </div>
            </section>

            <section className='how-it-works-section'> 
                <h2>How it Works</h2>
                <p>Simple, fast, and efficient laundry service in three easy steps</p>
                <div className='how-it-works-container'>
                    <div className='how-it-works'>
                        <div className="step-card">
                            <img src="" alt="" />
                            <h3>01 Schedule Laundry</h3>
                            <p>Choose your preferred date and time for laundry pickup</p>
                        </div>
                        <div className="step-card">
                            <img src="" alt="" />
                            <h3>02 We Process</h3>
                            <p>Professional cleaning with care and attention to detail</p>
                        </div>
                        <div className="step-card">
                            <img src="" alt="" />
                            <h3>03 Fast Deliver or Pick up</h3>
                            <p>Get your fresh, clean clothes delivered to your doorstep or pick up by you</p>
                        </div>
                    </div>
                    <div className='how-it-works-image'>
                        <img src={HIW} alt="" />
                    </div>
                </div>
            </section>

            <section className='get-in-touch-section'>
                <h2>Get In Touch</h2>
                <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                <div className='contact-container'>
                    <form className='contact-form'>
                        <div className="name">
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" placeholder="First Name" id="" />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" placeholder="Last Name" id="" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="Email" id="" />
                        </div>
                        <div className="form-group">
                           <label>Message</label>
                            <textarea placeholder='Message'></textarea>
                        </div>
                        <button type='submit' className='submit'>Send Message</button>
                    </form>
                    <div className='contact-info'>
                        <div className="info">

                            <div className='info-group'>
                                <h4>Phone</h4>
                                <p>+63 0909 180 5447</p>
                            </div>
                        </div>
                        <div className="info">
                            <div className='info-group'>
                                <h4>Email</h4>
                                <p>Jerson@gmail.com</p>
                            </div>
                        </div>
                        <div className="info">
                            <div className='info-group'>
                                <h4>Address</h4>
                                <p>Malolos Guinhawa, Bulacan.</p>
                            </div>
                        </div>
                        <div className='business-hours'> 
                            <h4>Business Hours</h4>
                            <p>Monday - Friday: 8:00am-8:00pm</p>
                            <p>Saturday: 9:00am-6:00pm</p>
                            <p>Sunday: 10:00am-5:00pm</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>        
    )
}