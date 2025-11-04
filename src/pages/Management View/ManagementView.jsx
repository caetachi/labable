import { Navigate, useParams } from "react-router";
import titlecase from "../../scripts/titlecase";
import mapquery from "../../scripts/mapquery";
import "./management-view.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import BigNumber from "bignumber.js";

const statusMap = {
	accepted: {
		label: "Order Approved",
		value: "Your order has been accepted.",
	},
	pending: {
		label: "Order Pending",
		value: "Your order is currently under approval.",
	},
	rejected: {
		label: "Order Cancelled",
		value: "Your order has been rejected.",
	},
	received: {
		label: "Received Laundry",
		value: "We have received your laundry load.",
	},
	ongoing: {
		label: "In Process",
		value: "Your laundry is now being washed and cleaned.",
	},
	done: { label: "Finished Laundry", value: "Laundry has been finished." },
	completed: {
		label: "Completed",
		value: "You have received your laundry and completed your order.",
	},
	error: {
		label: "Process Error",
		value: "Something went wrong while trying to process your order.",
	},
};

const fieldGroups = {
	order: [
		["Order ID", (v) => v.id],
		["Order Date", (v) => v.orderDate],
		["Address", (v) => v.address],
		["Mode of Transfer", (v) => v.transferType],
		["Service Type", (v) => v.service],
		["Mode of Claim", (v) => v.claimType],
		["Payment Method", (v) => v.paymentMethod],
		["Transfer Date", (v) => v.transferDate],
		["No. of Items", (v) => v.items?.length],
		["Additional Notes", (v) => v.notes],
		["Current Status", (v) => titlecase(v.status)],
		["Claim Date", (v) => v.claimDate],
		["Customer", (v) => titlecase(`${v.customer?.firstName} ${v.customer?.lastName}`)],
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
		["Item ID", (v) => v.id],
		["Date Added", (v) => v.addDate],
		["Item Name", (v) => v.name],
		["Last Restock Date", (v) => v.restockDate],
		["Quantity", (v) => v.quantity],
		["Unit", (v) => v.unit],
		["Current Status", (v) => titlecase(v.status)],
		["Updated By", (v) => titlecase(`${v.staff?.firstName} ${v.staff?.lastName}`)],
	],
	service: [
		["Service ID", (v) => v.id],
		["Date Created", (v) => v.addDate],
		["Service Name", (v) => v.name],
		["Created By", (v) => titlecase(`${v.creator?.firstName} ${v.creator?.lastName}`)],
		["Included Services", (v) => titlecase(`${v.inclusions.join(', ')}`)],
		["Date Modified", (v) => v.modifyDate],
		["Price", (v) => `₱ ${new BigNumber(v.price).toFormat(2)}`],
		["Modified By", (v) => titlecase(`${v.modifier?.firstName} ${v.modifier?.lastName}`)]
	],
	washable: [
		["Item ID", (v) => v.id],
		["Date Created", (v) => v.addDate],
		["Item Name", (v) => v.name],
		["Created By", (v) => titlecase(`${v.creator?.firstName} ${v.creator?.lastName}`)],
		["Price per Piece", (v) => `₱ ${new BigNumber(v.pricePerPiece).toFormat(2)}`],
		["Date Modified", (v) => v.modifyDate],
		["Item per Kg", (v) => v.itemPerKg],
		["Modified By", (v) => titlecase(`${v.modifier?.firstName} ${v.modifier?.lastName}`)]
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

const TrackNode = ({ label, value, date }) => (
	<div className='detail-track'>
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
);

const DetailsTrackCard = ({ tracks }) => (
	<div className='track-card'>
		{tracks.map((t) => (
			<TrackNode
				key={t.date}
				label={statusMap[t.status]?.label}
				value={statusMap[t.status]?.value}
				date={t.date}
			/>
		))}
	</div>
);

const ActionButtons = ({ category, status }) => {
	const base = <button className='edit-btn'>Edit</button>;
	const actions =
		{
			order:
				status === "pending"
					? [
							["Reject", "reject-btn"],
							["Accept", "accept-btn"],
					  ]
					: [
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

	const mockData = {
		order: {
			id: viewId,
			orderDate: "10/26/2025",
			address: "Sitio Uli-Uli, Pinalagdan, Paombong, Bulacan",
			transferType: "Pick-up",
			service: "Wash & Fold",
			claimType: "Delivery",
			paymentMethod: "Cash",
			transferDate: "10/26/2025 - 8:00 AM",
			items: Array(13).fill({}),
			notes: "palinis nang maayos",
			status: "Washing",
			claimDate: "10/26/2025 - 9:00 AM",
			customer: { firstName: "FirstName", lastName: "LastName" },
			statusHistory: [
				{ status: "pending", date: "10/20/2025 - 11:00 AM" },
				{ status: "accepted", date: "10/20/2025 - 11:05 AM" },
				{ status: "received", date: "10/20/2025 - 11:34 AM" },
				{ status: "ongoing", date: "10/20/2025 - 11:37 AM" },
				{ status: "done", date: "10/20/2025 - 12:24 PM" },
				{ status: "completed", date: "10/20/2025 - 1:22 PM" },
			],
		},
		schedule: {
			id: viewId,
			scheduleDate: "10/27/2025",
			orderId: "ORDER-123",
			orderDate: "10/26/2025",
			address: "ADFUHFAUJDHFSd",
			claimDate: "10/26/2025 - 9:00 AM",
			claimType: "Delivery",
			status: "pending",
			customer: { firstName: "FirstName", lastName: "LastName" },
		},
		inventory: {
			id: viewId,
			addDate: "10/16/2025",
			name: "Baskets",
			restockDate: "10/29/2025",
			quantity: 12,
			unit: "Pieces",
			status: "Good",
			staff: { firstName: "FirstName", lastName: "LastName" },
		},
		service: {
			id: viewId,
			addDate: "10/24/2025",
			name: "Superb Service",
			creator: {
				firstName: "Jerson",
				lastName: "Valdez"
			},
			inclusions: ["Wash", "Dry", "Fold", "Iron"],
			modifyDate: "10/24/2025",
			price: 120.00,
			modifier: {
				firstName: "Jerson",
				lastName: "Valdez"
			}
		},
		washable: {
			id: viewId,
			addDate: "10/24/2025",
			name: "Pants (Regular)",
			creator: {
				firstName: "Jerson",
				lastName: "Valdez"
			},
			pricePerPiece: 8.00,
			modifyDate: "10/24/2025",
			itemPerKg: 4,
			modifier: {
				firstName: "Jerson",
				lastName: "Valdez"
			}
		},
	};

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

	const data = mockData[viewCategory];

	return (
		<div className='management-container'>
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

					<DetailsCard category={viewCategory} data={data} />

					{viewCategory === "order" ? (
						<DetailsTrackCard
							tracks={mockData.order.statusHistory}
						/>
					) : viewCategory === "schedule" ? (
						<InteractiveMap address={data.address} />
					) : null}

					<ActionButtons
						category={viewCategory}
						status={data.status}
					/>
				</div>
			</div>
		</div>
	);
}
