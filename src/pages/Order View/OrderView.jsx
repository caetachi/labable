import { useParams } from "react-router";
import titlecase from "../../scripts/titlecase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getView } from "../../scripts/get";
import TrackNode from "../../components/TrackNode/TrackNode";
import { formatTextualDateTime } from "../../scripts/dateformat";
import BigNumber from "bignumber.js";
import Swal from "sweetalert2";
import { cancelOrder } from "../../scripts/update";

const fieldGroup = [
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
	];

function DetailsCard({ data }) {
	return (
		<div className='details-card'>
			{fieldGroup.map(([label, getter]) => {
				const value = getter(data);
				if (label === "Cancel Reason" && (value == null || (typeof value === "string" && value.trim() === ""))
				) return null;
				
				return (
				<div key={label} className='detail-cell'>
					<p className='label'>{label}</p>
					<p className='value'>{value}</p>
				</div>
				);
			})}
		</div>
	);
}

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

	const cancelNotice = () => {
		Swal.fire({
			title: 'Are you sure you want to cancel this order?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'var(--error)',
			cancelButtonColor: 'var(--bg-dark)',
			confirmButtonText: 'Yes, cancel it!',
			background: 'var(--bg-light)',
			color: 'var(--fg-dark)',
			input: 'textarea',
			inputPlaceholder: 'Please enter the reason for cancellation (optional)'
		}).then(async (result) => {
			if (result.isConfirmed) {
				const reason = result.value || 'No reason provided';
				try {
					await cancelOrder(viewId, "Canceled", reason);
					Swal.fire({
						title: 'Order Canceled',
						text: 'Your order has been successfully canceled.',
						icon: 'success',
						background: 'var(--bg-light)',
						color: 'var(--fg-dark)',
						showConfirmButton: false,
						timer: 1500
					})
				} catch (err) {
					Swal.fire({
						title: 'Failed to cancel order',
						text: 'An error occurred while canceling your order. Please try again later.',
						icon: 'error',
						background: 'var(--bg-light)',
						color: 'var(--fg-dark)',
						showConfirmButton: true
					})
				}
				window.location.reload();
			}
		});
	}

	const ActionButtons = ({ category, status }) => {
		const base = <button className='edit-btn'>Edit</button>;
		const actions =
			{
				order:
					status === "Out for delivery" ?
						[
							["Order Received", "accept-btn"],
						]
						: 
					status === "Pending" ?
						[
							["Cancel Order", "cancel-btn", { onClick: () => cancelNotice() }],
						]
						:
					status === "Received" ?
						[
							["Rate", "rate-btn"],
							["Order Again", "order-again-btn"],
						] 
						:
					status ===  "Accepted" ?
						[
							["Processing Order", "processing-btn"]
						]
						:
					status === "Canceled" ?
						[
							["You have canceled this order", "canceled-btn"]
						] 
						:
					status === "Rejected" ?
						[
							["Your order was rejected", "rejected-btn"]
						]
						:
						[]
			}[category] || [];

		return (
			<div className='btn-container'>
				{status === "Pending" && base}
				{actions.map(([txt, cls, props]) => (
					<button key={cls} className={cls} {...props} disabled={["Accepted", "Canceled", "Rejected"].includes(status)}>
						{txt}
					</button>
				))}
			</div>
		);
	};

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
								{Object.values(viewData.tracking || {}).map((t, i) => (
									<TrackNode
										key={i + t.timestamp}
										label={t.label}
										value={t.message}
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
