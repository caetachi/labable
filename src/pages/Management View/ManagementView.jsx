import { Navigate, useParams } from "react-router";
import titlecase from "../../scripts/titlecase";
import mapquery from "../../scripts/mapquery";
import "./management-view.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import BigNumber from "bignumber.js";
import { getView } from "../../scripts/get";

const fieldGroups = {
	order: [
		["Order ID", (v) => v.order_id],
		["Order Date", (v) => formatTextualDateTime(v.created_at)],
		["Address", (v) => v.address],
		["Mode of Transfer", (v) => v.mode_of_transfer],
		["Service Type", (v) => v.service_name],
		["Mode of Claim", (v) => v.mode_of_claiming],
		["Payment Method", (v) =>  v.payment?.payment_method || "N/A"],
		["Transfer Date", (v) => formatTextualDateTime(v.transfer_date)],
        ["Total Amount", (v) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(new BigNumber(v.amount).toFixed(2))],
		["No. of Items", (v) => new Intl.NumberFormat('en-PH').format(Object.values(v.order_items).map(oi => oi.quantity || 1).reduce((a, b) => a + b, 0))],
		["Additional Notes", (v) => v.notes?.order_notes || "No additional notes."],
		["Current Status", (v) => titlecase(v.status)],
		["Claim Date", (v) => v.schedule ? formatTextualDateTime(Object.values(v.schedule)[0].scheduled_date) : "N/A"],
		["Cancel Reason", (v) => v.notes?.cancel_reason || ""],
	],
	schedule: [
		["Schedule ID", (v) => v.id],
		["Scheduled Date", (v) => v.scheduleDate],
		["Order ID", (v) => v.orderId],
		["Order Date", (v) => v.orderDate],
		["Address", (v) => v.address],
		["Claim Date", (v) => v.claimDate],
		["Claim Type", (v) => v.claimType],
		["Current Status", (v) => titlecase(v.status)],
		["Customer", (v) => titlecase(`${v.customer?.firstName} ${v.customer?.lastName}`)],
	],
	inventory: [
		["Item ID", (v) => v.inventory_item_id],
		["Date Added", (v) => new Date(v.created_at).toDateString()],
		["Item Name", (v) => v.inventory_item_name],
		["Created By", (v) => titlecase(`${getUser(v.created_by)?.fullname}`)],
		["Last Restock Date", (v) => v.last_restocked],
		["Quantity", (v) => v.quantity_in_stock],
		["Unit", (v) => titlecase(v.unit_name)],
		["Current Status", (v) => titlecase(v.status)],
		["Updated By", (v) => titlecase(`${getUser(v.updated_by)?.fullname}` )],
	],
	service: [
		["Service ID", (v) => v.service_type_id],
		["Date Created", (v) => new Date(v.created_at).toDateString()],
		["Service Name", (v) => v.service_name],
		["Created By", (v) => titlecase(`${getUser(v.created_by)?.fullname}`)],
		["Included Services", (v) => titlecase(`${Object.values(v.included_services).join(', ')}`)],
		["Date Modified", (v) => new Date(v.modified_at).toDateString()],
		["Price", (v) => `₱ ${new BigNumber(v.service_price).toFormat(2)}`],
		["Modified By", (v) => titlecase(`${v.modified_by}`)]
	],
	washable: [
		["Item ID", (v) => v.washable_item_id],
		["Date Created", (v) => new Date(v.created_at).toDateString()],
		["Item Name", (v) => v.washable_item_name],
		["Created By", (v) => titlecase(`${getUser(v.created_by)?.fullname}`)],
		["Date Modified", (v) => new Date(v.modified_at).toDateString()],
		["Item per Kg", (v) => v.item_per_kilo],
		["Modified By", (v) => titlecase(`${v.modified_by}`)]
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

const ActionButtons = ({ category, status }) => {
	const base = <button className='edit-btn'>Edit</button>;
	const actions =
		{
			order:
				status === "pending" ? 
					[
							["Reject", "reject-btn"],
							["Accept", "accept-btn"],
					]
					: 
					[
							["Cancel", "cancel-btn"],
							["Update", "update-btn"],
					],
			schedule: [
				["Cancel", "cancel-btn"],
				["Delete", "delete-btn"],
			],
			inventory: [
				["Delete", "delete-btn"],
				["Restock", "update-btn"],
			],
			service: [
				["Delete", "delete-btn"]
			],
			washable: [
				["Delete", "delete-btn"]
			]
		}[category] || [];

	return (
		<div className='btn-container'>
			{base}
			{actions.map(([txt, cls]) => (
				<button key={cls} className={cls}>
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
	const { viewData, setViewData } = useState({});

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

	if (!["order", "schedule", "inventory", "service", "washable"].includes(viewCategory))
		return <Navigate to='/admin-dashboard' />;

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
					<button className='return-btn'>Back</button>
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
					) : viewCategory === "schedule" ? (
						<InteractiveMap address={viewData.address} />
					) : null}

					<ActionButtons
						category={viewCategory}
						status={viewData.status}
					/>
				</div>
			</div>
		</div>
	);
}
