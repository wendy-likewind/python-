import { Navigate } from 'react-router-dom';
import { useJobCoach } from '@/contexts/JobCoachContext';

/** Hub: send users to Gate0 until定位卡 exists, else board. */
export default function JobCoachIndex() {
  const { positioning, ready } = useJobCoach();
  if (!ready) return null;
  return <Navigate to={positioning ? '/job-coach/board' : '/job-coach/gate0'} replace />;
}
