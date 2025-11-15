import { Navigate, useNavigate, useParams } from "react-router";
import titlecase from "../../scripts/titlecase";
import mapquery from "../../scripts/mapquery";
import "./management-view.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import BigNumber from "bignumber.js";
import { getUser, getView } from "../../scripts/get";
import { formatTextualDate, formatTextualDateTime } from "../../scripts/dateformat";
import TrackNode from "../../components/TrackNode/TrackNode";
import swal from 'sweetalert2';
import { deleteInventory, deleteService, deleteUser, deleteWashable } from '../../scripts/delete';
import { acceptOrder, rejectOrder, updateInventoryItemStock } from '../../scripts/update'

const fieldGroups = {
	order: [
		["Order ID", (v) => v.order_id],
		["Order Date", (v) => formatTextualDate(v.created_at)],
		["Address", (v) => v.address ? v.address : "N/A"],
		["Mode of Transfer", (v) => v.mode_of_transfer],
		["Service Type", (v) => v.service_name],
		["Mode of Claim", (v) => v.mode_of_claiming],
		["Payment Method", (v) => v.payment ? v.payment.payment_method : "N/A"],
		["Transfer Date", (v) => formatTextualDate(v.transfer_date)],
		["Total Amount", (v) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(new BigNumber(v.amount).toFixed(2))],
		["No. of Items", (v) => v.order_items ? new Intl.NumberFormat('en-PH').format(Object.values(v.order_items).map(oi => oi.quantity || 1).reduce((a, b) => a + b, 0)) : ""],
		["Additional Notes", (v) => v.notes == "" ? v.notes.order_notes : "No additional notes."],
		["Current Status", (v) => v.status && titlecase(v.status)],
		["Claim Date", (v) => v.schedule ? Object.values(v.schedule)[0].scheduled_date === "Not yet specified" ? "N/A" : formatTextualDateTime(Object.values(v.schedule)[0].scheduled_date) : "N/A"],
		["Customer", (v) => v.customer_name && titlecase(`${v.customer_name}`)],
	],
	schedule: [
		["Schedule ID", (v) => v.order_id ? v.order_id : "N/A"],
		["Scheduled Date", (v) => v.scheduled_date ? formatTextualDateTime(v.scheduled_date) : "N/A"],
		["Order ID", (v) => v.order_id ? v.order_id : "N/A"],
		["Order Date", (v) => v.order_date ? formatTextualDate(v.order_date) : "N/A"],
		["Address", (v) => v.address ? v.address : "N/A"],
		["Claim Date", (v) => v.mode_of_claiming ? formatTextualDateTime(v.mode_of_claiming) : "N/A"],
		["Claim Type", (v) => v.mode_of_claiming ? titlecase(v.mode_of_claiming) : "N/A"],
		["Current Status", (v) => v.status && titlecase(v.status)],
		["Customer", (v) => v.customer_name],
	],
	inventory: [
		["Item ID", (v) => v.inventory_item_id],
		["Date Added", (v) => new Date(v.created_at).toDateString()],
		["Item Name", (v) => v.inventory_item_name],
		["Created By", (v) => v.created_by],
		["Last Restock Date", (v) => v.last_restocked],
		["Quantity", (v) => v.quantity_in_stock],
		["Unit", (v) => v.unit_name && titlecase(v.unit_name)],
		["Current Status", (v) => v.status && titlecase(v.status)],
		["Updated By", (v) => v.updated_by ? titlecase(`${v.updated_by}`) : "N/A"],
	],
	service: [
		["Service ID", (v) => v.service_type_id],
		["Date Created", (v) => new Date(v.created_at).toDateString()],
		["Service Name", (v) => v.service_name],
		["Created By", (v) => v.created_by],
		["Included Services", (v) => v.services && titlecase(`${Object.values(v.services).join(', ')}`)],
		["Date Modified", (v) => v.updated_at ? v.updated_at : "N/A"],
		["Price", (v) => `₱ ${new BigNumber(v.service_price).toFormat(2)}`],
		["Modified By", (v) => v.updated_by ? titlecase(`${v.updated_by}`) : "N/A"]
	],
	washable: [
		["Item ID", (v) => v.washable_item_id],
		["Date Created", (v) => new Date(v.created_at).toDateString()],
		["Item Name", (v) => v.washable_item_name],
		["Created By", (v) => v.created_by],
		["Date Modified", (v) => v.updated_at ? v.updated_at : "N/A"],
		["Item per Kg", (v) => v.item_per_kilo],
		["Modified By", (v) => v.updated_by ? titlecase(`${v.updated_by}`) : "N/A"]
	],
	customer: [
		["Fullname", (v) => v.fullname],
		["Email", (v) => v.email],
		["Phone no.", (v) => v.phone],
		["Status", (v) => v.status ? v.status : ""],
		["Role", (v) => v.role],
		["Address", (v) => v.address ? v.address : "No address"],

	]
};

