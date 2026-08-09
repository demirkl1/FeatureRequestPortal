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
  | 'nav.registrations'
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
  | 'detail.error.comment'
  | 'detail.error.status'
  | 'detail.error.delete'
  | 'detail.toast.voteRecorded'
  | 'detail.toast.commentAdded'
  | 'detail.toast.statusUpdated'
  | 'detail.toast.requestDeleted'
  | 'detail.delete.title'
  | 'detail.delete.description'
  | 'detail.delete.confirm'
  | 'vote.label.vote'
  | 'vote.label.voted'
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
  | 'login.noAccount'
  | 'login.signUp'
  | 'signup.title'
  | 'signup.subtitle'
  | 'signup.field.username'
  | 'signup.field.usernameRequired'
  | 'signup.field.email'
  | 'signup.field.emailRequired'
  | 'signup.field.emailInvalid'
  | 'signup.field.password'
  | 'signup.field.passwordRequired'
  | 'signup.submit'
  | 'signup.submitting'
  | 'signup.error.generic'
  | 'signup.haveAccount'
  | 'verify.title'
  | 'verify.subtitle'
  | 'verify.subtitle.fallback'
  | 'verify.field.code'
  | 'verify.field.codeRequired'
  | 'verify.submit'
  | 'verify.submitting'
  | 'verify.resend'
  | 'verify.resending'
  | 'verify.toast.resent'
  | 'verify.error.generic'
  | 'verify.error.resend'
  | 'pendingApproval.title'
  | 'pendingApproval.message'
  | 'pendingApproval.backLink'
  | 'registrations.title'
  | 'registrations.subtitle'
  | 'registrations.column.username'
  | 'registrations.column.email'
  | 'registrations.column.registered'
  | 'registrations.column.actions'
  | 'registrations.approve'
  | 'registrations.reject'
  | 'registrations.empty.title'
  | 'registrations.empty.description'
  | 'registrations.error.load'
  | 'registrations.toast.approved'
  | 'registrations.toast.rejected'
  | 'registrations.toast.approveError'
  | 'registrations.toast.rejectError'
  | 'registrations.approveDialog.title'
  | 'registrations.approveDialog.description'
  | 'registrations.rejectDialog.title'
  | 'registrations.rejectDialog.description'
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
  'nav.registrations': 'Pending registrations',
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
  'detail.error.comment': 'Unable to add comment.',
  'detail.error.status': 'Unable to update status.',
  'detail.error.delete': 'Unable to delete this request.',
  'detail.toast.voteRecorded': 'Vote recorded.',
  'detail.toast.commentAdded': 'Comment added.',
  'detail.toast.statusUpdated': 'Status updated.',
  'detail.toast.requestDeleted': 'Request deleted.',
  'detail.delete.title': 'Delete this request?',
  'detail.delete.description':
    'This soft-deletes the request and removes it from all listings. Only an administrator can restore it.',
  'detail.delete.confirm': 'Delete',

  'vote.label.vote': 'Vote',
  'vote.label.voted': 'Voted',
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
  'login.noAccount': "Don't have an account?",
  'login.signUp': 'Sign up',

  'signup.title': 'Sign up',
  'signup.subtitle': 'Create an account to vote, comment, and submit feature requests.',
  'signup.field.username': 'Username',
  'signup.field.usernameRequired': 'Username is required.',
  'signup.field.email': 'Email address',
  'signup.field.emailRequired': 'Email address is required.',
  'signup.field.emailInvalid': 'Enter a valid email address.',
  'signup.field.password': 'Password',
  'signup.field.passwordRequired': 'Password is required.',
  'signup.submit': 'Create an account',
  'signup.submitting': 'Creating account…',
  'signup.error.generic': 'Something went wrong. Please try again.',
  'signup.haveAccount': 'Already have an account?',

  'verify.title': 'Verify your email',
  'verify.subtitle': 'We emailed a 6 digit code to {email}.',
  'verify.subtitle.fallback': 'We emailed a 6 digit code to your address.',
  'verify.field.code': 'Verification code',
  'verify.field.codeRequired': 'Enter the 6-digit code.',
  'verify.submit': 'Verify',
  'verify.submitting': 'Verifying…',
  'verify.resend': 'Send a new code',
  'verify.resending': 'Sending…',
  'verify.toast.resent': 'A new code has been sent.',
  'verify.error.generic': 'Unable to verify your email. Please try again.',
  'verify.error.resend': 'Unable to send a new code right now.',

  'pendingApproval.title': 'Waiting for approval',
  'pendingApproval.message':
    'Your email address is confirmed. An administrator now has to approve your registration; you will get an email as soon as that happens.',
  'pendingApproval.backLink': 'Back to the list',

  'registrations.title': 'Pending registrations',
  'registrations.subtitle': 'Review new accounts waiting for approval.',
  'registrations.column.username': 'Username',
  'registrations.column.email': 'Email address',
  'registrations.column.registered': 'Registered',
  'registrations.column.actions': 'Actions',
  'registrations.approve': 'Approve',
  'registrations.reject': 'Reject',
  'registrations.empty.title': 'There is nothing waiting for approval.',
  'registrations.empty.description': 'New sign-ups will show up here once they confirm their email.',
  'registrations.error.load': 'Failed to load pending registrations.',
  'registrations.toast.approved': '{userName} has been approved.',
  'registrations.toast.rejected': '{userName} has been rejected.',
  'registrations.toast.approveError': 'Unable to approve this account.',
  'registrations.toast.rejectError': 'Unable to reject this account.',
  'registrations.approveDialog.title': 'Approve this account?',
  'registrations.approveDialog.description': 'The user will be able to sign in once approved.',
  'registrations.rejectDialog.title': 'Reject this account?',
  'registrations.rejectDialog.description': 'This permanently deletes the account. This cannot be undone.',

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
  'nav.registrations': 'Bekleyen kayıtlar',
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
  'detail.error.comment': 'Yorum eklenemedi.',
  'detail.error.status': 'Durum güncellenemedi.',
  'detail.error.delete': 'Bu talep silinemedi.',
  'detail.toast.voteRecorded': 'Oy kaydedildi.',
  'detail.toast.commentAdded': 'Yorum eklendi.',
  'detail.toast.statusUpdated': 'Durum güncellendi.',
  'detail.toast.requestDeleted': 'Talep silindi.',
  'detail.delete.title': 'Bu talep silinsin mi?',
  'detail.delete.description':
    'Bu işlem talebi yumuşak şekilde siler ve tüm listelerden kaldırır. Yalnızca bir yönetici geri yükleyebilir.',
  'detail.delete.confirm': 'Sil',

  'vote.label.vote': 'Oy ver',
  'vote.label.voted': 'Oy verdiniz',
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
  'login.noAccount': 'Hesabınız yok mu?',
  'login.signUp': 'Kayıt ol',

  'signup.title': 'Kayıt ol',
  'signup.subtitle': 'Oy vermek, yorum yapmak ve özellik talebi göndermek için bir hesap oluşturun.',
  'signup.field.username': 'Kullanıcı adı',
  'signup.field.usernameRequired': 'Kullanıcı adı gereklidir.',
  'signup.field.email': 'E-posta adresi',
  'signup.field.emailRequired': 'E-posta adresi gereklidir.',
  'signup.field.emailInvalid': 'Geçerli bir e-posta adresi girin.',
  'signup.field.password': 'Parola',
  'signup.field.passwordRequired': 'Parola gereklidir.',
  'signup.submit': 'Hesap oluştur',
  'signup.submitting': 'Hesap oluşturuluyor…',
  'signup.error.generic': 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
  'signup.haveAccount': 'Zaten hesabınız var mı?',

  'verify.title': 'E-postanızı doğrulayın',
  'verify.subtitle': '{email} adresine 6 haneli bir kod gönderdik.',
  'verify.subtitle.fallback': 'Adresinize 6 haneli bir kod gönderdik.',
  'verify.field.code': 'Doğrulama kodu',
  'verify.field.codeRequired': '6 haneli kodu girin.',
  'verify.submit': 'Doğrula',
  'verify.submitting': 'Doğrulanıyor…',
  'verify.resend': 'Yeni kod gönder',
  'verify.resending': 'Gönderiliyor…',
  'verify.toast.resent': 'Yeni bir kod gönderildi.',
  'verify.error.generic': 'E-postanız doğrulanamadı. Lütfen tekrar deneyin.',
  'verify.error.resend': 'Şu anda yeni kod gönderilemiyor.',

  'pendingApproval.title': 'Onay bekleniyor',
  'pendingApproval.message':
    'E-posta adresiniz doğrulandı. Şimdi kaydınızın bir yönetici tarafından onaylanması gerekiyor; onaylandığında size e-posta göndereceğiz.',
  'pendingApproval.backLink': 'Listeye dön',

  'registrations.title': 'Bekleyen kayıtlar',
  'registrations.subtitle': 'Onay bekleyen yeni hesapları inceleyin.',
  'registrations.column.username': 'Kullanıcı adı',
  'registrations.column.email': 'E-posta adresi',
  'registrations.column.registered': 'Kayıt tarihi',
  'registrations.column.actions': 'İşlemler',
  'registrations.approve': 'Onayla',
  'registrations.reject': 'Reddet',
  'registrations.empty.title': 'Onay bekleyen kayıt yok.',
  'registrations.empty.description': 'Yeni kayıtlar e-postalarını doğruladıklarında burada görünecek.',
  'registrations.error.load': 'Bekleyen kayıtlar yüklenemedi.',
  'registrations.toast.approved': '{userName} onaylandı.',
  'registrations.toast.rejected': '{userName} reddedildi.',
  'registrations.toast.approveError': 'Bu hesap onaylanamadı.',
  'registrations.toast.rejectError': 'Bu hesap reddedilemedi.',
  'registrations.approveDialog.title': 'Bu hesap onaylansın mı?',
  'registrations.approveDialog.description': 'Kullanıcı onaylandıktan sonra giriş yapabilecek.',
  'registrations.rejectDialog.title': 'Bu hesap reddedilsin mi?',
  'registrations.rejectDialog.description': 'Bu işlem hesabı kalıcı olarak siler. Geri alınamaz.',

  'toast.dismiss': 'Bildirimi kapat',
};

export const translations: Record<Language, Record<TranslationKey, string>> = { en, tr };
