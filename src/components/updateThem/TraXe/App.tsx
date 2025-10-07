import { useState } from 'react'
import RentalModal from './components/RentalModal'
import './App.css'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="app d-flex flex-column min-vh-100">
      <header className="app-header">
        <h1>🚗 TraXe - Dịch vụ thuê xe</h1>
        <p>Hệ thống quản lý thuê xe hiện đại</p>
      </header>

      <main className="d-flex align-items-center justify-content-center" style={{minHeight: 'calc(100vh - 200px)'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="status-card text-center">
                <div className="status-icon">🚙</div>
                <h2>Trạng thái thuê xe</h2>
                <p>Kiểm tra thông tin xe bạn đang thuê</p>
                
                <button className="rental-status-btn" onClick={openModal}>
                  Xe đang thuê
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <RentalModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default App
