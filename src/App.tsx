import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { BackgroundFX } from '@/components/layout/BackgroundFX'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))

export default function App() {
  return (
    <div className="relative min-h-screen">
      <BackgroundFX />
      <Suspense fallback={<DashboardSkeleton />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/:packageName" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}
