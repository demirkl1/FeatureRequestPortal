# Feature Request Portal

Kullanıcıların özellik talebi (feature request) açtığı, topluluğun bu talepleri oyladığı ve yorumladığı,
admin'lerin ise talepleri durum bazında yönettiği bir portal.

Senaryo: Bir araba firması yeni modelinde hangi özellikleri yapacağını müşterilerine soruyor.
Müşteriler talep açıyor, diğerleri oyluyor; en çok oy alan talepler hayata geçiriliyor.

**Teknolojiler:** ABP Framework 10.6 · .NET 10 · MVC / Razor Pages (LeptonX Lite) · EF Core · PostgreSQL · Mapperly · xUnit
**Ek arayüz:** React 19 · TypeScript · Vite (Razor Pages arayüzünün yanında, aynı HTTP API'yi tüketen ayrı bir SPA)

Öne çıkanlar: rol bazlı görünürlük · her kullanıcıya tek oy · e-posta doğrulamalı
ve **admin onaylı** kayıt · e-posta ile şifre sıfırlama · Türkçe/İngilizce · seçilebilir sayfa boyutu

---

## Kurulum ve çalıştırma

### Gereksinimler

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Docker (veya lokal bir PostgreSQL sunucusu)

### 1. Veritabanını başlat

```bash
docker compose up -d
```

PostgreSQL, host'ta **5433** portuna map edilir (5432 çoğu makinede lokal bir PostgreSQL tarafından
kullanıldığı için). Lokal bir PostgreSQL kullanacaksanız `src/FeatureRequestPortal.Web/appsettings.json`
ve `src/FeatureRequestPortal.DbMigrator/appsettings.json` içindeki connection string'i güncelleyin.

### 2. Şemayı oluştur ve veriyi yükle

```bash
cd src/FeatureRequestPortal.DbMigrator
dotnet run
```