const DetailsCard = ({ category, data }) => (
	<div className='details-card'>
		{fieldGroups[category].map(([label, getter], i) => (
			<div key={i} className='detail-cell'>
				<p className='label'>{label}</p>
				<p className='value'>{getter(data)}</p>	
			</div>
		))}
	</div>
);

const ActionButtons = ({ id, category, status, ...props }) => {
	const navigate = useNavigate();	
	const base = <button className='edit-btn' onClick={() => navigate(`/admin/${category}/${id}/edit`)}>Edit</button>;
	const actions =
		{
			order:
				status === "pending" ? 
					[
						["Reject", "reject-btn", props.rejectOrder],
						["Accept", "accept-btn", props.acceptOrder],	
					]
					:
				status === "canceled" || status === "rejected" ?
					[] :
					[
						["Cancel", "cancel-btn"],
						["Quick Update", "quick-btn"],
						["Update", "update-btn", props.editOrder],
					],
			schedule: [
				["Cancel", "cancel-btn"],
				["Delete", "delete-btn"],
			],
			inventory: [
				["Delete", "delete-btn", props.inventoryDelete],
				["Restock", "update-btn", props.inventoryRestock],
			],
			service: [
				["Delete", "delete-btn", props.serviceDelete]
			],
			washable: [
				["Delete", "delete-btn", props.washableDelete]
			],
			customer: [
				["Delete", "delete-btn", props.userDelete]
			]
		}[category] || [];

	return (
		<div className='btn-container'>
			{base}
			{actions.map(([txt, cls, onClick]) => (
				<button key={cls} className={cls} onClick={onClick}>
					{txt}
				</button>
			))}
		</div>
	);
};

const InteractiveMap = ({ address }) => {
	const [location, setLocation] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLocation(null);
		setError(null);
		mapquery(address).then(setLocation).catch(setError);
	}, [address]);

	return (
		<div className="map-container">
			{
				error ?
				<p className='map-msg error'>{error}</p> :
				!location ?
				<p className='map-msg map-load'>Locating address...</p> :
				<MapContainer center={location.coords} zoom={10} scrollWheelZoom={false}>
					<TileLayer
						attribution='&copy; <a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url={`https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${import.meta.env.VITE_JAWGIO_API}`}
					/>
					<Marker position={location.coords}>
						<Tooltip>{location.display_name}</Tooltip>
					</Marker>
				</MapContainer>
			}
		</div>
	);
};

