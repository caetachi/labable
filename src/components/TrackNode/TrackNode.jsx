import { formatTextualDateTime } from "../../scripts/dateformat"

export default function TrackNode({label, value, date, lead=true, trail=false}) {
    return <div className='detail-track'>
            <div className='visual'>
                <div className='connector connector-lead' />
                <i className='ti ti-clock' />
                <div className='connector connector-trail' />
            </div>
            <div className='content'>
                <p className='title'>{label}</p>
                <span className='desc'>
                    <p className='value'>{value}</p>
                    <p className='date'>{formatTextualDateTime(date)}</p>
                </span>
            </div>
        </div>
};
