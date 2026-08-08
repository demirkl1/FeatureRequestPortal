// Hand-rolled i18n dictionaries. TranslationKey is a string union, and both
// dictionaries are typed as Record<TranslationKey, string> so a key missing
// from either language is a compile error (tsc catches drift between them).

export type Language = 'en' | 'tr';

export type TranslationKey =
  | 'common.cancel'
  | 'common.confirm'
  | 'common.working'
  | 'common.retry'
  | 'common.loading'
  | 'common.signIn'
  | 'nav.skipToContent'
  | 'nav.brand'
  | 'nav.primaryAriaLabel'
  | 'nav.requests'
  | 'nav.newRequest'
  | 'nav.signOut'
  | 'footer.tagline'
  | 'theme.light'
  | 'theme.dark'
  | 'theme.switchToLight'
  | 'theme.switchToDark'
  | 'language.switchToEnglish'
  | 'language.switchToTurkish'
  | 'status.pending'
  | 'status.approved'
  | 'status.rejected'
  | 'status.planned'
  | 'status.completed'
  | 'status.cancelled'
  | 'list.title'
  | 'list.subtitle.authenticated'
  | 'list.subtitle.anonymous'
  | 'list.newRequest'
  | 'list.signInToSubmit'
  | 'list.filter.status'
  | 'list.filter.allStatuses'
  | 'list.filter.sortBy'
  | 'list.sort.mostVotes'
  | 'list.sort.newest'
  | 'list.filter.pageSize'
  | 'list.toolbar.ariaLabel'
  | 'list.empty.title'
  | 'list.empty.authenticated'
  | 'list.empty.anonymous'
  | 'list.empty.action'
  | 'list.row.created'
  | 'list.row.votes'
  | 'list.error.load'
  | 'pagination.previous'
  | 'pagination.next'
  | 'pagination.pageStatus'
  | 'pagination.total'
  | 'pagination.ariaLabel'
  | 'detail.back'
  | 'detail.vote.sectionLabel'
  | 'detail.meta.created'
  | 'detail.meta.updated'
  | 'detail.meta.id'
  | 'detail.description'
  | 'detail.admin.heading'
  | 'detail.admin.status'
  | 'detail.admin.updateStatus'
  | 'detail.admin.updatingStatus'
  | 'detail.admin.deleteRequest'
  | 'detail.comments.heading'
  | 'detail.comments.none'
  | 'detail.comments.unknownUser'
  | 'detail.comments.addLabel'
  | 'detail.comments.hint'
  | 'detail.comments.required'
  | 'detail.comments.tooShort'
  | 'detail.comments.post'
  | 'detail.comments.posting'
  | 'detail.comments.signInHint'
  | 'detail.error.load'
  | 'detail.error.notFound'
  | 'detail.error.vote'
  | 'detail.error.withdraw'
  | 'detail.error.comment'
  | 'detail.error.status'
  | 'detail.error.delete'
  | 'detail.toast.voteRecorded'
  | 'detail.toast.voteWithdrawn'
  | 'detail.toast.commentAdded'
  | 'detail.toast.statusUpdated'
  | 'detail.toast.requestDeleted'
  | 'detail.delete.title'
  | 'detail.delete.description'
  | 'detail.delete.confirm'
  | 'detail.withdraw.title'
  | 'detail.withdraw.description'
  | 'detail.withdraw.confirm'
  | 'vote.label.vote'
  | 'vote.label.voted'
  | 'vote.aria.withdraw'
  | 'vote.reason.signIn'
  | 'vote.reason.voted'
  | 'create.title'
  | 'create.intro'
  | 'create.field.title'
  | 'create.field.titleHint'
  | 'create.field.titleRequired'
  | 'create.field.titleTooShort'
  | 'create.field.titlePlaceholder'
  | 'create.field.description'
  | 'create.field.descriptionHint'
  | 'create.field.descriptionPlaceholder'
  | 'create.submit'
  | 'create.submitting'
  | 'create.error.generic'
  | 'create.toast.submitted'
  | 'login.title'
  | 'login.subtitle'
  | 'login.username'
  | 'login.password'
  | 'login.error.generic'
  | 'login.submit'
  | 'login.submitting'
  | 'login.hint'
  | 'toast.dismiss';

