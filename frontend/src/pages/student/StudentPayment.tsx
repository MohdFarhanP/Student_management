import { Suspense } from "react"
import ErrorBoundary from "../../components/ErrorBoundary"
import StudentSidebar from "../../components/StudentSidebar"
import NotificationBell from "../../components/NotificationBell"
import StudentPaymentDashboard from "../../components/StudentPaymentDashboard"

const StudentPayment = () => {
  return (
    <div className="flex min-h-screen bg-base-100 dark:bg-gray-900">
      <ErrorBoundary>
        <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
          <StudentSidebar />
        </Suspense>
      </ErrorBoundary>
      <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-base-content dark:text-white mb-6">
            My Payment Dashboard
          </h1>
          <Suspense fallback={<div className="p-2">Loading...</div>}>
            <NotificationBell />
          </Suspense>
        </div>
        <div>
          <ErrorBoundary>
            <Suspense>
              <StudentPaymentDashboard/>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default StudentPayment