export default function ManagementView() {
	const { viewCategory, viewId } = useParams();
	const navigate = useNavigate();	
	const [viewData, setViewData] = useState({});

	useEffect(() =>{
		getView(viewCategory, viewId).then((data) => {
			setViewData(data);
		});
	}, [viewCategory, viewId]);

	useEffect(() => {
		const card = document.querySelector(".track-card");
		if (!card) return;
		const first =
			card.firstElementChild?.firstElementChild?.firstElementChild;
		const last = card.lastElementChild?.firstElementChild?.lastElementChild;
		if (first) first.style.visibility = "hidden";
		if (last) last.style.visibility = "hidden";
	}, []);

	async function inventoryRestock(){
		swal.fire({
			title: 'Enter Quantity',
			inputLabel: 'Items to restock',
			input: 'number',
			inputValue: 1, 
			inputAttributes: {
				min: 1, 
				step: 1 
			},
			showCancelButton: true,
			confirmButtonColor: 'var(--bg-dark)',
			cancelButtonColor: 'var(--error)',
			
			confirmButtonText: 'Continue Restock'
		}).then(async (result) => {
			if (result.isConfirmed) {
				await updateInventoryItemStock(viewId, Number(viewData.quantity_in_stock) + Number(result.value)).then(()=>{
					toast.success("Inventory Item Restocked Successfully!")	
					}).catch((error)=>{
						toast.error("Error restocking inventory item: " + error.message)
					});
				}
		});
	}

	async function inventoryDelete(){
		swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--bg-dark)',
			cancelButtonColor: 'var(--error)',
			confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
			if (result.isConfirmed) {
				await deleteInventory(viewId);
				navigate('/admin/inventory');
			}
		});
	}

	async function userDelete(){
		swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--bg-dark)',
			cancelButtonColor: 'var(--error)',
			confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
			if (result.isConfirmed) {
				await deleteUser(viewId);
				navigate('/admin/customer');
			}
		});
	}

	async function orderAccept(){
		swal.fire({
			title: 'Accept this order?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: 'var(--bg-dark)',
			cancelButtonColor: 'var(--error)',
			confirmButtonText: 'Accept'
		}).then(async (result) => {
			if (result.isConfirmed) {
				await acceptOrder(viewId);
				navigate('/admin/order');
			}
		});
	}
	async function orderReject(){
		swal.fire({
			title: 'Reject this order?',
			icon: 'warning',
			input: 'text',
			inputLabel: 'Reason for rejection',
			inputPlaceholder: 'Type your reason here...',
			showCancelButton: true,
			confirmButtonColor: 'var(--error)',
			cancelButtonColor: 'var(--bg-dark)',
			confirmButtonText: 'Reject',
			inputValidator: (value) =>{
				if(!value){
					return 'Reason is required!';
				}
			}
		}).then(async (result) => {
			if (result.isConfirmed) {
				await rejectOrder(viewId, result.value);
				navigate('/admin/order');
			}
		});
	}

	async function serviceDelete(){
		swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--bg-dark)',
			cancelButtonColor: 'var(--error)',
			confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
			if (result.isConfirmed) {
				await deleteService(viewId);
				navigate('/admin/service');
			}
		});
	}

	async function washableDelete(){
		swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--bg-dark)',
			cancelButtonColor: 'var(--error)',
			confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
			if (result.isConfirmed) {
				await deleteWashable(viewId);
				navigate('/admin/washable');
			}
		});
	}

	async function orderEdit(){
		navigate(`/admin/order/${viewId}/edit`);
	}

	if (!["order", "schedule", "customer", "inventory", "service", "washable"].includes(viewCategory))
		return <Navigate to='/admin-dashboard' />;

	if(!viewData){
		return <p>Loading...</p>
	}

	return (
		<div className='management-view-container'>
			<div className='content'>
				<div className='header'>
					<div className='title'>
						<h1>{titlecase(viewCategory)} Management</h1>
						<h3 className='desc'>
							Manage{" "}
							{viewCategory === "order"
								? "customer orders"
								: viewCategory === "schedule"
								? "schedules of delivery and pick ups"
								: viewCategory === "inventory" 
								? "inventory items"
								: viewCategory === "service"
								? "services types and pricing"
								: "washable items, pricing, and number of pieces per kilo"}
						</h3>
					</div>
					<button className='return-btn' onClick={() => navigate(-1)}>Back</button>
				</div>

				<div className='details-container'>
					<h2 className='details-title'>
						{viewCategory === "inventory"
							? "Item "
							: `${titlecase(viewCategory)} `}
						details
					</h2>
					<DetailsCard category={viewCategory} data={viewData} />
					{viewCategory === "order" ? (
						<div className='track-card'>
							{Object.values(viewData.tracking || {}).map((t, i) => (
								<TrackNode
									key={i + t.timestamp}
									label={t.label}
									value={t.message}
									date={t.timestamp}
								/>
							))}
						</div>
						)
						: viewCategory === "schedule" ? (
						<InteractiveMap address={''} />
						) : null}

					<ActionButtons
						id={viewId}
						category={viewCategory}
						status={viewData.status?.toString()?.toLowerCase() ?? ""}
						inventoryDelete={inventoryDelete}
						inventoryRestock={inventoryRestock}
						acceptOrder={orderAccept}
						rejectOrder={orderReject}
						userDelete={userDelete}
						serviceDelete={serviceDelete}
						washableDelete={washableDelete}
						editOrder={orderEdit}
					/>
				</div>
			</div>
		</div>
	);
}
