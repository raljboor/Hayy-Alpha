import { useNavigate } from 'react-router-dom';

const ROUTES: Record<string, string> = {
  home:           '/app',
  rooms:          '/app/rooms',
  search:         '/app/search',
  liveRoom:       '/app/rooms/r1/live',
  roomDetail:     '/app/rooms/r1',
  greenRoom:      '/app/rooms/r1/green',
  recap:          '/app/rooms/r1/recap',
  hostRoom:       '/app/rooms/r1/host',
  schedule:       '/app/schedule',
  scheduled:      '/app/schedule/done',
  scheduleYours:  '/app/schedule/mine',
  publicProfile:  '/app/users/u2',
  thread:         '/app/messages/t1',
  inbox:          '/app/inbox',
  activity:       '/app/activity',
  you:            '/app/profile',
  editProfile:    '/app/profile/edit',
  follows:        '/app/profile/follows',
  settings:       '/app/settings',
  notifs:         '/app/notifications/settings',
  privacy:        '/app/privacy',
  invite:         '/app/invite',
  wins:           '/app/wins',
  updateOutcome:  '/app/wins/update',
  landed:         '/app/wins/landed',
  giveBack:       '/app/wins/give-back',
  refer:          '/app/refer',
  requestIntro:   '/app/intro',
  book:           '/app/users/u2/book',
  connections:    '/app/connections',
  help:           '/app/help',
  onboarding:     '/onboarding',
  referrals:      '/app/referrals',
  referralDetail: '/app/referrals/r1',
  saved:          '/app/saved',
  speaking:       '/app/rooms/r1/live',
  nextRoom:       '/app/rooms/r2/live',
  report:         '/app/profile',
};

export function useNav() {
  const navigate = useNavigate();
  return {
    go: (routeId: string) => {
      const path = ROUTES[routeId];
      if (path) navigate(path);
    },
    back: () => navigate(-1 as never),
  };
}
