import { Suspense, useState }from 'react'
import AdminSideBar from "../../components/AdminSideBar"
import ErrorBoundary from "../../components/ErrorBoundary"
import LoadingSpinner from "../../components/LoadingSpinner"
import NotificationBell from '../../components/NotificationBell'
import AdminPaymentDashboard from '../../components/AdminPaymentDashboard'

const Payment = () => {
  const [isOpen, setIsOpen] = useState(false);  
    
  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900 overflow-hidden">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </Suspense>
      </ErrorBoundary>
      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-h-screen ${
          isOpen ? 'md:overflow-hidden overflow-hidden' : ''
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-base-content dark:text-white">
            Payment Session
          </h1>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationBell />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPaymentDashboard/>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default Payment
