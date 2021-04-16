export const config = {
  defaultLanguage: 'cs',
  editorOptions: [
    'inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'embedded', 'image', 'remove', 'history'
  ],
  languages: ['cs', 'en'],
  languageNames: {
    cs: 'Czech',
    en: 'English'
  },
  roles: ['user', 'editor', 'admin', 'superadmin'],
  statuses: ['active', 'disabled'],
  types: ['event', 'notification', 'news', 'interview'],
  typeNames: {
    // event: 'Pozvánka na akce',
    // notification: 'Upozornění',
    // news: 'Novinky',
    // interview: 'Reportáž'
    event: 'Invitation to event',
    notification: 'Notification',
    news: 'News',
    interview: 'Interview'
  }
}
