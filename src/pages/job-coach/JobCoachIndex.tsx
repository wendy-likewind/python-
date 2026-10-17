import { Navigate } from 'react-router-dom';
import { useJobCoach } from '@/contexts/JobCoachContext';

/** Hub: 定位 first if missing, else 机会. */
export default function JobCoachIndex() {
  const { positioning, ready } = useJobCoach();
  if (!ready) return null;
  return <Navigate to={positioning ? '/job-coach/board' : '/job-coach/gate0'} replace />;
}
