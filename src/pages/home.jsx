import { Dashboard } from "../components/ui/dashboard"
import MapComponent from "../components/floodMap"
export const Home = (() => {
    return (
        <div>
            <Dashboard screenTitle="Flood Visualizer">
                <MapComponent></MapComponent>
            </Dashboard>
        </div>
    )
})