export const en: Record<TranslationKey, string> = {
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.working': 'Working…',
  'common.retry': 'Retry',
  'common.loading': 'Loading…',
  'common.signIn': 'Sign in',

  'nav.skipToContent': 'Skip to content',
  'nav.brand': 'Feature Request Portal',
  'nav.primaryAriaLabel': 'Primary',
  'nav.requests': 'Requests',
  'nav.newRequest': 'New request',
  'nav.signOut': 'Sign out',
  'footer.tagline': 'Feature Request Portal — React, TypeScript & react-router-dom.',

  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.switchToLight': 'Switch to light theme',
  'theme.switchToDark': 'Switch to dark theme',

  'language.switchToEnglish': 'Switch to English',
  'language.switchToTurkish': 'Switch to Turkish',

  'status.pending': 'Pending',
  'status.approved': 'Approved',
  'status.rejected': 'Rejected',
  'status.planned': 'Planned',
  'status.completed': 'Completed',
  'status.cancelled': 'Cancelled',

  'list.title': 'Feature requests',
  'list.subtitle.authenticated': 'Browse, vote, and comment on requests from the community.',
  'list.subtitle.anonymous': 'Browse approved feature requests. Sign in to vote, comment, and submit new ones.',
  'list.newRequest': 'New request',
  'list.signInToSubmit': 'Sign in to submit',
  'list.filter.status': 'Status',
  'list.filter.allStatuses': 'All statuses',
  'list.filter.sortBy': 'Sort by',
  'list.sort.mostVotes': 'Most votes',
  'list.sort.newest': 'Newest',
  'list.filter.pageSize': 'Per page',
  'list.toolbar.ariaLabel': 'Filter and sort requests',
  'list.empty.title': 'No feature requests yet',
  'list.empty.authenticated': 'Be the first to submit a request for this product.',
  'list.empty.anonymous': 'Check back later, or sign in to submit the first request.',
  'list.empty.action': 'New request',
  'list.row.created': 'Created {date}',
  'list.row.votes': '{count} votes',
  'list.error.load': 'Failed to load feature requests.',

  'pagination.previous': 'Previous',
  'pagination.next': 'Next',
  'pagination.pageStatus': 'Page {page} of {totalPages}',
  'pagination.total': '{count} total',
  'pagination.ariaLabel': 'Pagination',

  'detail.back': '← Back to requests',
  'detail.vote.sectionLabel': 'Voting',
  'detail.meta.created': 'Created',
  'detail.meta.updated': 'Updated',
  'detail.meta.id': 'ID',
  'detail.description': 'Description',
  'detail.admin.heading': 'Admin controls',
  'detail.admin.status': 'Status',
  'detail.admin.updateStatus': 'Update status',
  'detail.admin.updatingStatus': 'Updating…',
  'detail.admin.deleteRequest': 'Delete request',
  'detail.comments.heading': 'Comments',
  'detail.comments.none': 'No comments yet.',
  'detail.comments.unknownUser': 'Unknown user',
  'detail.comments.addLabel': 'Add a comment',
  'detail.comments.hint': 'Minimum {min} characters required.',
  'detail.comments.required': 'Comment is required.',
  'detail.comments.tooShort': 'Comment must be at least {min} characters (currently {length}).',
  'detail.comments.post': 'Post comment',
  'detail.comments.posting': 'Posting…',
  'detail.comments.signInHint': 'Sign in to add a comment.',
  'detail.error.load': 'Failed to load this request.',
  'detail.error.notFound': 'This request could not be found.',
  'detail.error.vote': 'Unable to vote right now.',
  'detail.error.withdraw': 'Unable to withdraw your vote right now.',
  'detail.error.comment': 'Unable to add comment.',
  'detail.error.status': 'Unable to update status.',
  'detail.error.delete': 'Unable to delete this request.',
  'detail.toast.voteRecorded': 'Vote recorded.',
  'detail.toast.voteWithdrawn': 'Vote withdrawn.',
  'detail.toast.commentAdded': 'Comment added.',
  'detail.toast.statusUpdated': 'Status updated.',
  'detail.toast.requestDeleted': 'Request deleted.',
  'detail.delete.title': 'Delete this request?',
  'detail.delete.description':
    'This soft-deletes the request and removes it from all listings. Only an administrator can restore it.',
  'detail.delete.confirm': 'Delete',
  'detail.withdraw.title': 'Withdraw vote',
  'detail.withdraw.description': 'Are you sure you want to withdraw your vote?',
  'detail.withdraw.confirm': 'Withdraw',

  'vote.label.vote': 'Vote',
  'vote.label.voted': 'Voted',
  'vote.aria.withdraw': 'Withdraw vote',
  'vote.reason.signIn': 'Sign in to vote on this request.',
  'vote.reason.voted': 'You have already voted for this feature request.',

  'create.title': 'New feature request',
  'create.intro':
    'Describe the feature you would like to see. Your request starts in the Pending state until an administrator reviews it.',
  'create.field.title': 'Title',
  'create.field.titleHint': 'Between {min} and {max} characters.',
  'create.field.titleRequired': 'Title is required.',
  'create.field.titleTooShort': 'Title must be at least {min} characters (currently {length}).',
  'create.field.titlePlaceholder': 'e.g. Add dark mode to the dashboard',
  'create.field.description': 'Description',
  'create.field.descriptionHint': 'Optional. Up to {max} characters.',
  'create.field.descriptionPlaceholder': 'Explain the problem this feature solves and how it should work…',
  'create.submit': 'Submit request',
  'create.submitting': 'Submitting…',
  'create.error.generic': 'Something went wrong. Please try again.',
  'create.toast.submitted': 'Request submitted. It is now pending review.',

  'login.title': 'Sign in',
  'login.subtitle': 'Access your account to vote, comment, and submit requests.',
  'login.username': 'Username',
  'login.password': 'Password',
  'login.error.generic': 'Unable to sign in. Please try again.',
  'login.submit': 'Sign in',
  'login.submitting': 'Signing in…',
  'login.hint': 'Seeded admin account:',

  'toast.dismiss': 'Dismiss notification',
};

