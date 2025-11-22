import { useParams, Navigate } from "react-router-dom";
import OrderManagement from "./OrderManagement";
import ScheduleManagement from "./ScheduleManagement";
import CustomerManagement from "./CustomerManagement";
import InventoryManagement from "./InventoryManagement";
import ServiceManagement from "./ServiceManagement";
import WashableManagement from "./WashableManagement";
import AIAssistant from "../../components/AI Assistant/AIAssistant";

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
            <AIAssistant pageContext="Admin Management pages – depending on the URL segment (order, schedule, customer, inventory, service, washable), this page shows a management table with filters and action icons to manage records in that category." />
        </>
    )
}