import { useParams, Navigate } from "react-router-dom";
import OrderManagement from "./OrderManagement";
import ScheduleManagement from "./ScheduleManagement";
import CustomerManagement from "./CustomerManagement";
import InventoryManagement from "./InventoryManagement";
import ServiceManagement from "./ServiceManagement";
import WashableManagement from "./WashableManagement";

export default function Management() {
    const { viewCategory } = useParams();
    
    const renderManagementComponent = () => {
        switch (viewCategory) {
            case "order":
                return <OrderManagement />;
            case "schedule":
                return <ScheduleManagement />;
            case "customer":
                return <CustomerManagement />;
            case "inventory":
                return <InventoryManagement />;
            case "service":
                return <ServiceManagement />;
            case "washable":
                return <WashableManagement />;
            default:
                return <Navigate to="/admin/dashboard" />;
        }
    };
    
    return (
        <>
            <div className="management-page-container">
                {renderManagementComponent()}
            </div>
        </>
    )
}