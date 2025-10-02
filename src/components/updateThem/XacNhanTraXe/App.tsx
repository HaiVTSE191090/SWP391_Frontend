import { useState } from 'react'
import type { Vehicle, Rental } from './types/Vehicle'
import { mockVehicles } from './data/mockData'
import { mockRentals } from './data/mockRentals'
import VehicleList from './components/VehicleList'
import VehicleReturnForm from './components/VehicleReturnForm'
import RenterDashboard from './components/RenterDashboard'
import './App.css'

type UserRole = 'staff' | 'renter'

function App() {
  const [userRole, setUserRole] = useState<UserRole>('staff')
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [rentals, setRentals] = useState<Rental[]>(mockRentals)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleVehicleReturn = (returnData: any) => {
    if (selectedVehicle) {
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === selectedVehicle.id 
            ? { 
                ...vehicle, 
                status: 'returned' as const,
                returnInfo: returnData 
              }
            : vehicle
        )
      )
      setSelectedVehicle(null)
      alert('Đã xác nhận trả xe thành công!')
    }
  }

  const handleCancelReturn = () => {
    setSelectedVehicle(null)
  }

  const handleConfirmPayment = (rentalId: string, agreed: boolean) => {
    setRentals(prev => 
      prev.map(rental => 
        rental.id === rentalId 
          ? { 
              ...rental, 
              status: agreed ? 'paid' as const : 'disputed' as const 
            }
          : rental
      )
    )
    
    if (agreed) {
      alert('Cảm ơn bạn đã xác nhận thanh toán!')
    } else {
      alert('Yêu cầu của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ để giải quyết.')
    }
  }

  return (
    <div className="app">
      {/* Role Switcher */}
      <div className="role-switcher">
        <button 
          className={`role-btn ${userRole === 'staff' ? 'active' : ''}`}
          onClick={() => setUserRole('staff')}
        >
          👨‍💼 Nhân viên (Staff)
        </button>
        <button 
          className={`role-btn ${userRole === 'renter' ? 'active' : ''}`}
          onClick={() => setUserRole('renter')}
        >
          👤 Khách hàng (Renter)
        </button>
      </div>

      {/* Staff Interface */}
      {userRole === 'staff' && (
        <>
          <VehicleList 
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
          />
          
          {selectedVehicle && (
            <VehicleReturnForm
              vehicle={selectedVehicle}
              onReturn={handleVehicleReturn}
              onCancel={handleCancelReturn}
            />
          )}
        </>
      )}

      {/* Renter Interface */}
      {userRole === 'renter' && (
        <RenterDashboard
          rentals={rentals}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  )
}

export default App
