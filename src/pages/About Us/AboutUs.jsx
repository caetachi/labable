import './about-us.css'

function AboutUs() {
    return <>
        <div className="container-top">
            <h1>About Labable</h1>
        </div>
        <div>
            <p className='text-top'>
                We're on a mission to transform the laundry experience with innovative technology and exceptional service.
            </p>
        </div>

        <div className="container">
            <h1>Our Story</h1>
        </div>
        <div>
            <p className='text-top-story'>
                Labable was started as an idea for a project to automate and solve real world problem. The foundation came from the idea of having an automated system for students who struggles to balance their personal life chores and school activities. The main target of this was the students of Bulacan State University who temporarily resides on dormitories, apartment and boarding houses. But in general, all people can use this, whether you're a busy professional, a growing family, or a business owner running a laundry service, you deserve tools that make your life easier.     
            </p>
        </div>
        <div>
            <p className='text-top-story'>
                We created Labable as a comprehensive laundry management system that bridges the gap between customers and service providers. Our platform streamlines every aspect of the laundry process from scheduling pickups to tracking orders and managing deliveries.
            </p>
        </div>
          <div>
            <p className='text-top-story'>
                Labable fullfills the gap between customer and laundry shop with care and trust           
            </p>
        </div>
        <div className="container">
            <h1>Our Values</h1>
        </div>
           <div>
                  <p className='text-top'>
                    The principles that guide everything we do
                    </p>
            </div>

            <div className="mission-container">
                <div className='mission-card'>
                <i class="fa-solid fa-bullseye"></i>
                    <h2>Our Mission</h2>
                    <p>To revolutionize laundry services with smart, efficient, and user-friendly management solutions that save time and deliver exceptional results.</p>
                </div>
                <div className='mission-card'>
                <i class="fa-solid fa-user-group"></i>
                    <h2>Our Mission</h2>
                    <p>We put our customers at the heart of everything we do, ensuring satisfaction through quality service and transparent communication.</p>
                </div>
                <div className='mission-card'>
                    <i class="fa-solid fa-award"></i>
                    <h2>Our Mission</h2>
                    <p>We maintain the highest standards in garment care, using premium products and advanced techniques for optimal results.</p>
                </div>
                <div className='mission-card'>
                    <i class="fa-regular fa-heart"></i>
                    <h2>Our Mission</h2>
                    <p>Your clothes are precious to us. We handle every item with care and build lasting relationships based on trust.</p>
                </div>
            </div>
    </>
}

export default AboutUs

