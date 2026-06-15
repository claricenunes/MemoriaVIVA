import BottomNav from '@/components/layout/bottom-nav'
import OnboardingModal from '@/components/onboarding/onboarding-modal'
import FloatingAction from '@/components/shared/floating-action'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FloatingAction variant="pill" label="Precisa de ajuda?" />
      <BottomNav />
      <OnboardingModal />
    </>
  )
}
