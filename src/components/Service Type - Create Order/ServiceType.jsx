import './service-type.css'
export default function ServiceType(service) {
    

    return(
        <div className="create-service-type-card gray-border" id={service.id}>
            <img src={service.imgUrl} alt="" />
            <i className={`ti ti-${service.icon} create-service-type-icon`}></i>
            <p className='create-service-type-name'>{service.name}</p>
            <p className='create-service-type-amount'>Php {service.amount}/Kg</p>
            <p className='create-service-type-included'>{service.included.join(', ')}</p>
        </div>
    )
}