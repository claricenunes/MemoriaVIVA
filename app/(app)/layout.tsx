import BottomNav from '@/components/layout/bottom-nav'
import OnboardingModal from '@/components/onboarding/onboarding-modal'
import FloatingAction from '@/components/shared/floating-action'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mv-app-wrapper">
      <div className="mv-content-area">
        {children}
      </div>
      <FloatingAction variant="pill" label="Precisa de ajuda?" />
      <BottomNav />
      <OnboardingModal />
    </div>
  )
}
