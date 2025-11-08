import './service-type.css'
export default function ServiceType(service) {
    

    return(
        <div className="create-service-type-card gray-border">
            <i className={`ti ti-${service.icon} create-service-type-icon`}></i>
            <p className='create-service-type-name'>{service.name}</p>
        </div>
    )
}