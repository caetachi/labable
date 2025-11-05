import './washable-item.css'
export default function WashableItem(item){
    return (
        <div className="washable-item gray-border">
            <img src={item.imgUrl} alt="" />
            <p className='washable-item-name'>{item.itemName}</p>
        </div>
    )
}