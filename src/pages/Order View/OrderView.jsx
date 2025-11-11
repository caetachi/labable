import { useParams } from "react-router";
import titlecase from "../../scripts/titlecase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getView } from "../../scripts/get";
import TrackNode from "../../components/TrackNode/TrackNode";
import { formatTextualDateTime } from "../../scripts/dateformat";
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

const fieldGroup = [
		["Order ID", (v) => v.order_id],
		["Order Date", (v) => formatTextualDateTime(v.created_at)],
		["Address", (v) => v.address],
		["Mode of Transfer", (v) => v.mode_of_transfer],
		["Service Type", (v) => v.service_name],
		["Mode of Claim", (v) => v.mode_of_claiming],
		["Payment Method", (v) =>  v.payment ? v.payment.payment_method : "N/A"],
		["Transfer Date", (v) => formatTextualDateTime(v.transfer_date)],
        ["Total Amount", (v) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(new BigNumber(v.amount).toFixed(2))],
		["No. of Items", (v) => Object.keys(v.order_items).length],
		["Additional Notes", (v) => v.notes ? v.notes.order_notes : "No additional notes."],
		["Current Status", (v) => titlecase(v.status)],
		["Claim Date", (v) => v.schedule ? formatTextualDateTime(Object.values(v.schedule)[0].scheduled_date) : "N/A"],
];

const DetailsCard = ({ data }) => (
	<div className='details-card'>
		{fieldGroup.map(([label, getter], i) => (
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
                status === "out for delivery" ?
                    [
                        ["Order Received", "accept-btn"],
                    ]
                    : 
                status === "pending" ?
                    [
                        ["Cancel Order", "cancel-btn"],
                ]
                    :
                status === "received" ?
                    [
                        ["Rate", "rate-btn"],
                        ["Order Again", "order-again-btn"],
                    ] 
                    : 
                    [],
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

export default function OrderView() {
	const { viewId } = useParams();
	const [viewData, setViewData] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			if (!viewId) return;

			try {
				const data = await getView("order", viewId);
				setViewData(data);
			} catch (err) {
				console.error("Failed to fetch view data", err);
			}
		};

		fetchData();
	}, [viewId]);

	useEffect(() => {
		const card = document.querySelector(".track-card");
		if (!card) return;
		const first =
			card.firstElementChild?.firstElementChild?.firstElementChild;
		const last = card.lastElementChild?.firstElementChild?.lastElementChild;
		if (first) first.style.visibility = "hidden";
		if (last) last.style.visibility = "hidden";
	}, []);

	return (
		<div className='management-view-container'>
			<div className='content'>
				<div className='header'>
					<div className='title'>
						<h1>Order Management</h1>
						<h3 className='desc'>
							Manage your laundry orders and track progress
						</h3>
					</div>
					<button className='return-btn' onClick={(e) => navigate('/customer/dashboard')}>Back</button>
				</div>

				<div className='details-container'>
					<h2 className='details-title'>
                        My order details
					</h2>

					{viewData ? (
						<>
							<DetailsCard data={viewData} />

							<div className='track-card'>
								{Object.values(viewData.tracking || {}).map((t) => (
									<TrackNode
										key={t.timestamp}
										label={statusMap[t.status]?.label}
										value={statusMap[t.status]?.value}
										date={t.timestamp}
									/>
								))}
							</div>

							<ActionButtons
								category={'order'}
								status={viewData.status}
							/>
						</>
					) : (
						<p className='placeholder-msg'>Loading order...</p>
					)}
				</div>
			</div>
		</div>
	);
}