Bu adım migration'ları uygular, ABP'nin varsayılan verisini (admin kullanıcısı, roller, permission'lar)
ve demo amaçlı **20 örnek özellik talebini** yükler.

> `DbMigrator` ve `Web` projeleri `appsettings.json` dosyalarını çalışma dizininden okur;
> bu yüzden komutları ilgili proje klasörünün içinden çalıştırın.

### 3. Uygulamayı çalıştır

```bash
cd src/FeatureRequestPortal.Web
dotnet run
```

Uygulama <https://localhost:44372> adresinde açılır.
İlk kez çalıştırıyorsanız sertifika uyarısı almamak için: `dotnet dev-certs https --trust`

**Varsayılan admin hesabı:** `admin` / `1q2w3E*`

### 4. (Opsiyonel) React SPA'yı çalıştır

Razor Pages arayüzünün yanına, aynı backend'i HTTP API üzerinden tüketen ayrı bir
**React + TypeScript** arayüzü eklendi. Razor tarafına dokunulmadı; ikisi yan yana çalışır.

```bash
cd src/FeatureRequestPortal.SPA
npm install
npm run dev
```

SPA <http://localhost:5173> adresinde açılır. **Backend'in ayrıca çalışıyor olması gerekir**
(adım 3), çünkü Vite dev server'ı `/api` ve `/connect` isteklerini `https://localhost:44372`
adresine proxy'ler. Proxy sayesinde tarayıcı self-signed sertifikayla hiç muhatap olmaz.

### 5. E-posta gönderimi (kayıt ve şifre sıfırlama için)

Kayıt doğrulama kodu, hesap onay bildirimi ve şifre sıfırlama linki e-posta ile gider.
**SMTP ayarlanmazsa uygulama çalışmayı sürdürür:** mailler `Logs/emails/` altına dosya olarak
yazılır ve konsola bir uyarı düşer. Böylece repoyu klonlayan biri hiçbir posta kutusu bilgisine
ihtiyaç duymadan tüm akışı deneyebilir — doğrulama kodunu ve sıfırlama linkini o dosyalardan okur.

Gerçekten göndermek için (Gmail örneği — hesapta 2FA açık olmalı ve normal parola değil
**16 haneli uygulama şifresi** gerekir):

```bash
cd src/FeatureRequestPortal.Web
dotnet user-secrets set "Settings:Abp.Mailing.Smtp.Host" "smtp.gmail.com"
dotnet user-secrets set "Settings:Abp.Mailing.Smtp.UserName" "adresiniz@gmail.com"
dotnet user-secrets set "Settings:Abp.Mailing.Smtp.Password" "uygulama-sifresi"
dotnet user-secrets set "Settings:Abp.Mailing.DefaultFromAddress" "adresiniz@gmail.com"
```

Sırlar **user secrets**'ta tutulur, repoya girmez. `appsettings.secrets.json` git tarafından
takip edildiği için oraya parola yazmayın.

### Testler

```bash
dotnet test                                    # 28 test (Domain 10, EF Core 17, Web 1)
cd src/FeatureRequestPortal.SPA && npx tsc -b   # SPA tip kontrolü
```

> `npx tsc --noEmit` bu projede **hiçbir şeyi kontrol etmez**: kökteki `tsconfig.json`
> solution-style (`files: []` + `references`), dolayısıyla sessizce başarılı olur.
> Gerçek kontrol `tsc -b`'dir, `npm run build` de onu çalıştırır.

---

## Ekran görüntüleri

### Ana sayfa — liste (anonim ziyaretçi)

Sayfalama (15 satır), oy sayısına göre sıralama ve durum filtresi. Anonim ziyaretçi yalnızca
`Approved` kayıtları görür.

![Liste sayfası](docs/screenshots/01-list-anonymous.jpg)

### Detay sayfası (anonim ziyaretçi)

Oy verme ve yorum yazma butonları giriş bağlantısına dönüşür.

![Detay sayfası - anonim](docs/screenshots/02-detail-anonymous.jpg)

### Liste — giriş yapmış kullanıcı

Giriş yapan kullanıcı tüm durumları görür (Beklemede, Reddedildi, İptal edildi...).

![Liste sayfası - giriş yapmış](docs/screenshots/03-list-authenticated.jpg)

### Detay sayfası (admin)

Oy verildiği için buton kilitlenmiş, yorum yazarı ve tarihi görünüyor; admin ek olarak
durum değiştirme ve silme yapabiliyor.

![Detay sayfası - admin](docs/screenshots/04-detail-admin.jpg)

### Yeni özellik talebi

![Yeni talep](docs/screenshots/05-create.jpg)

### Silme onayı (soft-delete)

![Silme onayı](docs/screenshots/06-delete-confirmation.jpg)

---

## Ekran görüntüleri — React SPA

Aynı backend'in React + TypeScript arayüzü. Açık/koyu tema, tasarım token'ları,
monospace teknik metadata ve erişilebilir bileşenler.

### Liste — anonim ziyaretçi (açık tema)

Anonim kullanıcı yalnızca `Approved` talepleri görür.

![SPA liste anonim](docs/screenshots-spa/01-spa-list-anonymous.jpg)

### Detay — anonim ziyaretçi

Oy butonu devre dışı, gerekçesi yazılı; yorum formu yerine giriş çağrısı var.

![SPA detay anonim](docs/screenshots-spa/02-spa-detail-anonymous.jpg)

### Giriş ekranı

![SPA giriş](docs/screenshots-spa/03-spa-login.jpg)

### Liste — admin (koyu tema)

Admin tüm statüleri görür; 6 statünün her biri ayrı rozetle gösterilir.

![SPA liste admin](docs/screenshots-spa/04-spa-list-admin-dark.jpg)

### Yeni talep

Canlı karakter sayacı ve alan bazlı doğrulama.

![SPA yeni talep](docs/screenshots-spa/05-spa-create.jpg)

### Detay — admin

Oy verilmiş durum, yorumlar, 100 karakter kuralı ve admin kontrolleri (statü + silme).

![SPA detay admin](docs/screenshots-spa/06-spa-detail-admin-dark.jpg)

### Silme onayı

Native `<dialog>` ile focus-trap'li onay.

![SPA silme onayı](docs/screenshots-spa/07-spa-delete-dialog.jpg)

### Mükerrer oy engeli

Domain'den gelen `FeatureRequestPortal:AlreadyVoted` hatası toast olarak gösterilir.

![SPA mükerrer oy](docs/screenshots-spa/08-spa-already-voted.jpg)

### Sayfa boyutu

![SPA sayfa boyutu](docs/screenshots-spa/12-spa-page-size.jpg)

### Türkçe

![SPA Türkçe](docs/screenshots-spa/11-spa-turkish.jpg)

### Mobil (380px)

![SPA mobil](docs/screenshots-spa/09-spa-mobile.jpg)

---

## Ekran görüntüleri — kayıt, doğrulama ve onay

### 1. Kayıt

![Kayıt](docs/screenshots-accounts/01-signup.jpg)

### 2. E-posta doğrulama kodu

![Doğrulama kodu](docs/screenshots-accounts/02-verify-code.jpg)

### 3. Yanlış kod reddediliyor

![Yanlış kod](docs/screenshots-accounts/03-wrong-code.jpg)

### 4. Onay bekleniyor

![Onay bekleniyor](docs/screenshots-accounts/04-pending-approval.jpg)

### 5. Admin onay kuyruğu

Yalnızca e-postasını doğrulamış hesaplar listelenir.

![Admin kuyruğu](docs/screenshots-accounts/05-admin-queue.jpg)

### 6. Onay teyidi

![Onay teyidi](docs/screenshots-accounts/06-approve-confirm.jpg)

### 7. Şifre sıfırlama

E-postadaki linkle ulaşılan sayfa.

![Şifre sıfırlama](docs/screenshots-accounts/07-reset-password.jpg)

## Mimari

Proje ABP'nin katmanlı (DDD) yapısını kullanır:

| Katman | İçerik |
|---|---|
| `Domain.Shared` | `FeatureRequestStatus` enum'ı, `FeatureRequestConsts` (uzunluk limitleri), hata kodları, localization |
| `Domain` | `FeatureRequest` aggregate root'u, `Vote` ve `Comment` child entity'leri, `IFeatureRequestRepository`, seed |
| `EntityFrameworkCore` | DbContext mapping'leri, `EfCoreFeatureRequestRepository`, migration'lar |
| `Application.Contracts` | DTO'lar, `IFeatureRequestAppService`, permission tanımları |
| `Application` | `FeatureRequestAppService`, Mapperly mapper'ları |
| `Web` | Razor Pages (liste / detay / oluşturma / kayıt / onay), menü, auto API controller'lar, CORS, e-posta gönderimi |
| `SPA` | React + TypeScript arayüz (ABP katmanı değil; ayrı bir Vite projesi) |

### Kayıt, e-posta doğrulama ve admin onayı

ABP'nin hazır kayıt sayfası kullanıcıyı kayıt olur olmaz **içeri alıyor**. Şartname onay
gerektirdiği için o sayfa kapatıldı (`Abp.Account.IsSelfRegistrationEnabled = false`) ve akış
`Pages/Accounts/` altında yeniden yazıldı. Bir hesap iki kapıdan geçmeden giriş yapamaz:

```
Kayıt  →  hesap IsActive=false olarak yaratılır, 6 haneli kod e-postalanır
       →  kullanıcı kodu girer            → EmailConfirmed=true
       →  admin onay kuyruğunda görünür   → admin onaylar → IsActive=true + bilgilendirme e-postası
       →  artık giriş yapabilir
```

- **Kod nasıl üretiliyor?** ASP.NET Core Identity'nin TOTP tabanlı e-posta token sağlayıcısı ile
  (`GenerateUserTokenAsync` / `VerifyUserTokenAsync`). Kodun süresi kendi içinde taşındığı için
  yanına ayrı bir tablo, entity ya da migration eklemek gerekmedi.
- **Girişi ne engelliyor?** `IsActive = false`. ABP'nin sign-in manager'ı bu bayrağı zaten kontrol
  ediyor, yani engel tek bir yerde ve UI'dan bağımsız.
- **Kuyrukta kim var?** Yalnızca `EmailConfirmed && !IsActive` olanlar. E-postasını doğrulamamış
  bir kayıt henüz bir başvuru sayılmadığı için admin'in önüne hiç düşmüyor.
- **Reddetme** hesabı siler, ama yalnızca hâlâ pasifse — aktif bir hesap bir reddet tıklamasıyla
  silinemez.
- Yetki: `FeatureRequestPortal.Users.Approve`.

### E-posta gönderimi

`ISmtpEmailSenderConfiguration` değiştirildi. Sebebi: ABP, SMTP parolasını **şifreli saklanmış**
varsayıp okurken çözmeye çalışıyor; bizimki user secrets'ta düz metin olduğu için çözme işlemi onu
bozardı. `GetPasswordAsync` virtual olmadığından değeri veren sınıfın komple değiştirilmesi gerekti.
Host, port, SSL ve gönderen adresi hâlâ ABP'nin normal ayar hattından geliyor.

SMTP tanımlı değilse `FileEmailSender` devreye girer ve mailleri `Logs/emails/` altına yazar.
Sessizce yutmak yerine konsola **uyarı** düşer — hiçbir şey göndermeyen bir sender'ı production'da
fark etmek can sıkıcı olur.

### React SPA

Razor Pages arayüzü **olduğu gibi korundu**; SPA onun yerine geçmez, yanında durur ve
ABP'nin otomatik ürettiği HTTP API'yi tüketir.

```
src/FeatureRequestPortal.SPA/src/
├── api/         http.ts (fetch sarmalayıcı), auth.ts, featureRequests.ts, types.ts
├── auth/        AuthContext — oturum, currentUser, grantedPolicies
├── components/  StatusBadge, VoteButton, ConfirmDialog, Toast, alan bileşenleri…
├── pages/       ListPage, DetailPage, CreatePage, LoginPage
└── styles/      tokens.css (tasarım token'ları) + global.css
```

- **Kimlik doğrulama:** OpenIddict `password` grant (`FeatureRequestPortal_SPA` client'ı).
  Böylece giriş ekranı da SPA'nın kendi tasarımı içinde kalıyor; LeptonX login sayfasına
  yönlendirme olmuyor. 401 alındığında bir kez `refresh_token` denenip istek tekrarlanır.
- **Yetki:** `/api/abp/application-configuration` çağrısından `currentUser` ve
  `grantedPolicies` okunur; admin kontrolleri `ChangeStatus` / `Delete` policy'lerine bağlıdır.
- **Tasarım:** Tüm renk / boşluk / tipografi değerleri `tokens.css` içinde CSS custom
  property olarak tanımlıdır. Koyu tema hem `prefers-color-scheme` hem de `data-theme`
  üzerinden çalışır, kullanıcı tercihi `localStorage`'da saklanır.
- **Dil:** `src/i18n/` altında elle yazılmış küçük bir çeviri katmanı var; `en` ve `tr`
  sözlüklerinin ikisi de `Record<TranslationKey, string>` tipinde, dolayısıyla birinde eksik
  kalan anahtar **derleme hatası** olur. Tarihler `Intl.DateTimeFormat` ile dile göre biçimlenir.

### Sayfa boyutu

Kullanıcı 15 / 20 / 30 / 50 arasından seçer. Sunucu bu listeyi bir whitelist olarak uygular
(`NormalizePageSize`): listede olmayan bir `MaxResultCount` sessizce 15'e düşer. Aksi hâlde
`MaxResultCount=100000` ile liste endpoint'i tüm tabloyu döken bir uca dönüşürdü.

### Domain modeli

```
FeatureRequest (FullAuditedAggregateRoot<Guid>)   → soft-delete
├── Title (10–200, zorunlu), Description (max 2000)
├── Status (Pending, Approved, Rejected, Planned, Completed, Cancelled)
├── VoteCount (private set — yalnızca AddVote artırır)
├── Votes    → Vote    (CreationAuditedEntity<Guid>)
└── Comments → Comment (CreationAuditedEntity<Guid>, Text 100–2000)
```

### Aldığım tasarım kararları

- **`VoteCount` manuel güncellenmez.** Sadece `FeatureRequest.AddVote()` içinde artar; property `private set`
  olduğu için aggregate dışından değiştirilemez. Böylece sayaç ile `Votes` koleksiyonu asla ayrışamaz.
- **Mükerrer oy iki katmanda engellenir.** Domain'de `AddVote`, kullanıcının daha önce oy verip vermediğini
  kontrol edip `BusinessException("FeatureRequestPortal:AlreadyVoted")` fırlatır. Ek olarak `AppVotes`
  tablosunda `(FeatureRequestId, CreatorId)` üzerinde **unique index** vardır; eşzamanlı iki istek
  domain kontrolünü atlatsa bile veritabanı reddeder.
- **Uzunluk kuralları tek yerde.** `FeatureRequestConsts` hem entity doğrulamasını hem DTO'lardaki
  `[StringLength]` attribute'larını besler. Bu sabitler `Domain.Shared`'dadır, çünkü `Application.Contracts`
  projesi `Domain`'i referans alamaz.
- **Yetkilendirme.** Talep oluşturma / oy verme / yorum yapma yalnızca `[Authorize]` ister (giriş yapmış
  herkes). Durum değiştirme ve silme ise ABP permission'larıdır
  (`FeatureRequestPortal.FeatureRequests.ChangeStatus` ve `.Delete`) ve DbMigrator ilk çalıştığında admin
  rolüne otomatik atanır. Ödevde belirtildiği gibi yeni bir yetki sistemi yazılmadı, ABP'ninki kullanıldı.
- **Silme soft-delete'tir.** `FeatureRequest` bir `FullAuditedAggregateRoot` olduğu için silinen kayıt
  veritabanında `IsDeleted = true` olarak kalır ve ABP'nin data filter'ı sayesinde sorgulara girmez.
- **Sıralama ifadesi normalize edilir.** Liste sorgusu dinamik LINQ ile sıralandığı için query string'den
  gelen `Sorting` değeri doğrudan kullanılmaz; yalnızca arayüzün sunduğu iki sıralamaya
  (`CreationTime`, `VoteCount`) indirgenir.
- **Yorum sahiplerinin isimleri tek sorguda çözülür.** Detay sayfasında yorum başına ayrı kullanıcı
  sorgusu (N+1) atmak yerine `CreatorId` seti toplanıp identity modülünden tek seferde çekilir.

### Testler

| Proje | Kapsam |
|---|---|
| `Domain.Tests` | Mükerrer oy reddi, oy sayacı, başlık ve yorum uzunluk kuralları (10 test) |
| `EntityFrameworkCore.Tests` | Uygulama servisi uçtan uca: sayfalama, sıralama, durum filtresi, `Pending` olarak oluşturma, mükerrer oy, yorum doğrulaması, durum değişimi, soft-delete (15 test) |

## Varsayımlar

Ödev metninde açık olmayan noktalarda şu kararları verdim:

1. **Görünürlük:** Anonim ziyaretçi yalnızca `Approved` kayıtları görür (metinde belirtildiği gibi).
   Giriş yapmış kullanıcılar **tüm durumları** görür — böylece kendi açtıkları `Pending` talebi ve
   topluluğun bekleyen taleplerini görüp oylayabiliyorlar.
2. **Yorum minimum uzunluğu 100 karakter** olarak, metinde yazdığı gibi uygulandı. Kural
   `FeatureRequestConsts.MinCommentTextLength` sabitinden tek noktadan yönetiliyor.
3. **Ana sayfa doğrudan liste sayfasıdır** (`/`); şablonun karşılama sayfası kaldırıldı.
4. **Liste kolonları:** Ödevde istenen Başlık / Oy / Durum kolonlarına ek olarak **Oluşturulma** kolonu
   eklendi. Varsayılan sıralama oluşturulma tarihine göre olduğu için bu kolonun görünmesi sıralamayı
   anlaşılır kılıyor ve kullanıcı oy sıralamasından geri dönebiliyor.
5. **PostgreSQL portu 5433.** Geliştirme makinelerinde 5432 sıklıkla dolu olduğu için Docker Compose
   bu porta map ediyor.
6. **Statü geçişlerinde kural yok.** Admin herhangi bir statüden herhangi birine geçebiliyor;
   şartnamede geçiş kuralı tanımlı değil ve admin'in yanlışlıkla verdiği kararı geri alabilmesi
   pratikte daha değerli görünüyor. Gerekseydi `FeatureRequest.SetStatus` içine bir state machine
   konurdu.
7. **Doğrulama kodu 6 hane ve süreli.** Identity'nin TOTP tabanlı sağlayıcısı kullanıldığı için
   uzunluk bir tercih değil, sağlayıcının çıktısı; kod tekrar istenebiliyor.
8. **Onaylanmayan hesap silinmiyor, bekliyor.** Reddetme ayrı bir aksiyon ve yalnızca hâlâ pasif
   hesaplarda çalışıyor.

## Zorlandığım noktalar

- **Şablon AutoMapper değil Mapperly kullanıyor.** ABP 10.6 startup template'i `Volo.Abp.Mapperly` ile
  geliyor, dolayısıyla book-store tutorial'ındaki `CreateMap<>` yaklaşımı burada çalışmıyor. Doğru kalıbı
  bulmak birkaç deneme aldı: mapper sınıfının `[Mapper]` ile işaretlenip
  **`MapperBase<TSource, TDestination>`** sınıfından türemesi gerekiyor. `IAbpMapperlyMapper<,>` arayüzünü
  doğrudan implemente etmek derleniyor, ama çalışma zamanında `AddMapperlyObjectMapper` tarafından
  bulunmuyor ve "No object mapping was found" hatası alınıyor. Bunu ancak entegrasyon testlerini
  yazdıktan sonra fark ettim.
- **`CreatorId`'nin setter'ı `protected`.** Mükerrer oy kontrolü için oyun sahibinin kayıt anında bilinmesi
  gerekiyor, ama `CreationAuditedEntity.CreatorId` aggregate dışından atanamıyor (CS0272). Çözüm, değeri
  `Vote` entity'sinin kendi constructor'ından atamak oldu.
- **Anonim erişim ile yetkilendirmenin dengesi.** Uygulama servisi sınıf düzeyinde `[Authorize]`, liste ve
  detay metotları ise `[AllowAnonymous]`. Anonim bir kullanıcı `Approved` olmayan bir kaydın id'sini
  tahmin ederse, kaydın varlığını sızdırmamak için 403 yerine `EntityNotFoundException` dönülüyor.
- **`IHtmlLocalizer.Value` metni formatlamıyor.** Silme onayı mesajını Razor içinde
  `@L["AreYouSureToDelete", Title].Value` ile kurmuştum; ekranda `{0}` yer tutucusu ham haliyle
  görünüyordu. `IHtmlLocalizer` formatlamayı ancak render sırasında yapıyor, `.Value` kaynak metnini
  olduğu gibi döndürüyor. Mesajı `IStringLocalizer` kullanan PageModel'de kurmak sorunu çözdü.
  Bunu ancak uygulamayı tarayıcıda gerçekten çalıştırınca fark ettim; testler bu tür görünüm
  hatalarını yakalamıyor.
- **Yapılandırmanın çalışma dizinine bağlı olması.** `dotnet run --project ...` şeklinde repo kökünden
  çalıştırıldığında `appsettings.json` okunmuyor ve "ConnectionString property has not been initialized"
  hatası alınıyor; komutları proje klasörünün içinden çalıştırmak gerekiyor.
- **macOS'ta `/connect/token` isteğinin sunucuyu tamamen kilitlemesi.** SPA'yı bağlarken ilk giriş
  denemesinde istek hiç dönmedi ve ardından sunucu *bütün* isteklere cevap vermez oldu; log,
  token üretiminin ortasında kesiliyordu. `dotnet-stack` ile alınan managed stack dump kilidin yerini
  netleştirdi: thread `AppleCryptoNative_SecKeyCreateSignature` içinde bekliyordu. Sebebi, ABP'nin
  development'ta kullandığı imzalama sertifikasının macOS'ta **login Keychain**'de durması —
  JWT imzalamak Keychain onayı gerektiriyor ve GUI oturumuna bağlı olmayan bir process (arka planda
  başlatılmış `dotnet run`, CI) bu onayı hiç alamadığı için sonsuza kadar bekliyor. Development'ta
  `AddEphemeralEncryptionKey()` / `AddEphemeralSigningKey()` kullanarak anahtarları bellekte tutmak
  sorunu çözdü. Razor Pages arayüzü cookie authentication kullandığı için bu kod yoluna hiç girmiyordu;
  hata ancak SPA token endpoint'ini kullanmaya başlayınca ortaya çıktı.
- **Proxy arkasında ABP'nin antiforgery kontrolü.** SPA'dan yapılan `POST`'lar 400 dönüyordu, aynı istek
  `curl` ile 200 dönüyordu. Fark şuydu: Vite proxy'si sayesinde SPA backend ile **aynı origin**'de
  olduğu için tarayıcı ABP'nin antiforgery cookie'sini her istekte geri gönderiyor, ABP de isteği
  cookie ile doğrulanmış sayıp `RequestVerificationToken` header'ı bekliyor; `curl`'de cookie
  olmadığı için bu kontrol hiç tetiklenmiyordu. Çözüm, ABP'nin okunabilir `XSRF-TOKEN` cookie'sini
  okuyup güvenli olmayan HTTP metotlarında bu header ile geri göndermek oldu.
- **Sonradan eklenen permission mevcut veritabanına düşmüyor.** `Users.Approve` yetkisini ekleyip
  admin ile giriş yaptığımda yeni admin sayfasına erişemedim. Sebep: ABP tüm yetkileri admin rolüne
  **yalnızca o rolü ilk yarattığı anda** veriyor; sonradan tanımlanan bir permission mevcut bir
  veritabanına hiç ulaşmıyor. Sıfır veritabanında sorun görünmüyor, bu yüzden fark etmesi kolay
  değil. `AdminPermissionDataSeedContributor` ile yetkiyi idempotent şekilde vererek çözdüm —
  güncellenen veritabanlarını onarıyor, yeni kurulumları etkilemiyor.
- **`BusinessException.Message` lokalize metni taşımıyor.** Yanlış doğrulama kodunda ekranda hiçbir
  hata görünmüyordu. ABP hata kodunu mesaja ancak exception'ı HTTP cevabına çevirirken dönüştürüyor;
  bir Razor sayfasında `catch` edip `exception.Message` yazdırdığınızda elinizde kod var, cümle yok.
  Mesajı `IStringLocalizer`'dan doğrudan almak gerekti.
- **`npx tsc --noEmit` hiçbir şeyi kontrol etmiyordu.** SPA'nın kök `tsconfig.json` dosyası
  solution-style (`files: []` + `references`) olduğu için bu komut sessizce başarılı oluyor —
  sözlüğü bilerek bozduğumda bile "temiz" dedi. Gerçek kontrol `tsc -b`; `npm run build` de onu
  çalıştırıyor. Yeşil bir çıktının doğrulama anlamına gelmediğinin iyi bir örneği.

## Öğrendiklerim

- Bir aggregate root'un davranışını (oy ekleme, yorum ekleme) entity'nin içine koymanın, sayaç gibi
  türetilmiş alanları tutarlı tutmayı ne kadar kolaylaştırdığını.
- Katman referans kurallarının tasarımı nasıl yönlendirdiğini: `Application.Contracts` `Domain`'i
  göremediği için enum ve sabitlerin `Domain.Shared`'a taşınması gerekti.
- ABP permission sisteminin custom permission'ları DbMigrator ilk çalıştığında admin rolüne otomatik
  atadığını; ayrı bir yetki altyapısı yazmaya gerek olmadığını.
- Bir iş kuralını hem domain'de hem de veritabanı kısıtıyla (unique index) korumanın, yarış koşullarına
  karşı neden değerli olduğunu.
- ABP'nin DataTables entegrasyonuyla sunucu taraflı sayfalama/sıralamanın, uygulama servisindeki
  `PagedAndSortedResultRequestDto` ile ne kadar az kodla bağlandığını.

---

## ABP şablonuna dair notlar

Bu çözüm ABP'nin katmanlı startup şablonundan üretilmiştir. Şablona özgü konular
(OpenIddict sertifikası, `abp install-libs`, deployment) için
[ABP dokümantasyonuna](https://abp.io/docs/latest/solution-templates/layered-web-application) bakabilirsiniz.
