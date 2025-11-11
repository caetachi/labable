export default function TrackNode({key, label, value, date}) {
    return <div className='detail-track' key={key}>
            <div className='visual'>
                <div className='connector connector-lead' />
                <i className='ti ti-clock' />
                <div className='connector connector-trail' />
            </div>
            <div className='content'>
                <p className='title'>{label}</p>
                <span className='desc'>
                    <p className='value'>{value}</p>
                    <p className='date'>{date}</p>
                </span>
            </div>
        </div>
};