export const tr: Record<TranslationKey, string> = {
  'common.cancel': 'İptal',
  'common.confirm': 'Onayla',
  'common.working': 'İşleniyor…',
  'common.retry': 'Tekrar dene',
  'common.loading': 'Yükleniyor…',
  'common.signIn': 'Giriş yap',

  'nav.skipToContent': 'İçeriğe geç',
  'nav.brand': 'Feature Request Portal',
  'nav.primaryAriaLabel': 'Birincil',
  'nav.requests': 'Talepler',
  'nav.newRequest': 'Yeni talep',
  'nav.signOut': 'Çıkış yap',
  'footer.tagline': 'Feature Request Portal — React, TypeScript ve react-router-dom.',

  'theme.light': 'Açık',
  'theme.dark': 'Koyu',
  'theme.switchToLight': 'Açık temaya geç',
  'theme.switchToDark': 'Koyu temaya geç',

  'language.switchToEnglish': 'İngilizceye geç',
  'language.switchToTurkish': 'Türkçeye geç',

  'status.pending': 'Beklemede',
  'status.approved': 'Onaylandı',
  'status.rejected': 'Reddedildi',
  'status.planned': 'Planlandı',
  'status.completed': 'Tamamlandı',
  'status.cancelled': 'İptal edildi',

  'list.title': 'Özellik talepleri',
  'list.subtitle.authenticated': 'Topluluğun taleplerine göz atın, oy verin ve yorum yapın.',
  'list.subtitle.anonymous':
    'Onaylanmış özellik taleplerine göz atın. Oy vermek, yorum yapmak ve yeni talep göndermek için giriş yapın.',
  'list.newRequest': 'Yeni talep',
  'list.signInToSubmit': 'Göndermek için giriş yapın',
  'list.filter.status': 'Durum',
  'list.filter.allStatuses': 'Tüm durumlar',
  'list.filter.sortBy': 'Sıralama',
  'list.sort.mostVotes': 'En çok oy',
  'list.sort.newest': 'En yeni',
  'list.filter.pageSize': 'Sayfa başına',
  'list.toolbar.ariaLabel': 'Talepleri filtrele ve sırala',
  'list.empty.title': 'Henüz özellik talebi yok',
  'list.empty.authenticated': 'Bu ürün için ilk talebi siz gönderin.',
  'list.empty.anonymous': 'Daha sonra tekrar kontrol edin veya ilk talebi göndermek için giriş yapın.',
  'list.empty.action': 'Yeni talep',
  'list.row.created': 'Oluşturuldu: {date}',
  'list.row.votes': '{count} oy',
  'list.error.load': 'Özellik talepleri yüklenemedi.',

  'pagination.previous': 'Önceki',
  'pagination.next': 'Sonraki',
  'pagination.pageStatus': 'Sayfa {page} / {totalPages}',
  'pagination.total': '{count} toplam',
  'pagination.ariaLabel': 'Sayfalama',

  'detail.back': '← Taleplere dön',
  'detail.vote.sectionLabel': 'Oylama',
  'detail.meta.created': 'Oluşturuldu',
  'detail.meta.updated': 'Güncellendi',
  'detail.meta.id': 'Kimlik',
  'detail.description': 'Açıklama',
  'detail.admin.heading': 'Yönetici kontrolleri',
  'detail.admin.status': 'Durum',
  'detail.admin.updateStatus': 'Durumu güncelle',
  'detail.admin.updatingStatus': 'Güncelleniyor…',
  'detail.admin.deleteRequest': 'Talebi sil',
  'detail.comments.heading': 'Yorumlar',
  'detail.comments.none': 'Henüz yorum yok.',
  'detail.comments.unknownUser': 'Bilinmeyen kullanıcı',
  'detail.comments.addLabel': 'Yorum ekle',
  'detail.comments.hint': 'En az {min} karakter gerekli.',
  'detail.comments.required': 'Yorum gereklidir.',
  'detail.comments.tooShort': 'Yorum en az {min} karakter olmalıdır (şu anda {length}).',
  'detail.comments.post': 'Yorumu gönder',
  'detail.comments.posting': 'Gönderiliyor…',
  'detail.comments.signInHint': 'Yorum eklemek için giriş yapın.',
  'detail.error.load': 'Bu talep yüklenemedi.',
  'detail.error.notFound': 'Bu talep bulunamadı.',
  'detail.error.vote': 'Şu anda oy verilemiyor.',
  'detail.error.withdraw': 'Oyunuz şu anda geri çekilemiyor.',
  'detail.error.comment': 'Yorum eklenemedi.',
  'detail.error.status': 'Durum güncellenemedi.',
  'detail.error.delete': 'Bu talep silinemedi.',
  'detail.toast.voteRecorded': 'Oy kaydedildi.',
  'detail.toast.voteWithdrawn': 'Oy geri çekildi.',
  'detail.toast.commentAdded': 'Yorum eklendi.',
  'detail.toast.statusUpdated': 'Durum güncellendi.',
  'detail.toast.requestDeleted': 'Talep silindi.',
  'detail.delete.title': 'Bu talep silinsin mi?',
  'detail.delete.description':
    'Bu işlem talebi yumuşak şekilde siler ve tüm listelerden kaldırır. Yalnızca bir yönetici geri yükleyebilir.',
  'detail.delete.confirm': 'Sil',
  'detail.withdraw.title': 'Oyu geri çek',
  'detail.withdraw.description': 'Oyunuzu geri çekmek istediğinize emin misiniz?',
  'detail.withdraw.confirm': 'Geri çek',

  'vote.label.vote': 'Oy ver',
  'vote.label.voted': 'Oy verdiniz',
  'vote.aria.withdraw': 'Oyu geri çek',
  'vote.reason.signIn': 'Bu talebe oy vermek için giriş yapın.',
  'vote.reason.voted': 'Bu özellik talebine zaten oy verdiniz.',

  'create.title': 'Yeni özellik talebi',
  'create.intro':
    'Görmek istediğiniz özelliği açıklayın. Talebiniz, bir yönetici inceleyene kadar Beklemede durumunda başlar.',
  'create.field.title': 'Başlık',
  'create.field.titleHint': '{min} ile {max} karakter arasında.',
  'create.field.titleRequired': 'Başlık gereklidir.',
  'create.field.titleTooShort': 'Başlık en az {min} karakter olmalıdır (şu anda {length}).',
  'create.field.titlePlaceholder': 'örn. Panele karanlık mod ekle',
  'create.field.description': 'Açıklama',
  'create.field.descriptionHint': 'İsteğe bağlı. En fazla {max} karakter.',
  'create.field.descriptionPlaceholder': 'Bu özelliğin hangi sorunu çözdüğünü ve nasıl çalışması gerektiğini açıklayın…',
  'create.submit': 'Talebi gönder',
  'create.submitting': 'Gönderiliyor…',
  'create.error.generic': 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
  'create.toast.submitted': 'Talep gönderildi. Şu anda inceleme bekliyor.',

  'login.title': 'Giriş yap',
  'login.subtitle': 'Oy vermek, yorum yapmak ve talep göndermek için hesabınıza erişin.',
  'login.username': 'Kullanıcı adı',
  'login.password': 'Parola',
  'login.error.generic': 'Giriş yapılamadı. Lütfen tekrar deneyin.',
  'login.submit': 'Giriş yap',
  'login.submitting': 'Giriş yapılıyor…',
  'login.hint': 'Hazır yönetici hesabı:',

  'toast.dismiss': 'Bildirimi kapat',
};

export const translations: Record<Language, Record<TranslationKey, string>> = { en, tr };
