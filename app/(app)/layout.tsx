import BottomNav from '@/components/layout/bottom-nav'
import OnboardingModal from '@/components/onboarding/onboarding-modal'
import FloatingActionGuard from '@/components/shared/floating-action-guard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mv-app-wrapper">
      <div className="mv-content-area">
        {children}
      </div>
      <FloatingActionGuard />
      <BottomNav />
      <OnboardingModal />
    </div>
  )
}
