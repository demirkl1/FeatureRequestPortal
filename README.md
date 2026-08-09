# Feature Request Portal

Kullanıcıların özellik talebi açtığı, topluluğun oyladığı ve yorumladığı, admin'lerin ise
talepleri durum bazında yönettiği bir portal.

Senaryo: Bir araba firması yeni modelinde hangi özellikleri yapacağını müşterilerine soruyor.
Müşteriler talep açıyor, diğerleri oyluyor; en çok oy alan talepler hayata geçiriliyor.

**ABP Framework 10.6** · **.NET 10** · **MVC / Razor Pages** (LeptonX Lite) · **EF Core** ·
**PostgreSQL** · Mapperly · xUnit
Ek olarak: aynı HTTP API'yi tüketen bir **React 19 + TypeScript** arayüzü.

---

## İçindekiler

1. [Kurulum ve çalıştırma](#kurulum-ve-çalıştırma)
2. [Ekran görüntüleri](#ekran-görüntüleri)
3. [Mimari](#mimari)
4. [Varsayımlar](#varsayımlar)
5. [Zorlandığım noktalar](#zorlandığım-noktalar)
6. [Öğrendiklerim](#öğrendiklerim)

---

## Kurulum ve çalıştırma

### Gereksinimler

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- Docker (ya da lokal bir PostgreSQL sunucusu)
- Node.js **20.19+** veya **22.12+** (yalnızca opsiyonel React arayüzü için — Vite 8'in gereksinimi)

### 1. Veritabanını başlat

```bash
docker compose up -d
```

PostgreSQL host'ta **5433** portuna map edilir; 5432 çoğu geliştirme makinesinde zaten dolu oluyor.
Kendi PostgreSQL'inizi kullanacaksanız `src/FeatureRequestPortal.Web/appsettings.json` ve
`src/FeatureRequestPortal.DbMigrator/appsettings.json` içindeki connection string'i güncelleyin.

### 2. Şemayı oluştur ve veriyi yükle

```bash
cd src/FeatureRequestPortal.DbMigrator
dotnet run
```

Migration'ları uygular; ABP'nin varsayılan verisini (admin kullanıcısı, roller, permission'lar),
demo amaçlı **20 örnek talebi** ve bir normal kullanıcı hesabını yükler.

> ⚠️ `DbMigrator` ve `Web` projeleri `appsettings.json` dosyasını **çalışma dizininden** okur.
> Komutları repo kökünden değil, ilgili proje klasörünün içinden çalıştırın.

### 3. Uygulamayı çalıştır

```bash
cd src/FeatureRequestPortal.Web
dotnet run
```

<https://localhost:44372> adresinde açılır.
İlk çalıştırmada sertifika uyarısı almamak için: `dotnet dev-certs https --trust`

**Hazır hesaplar**

| Rol | Kullanıcı adı | Parola |
|---|---|---|
| Admin | `admin` | `1q2w3E*` |
| Giriş yapmış kullanıcı | `demo` | `1q2w3E*` |
| Ziyaretçi | — | giriş yapmayın |

Swagger: <https://localhost:44372/swagger>

### 4. (Opsiyonel) React arayüzünü çalıştır

```bash
cd src/FeatureRequestPortal.SPA
npm install
npm run dev
```

<http://localhost:5173> adresinde açılır. **Backend'in ayrıca çalışıyor olması gerekir** (adım 3),
çünkü Vite dev server'ı `/api` ve `/connect` isteklerini `https://localhost:44372` adresine
proxy'ler. Proxy sayesinde tarayıcı self-signed sertifikayla hiç muhatap olmaz.

### 5. (Opsiyonel) E-posta gönderimi

Kayıt doğrulama kodu, hesap onay bildirimi ve şifre sıfırlama linki e-posta ile gider.

**SMTP ayarlamazsanız uygulama çalışmaya devam eder:** mailler `Logs/emails/` klasörüne dosya
olarak yazılır ve konsola bir uyarı düşer. Böylece repoyu klonlayan biri hiçbir posta kutusu
bilgisine ihtiyaç duymadan tüm akışı deneyebilir — doğrulama kodunu o dosyadan okur.

Gerçekten göndermek için (Gmail örneği; hesapta 2FA açık olmalı ve normal parola değil
**16 haneli uygulama şifresi** gerekir):

```bash
cd src/FeatureRequestPortal.Web
dotnet user-secrets set "Settings:Abp.Mailing.Smtp.Host" "smtp.gmail.com"
dotnet user-secrets set "Settings:Abp.Mailing.Smtp.UserName" "adresiniz@gmail.com"
dotnet user-secrets set "Settings:Abp.Mailing.Smtp.Password" "uygulama-sifresi"
dotnet user-secrets set "Settings:Abp.Mailing.DefaultFromAddress" "adresiniz@gmail.com"
```

Sırlar **user secrets**'ta tutulur, repoya girmez.

### Testler

```bash
dotnet test                                   # 28 test
cd src/FeatureRequestPortal.SPA && npx tsc -b  # SPA tip kontrolü
```

| Proje | Adet | Tür |
|---|---|---|
| `Domain.Tests` | 10 | Saf unit test, veritabanı yok |
| `EntityFrameworkCore.Tests` | 17 | Entegrasyon, SQLite in-memory |
| `Web.Tests` | 1 | Smoke |

> SPA için `npx tsc --noEmit` **hiçbir şeyi kontrol etmez** — kök `tsconfig.json` solution-style
> olduğu için sessizce başarılı olur. Doğru komut `tsc -b`, `npm run build` de onu çalıştırır.

---

## Ekran görüntüleri

### Ana sayfa — ziyaretçi

Ziyaretçi yalnızca `Approved` kayıtları görür. Statü filtresi ona hiç gösterilmiyor — göstersek
her seçim boş tablo döndürürdü; yerine tek cümlelik bir açıklama var. Sayfalama 15 satır,
oy sayısı kolonu başlığına tıklanarak sıralanabiliyor.

![Liste — ziyaretçi](docs/screenshots/01-list-anonymous.jpg)

### Detay — ziyaretçi

Oy verme ve yorum yazma alanları giriş bağlantısına dönüşür.

![Detay — ziyaretçi](docs/screenshots/02-detail-anonymous.jpg)

### Ana sayfa — giriş yapmış kullanıcı

Giriş yapan kullanıcı tüm statüleri görür, filtreleyebilir ve sayfa boyutunu seçebilir.

![Liste — giriş yapmış](docs/screenshots/03-list-authenticated.jpg)

### Detay — admin

Oy verildiği için buton kilitli; yorumlarda yazar ve tarih görünüyor. Admin ek olarak statü
değiştirebiliyor ve talebi silebiliyor.

![Detay — admin](docs/screenshots/04-detail-admin.jpg)

### Yeni talep

![Yeni talep](docs/screenshots/05-create.jpg)

### Silme onayı (soft-delete)

![Silme onayı](docs/screenshots/06-delete-confirmation.jpg)

### Kayıt akışı

Kayıt → e-postaya gelen 6 haneli kod → admin onayı.

| Kayıt | Kod doğrulama | Onay bekleniyor |
|---|---|---|
| ![Kayıt](docs/screenshots-accounts/01-signup.jpg) | ![Kod](docs/screenshots-accounts/02-verify-code.jpg) | ![Bekliyor](docs/screenshots-accounts/04-pending-approval.jpg) |

Yanlış kod reddedilir; admin kuyruğunda yalnızca e-postasını doğrulamış hesaplar listelenir.

| Yanlış kod | Admin onay kuyruğu | Şifre sıfırlama |
|---|---|---|
| ![Yanlış kod](docs/screenshots-accounts/03-wrong-code.jpg) | ![Kuyruk](docs/screenshots-accounts/05-admin-queue.jpg) | ![Sıfırlama](docs/screenshots-accounts/07-reset-password.jpg) |

### React arayüzü — ekranlar

Aynı backend'in React + TypeScript arayüzü: tasarım token'ları, açık/koyu tema, Türkçe/İngilizce.

| Liste (açık tema) | Liste — admin (koyu tema) |
|---|---|
| ![SPA liste](docs/screenshots-spa/01-spa-list-anonymous.jpg) | ![SPA admin](docs/screenshots-spa/04-spa-list-admin-dark.jpg) |

| Detay — admin | Mükerrer oy engeli |
|---|---|
| ![SPA detay](docs/screenshots-spa/06-spa-detail-admin-dark.jpg) | ![SPA mükerrer oy](docs/screenshots-spa/08-spa-already-voted.jpg) |

| Türkçe | Mobil (380px) |
|---|---|
| ![SPA Türkçe](docs/screenshots-spa/11-spa-turkish.jpg) | ![SPA mobil](docs/screenshots-spa/09-spa-mobile.jpg) |

---

## Mimari

ABP'nin katmanlı (DDD) yapısı:

| Katman | İçerik |
|---|---|
| `Domain.Shared` | `FeatureRequestStatus` enum'ı, `FeatureRequestConsts` (uzunluk limitleri), hata kodları, localization |
| `Domain` | `FeatureRequest` aggregate root'u, `Vote` ve `Comment` child entity'leri, `IFeatureRequestRepository`, seed |
| `EntityFrameworkCore` | DbContext mapping'leri, `EfCoreFeatureRequestRepository`, migration'lar |
| `Application.Contracts` | DTO'lar, app service interface'leri, permission tanımları |
| `Application` | App service implementasyonları, Mapperly mapper'ları |
| `HttpApi` | Auto API controller'lar buradan expose edilir |
| `Web` | Razor Pages, menü, CORS, Swagger, e-posta gönderimi |
| `SPA` | React + TypeScript arayüz (ABP katmanı değil, ayrı bir Vite projesi) |

**Kritik referans kuralı:** `Application.Contracts` yalnızca `Domain.Shared`'ı görür, `Domain`'i
görmez. Sözleşme paketi istemciye dağıtılabilir olmalı; entity'leri ve iş kurallarını sürüklememeli.
Bu yüzden DTO'ların kullandığı her şey — statü enum'ı, uzunluk sabitleri — `Domain.Shared`'da.

### Domain modeli

```
FeatureRequest : FullAuditedAggregateRoot<Guid>        → soft-delete
├── Title (10–200, zorunlu), Description (max 2000)
├── Status (Pending, Approved, Rejected, Planned, Completed, Cancelled)
├── VoteCount (private set — yalnızca AddVote artırır)
├── Votes    → Vote    : CreationAuditedEntity<Guid>
└── Comments → Comment : CreationAuditedEntity<Guid>   (Text: 100–2000)
```

Şartname `AggregateRoot` diyor; admin silmesi soft-delete olacağı için `FullAuditedAggregateRoot`
kullandım — aksi halde `IsDeleted` alanı hiç olmazdı.

`Vote` ve `Comment` constructor'ları `internal`; yalnızca `FeatureRequest.AddVote()` /
`AddComment()` üzerinden yaratılabiliyorlar. Repository de tek: `IFeatureRequestRepository`.
Tutarlılık sınırı aggregate'in kendisi.

### Öne çıkan tasarım kararları

**Mükerrer oy iki katmanda engelleniyor.** Domain'de `AddVote()` içinde `HasVoted` kontrolü ve
`AlreadyVoted` iş hatası; veritabanında `AppVotes` üzerinde `(FeatureRequestId, CreatorId)` unique
index. Domain kontrolü okunabilir ve lokalize bir hata verir, ama iki eşzamanlı istek ikisi de
kontrolden geçebilir — o noktada unique index son sözü söyler.

**`VoteCount` bilinçli olarak denormalize.** Liste oy sayısına göre sıralanıp sayfalandığı için
kolon olarak tutuluyor ve index'leniyor; `Votes.Count` her sıralamada join + group by gerektirirdi.
Tutarlılık `private set` ile korunuyor: sadece `AddVote()` içinde, `Votes.Add()` ile aynı metotta
artıyor.

**Kullanıcıdan gelen hiçbir değer doğrudan sorguya girmiyor.** Repository dinamik sıralama için
`System.Linq.Dynamic.Core` kullanıyor, yani string'den LINQ ifadesi üretiliyor. Bu string query
string'den gelseydi `Sorting=CreatorId` gibi bir istek sıralama üzerinden veri sızdırabilirdi.
`NormalizeSorting` bir whitelist: çıktı yalnızca `VoteCount asc/desc` veya `CreationTime asc/desc`
olabiliyor. Aynı yaklaşım sayfa boyutunda da var (`NormalizePageSize`).

**Ziyaretçi filtresi sorgunun içinde.** `onlyApproved = !CurrentUser.IsAuthenticated` bayrağı
repository'ye geçiyor ve `WhereIf` ile SQL'e giriyor. Bellekte filtreleseydim hem gereksiz veri
çekerdim hem de `totalCount` yanlış çıkacağı için sayfalama bozulurdu. Ziyaretçi onaylanmamış bir
kaydın id'sini tahmin ederse 403 değil **404** alıyor — 403 kaydın varlığını sızdırırdı.

**Yorum yazarları tek sorguda çözülüyor.** `CreatorId`'ler toplanıp tek `GetListAsync` ile
çekiliyor; yorum başına sorgu atsaydım 20 yorumlu bir talepte 20 ekstra sorgu olurdu. Kullanıcı adı
`Comment` aggregate'ine ait olmadığı için entity'de tutulmuyor, okuma anında çözülüyor.

### Yetkilendirme

App service sınıf düzeyinde `[Authorize]`; liste ve detay `[AllowAnonymous]`. Statü değiştirme ve
silme ABP permission'larına bağlı (`FeatureRequests.ChangeStatus`, `FeatureRequests.Delete`).
Talep açma, oy verme ve yorum yapma için ayrı permission tanımlamadım: bunlar **her** giriş yapmış
kullanıcıda var, permission yapmak hiç kapatılmayacak bir anahtar tanımlamak olurdu.

### React arayüzü

Razor Pages arayüzü olduğu gibi duruyor; SPA onun yerine geçmiyor, yanında duruyor ve ABP'nin
otomatik ürettiği HTTP API'yi tüketiyor. Bu aynı zamanda API'nin gerçekten istemci-agnostik
olduğunun kanıtı.

- **Kimlik doğrulama:** OpenIddict `password` grant. Giriş ekranı böylece SPA'nın kendi tasarımı
  içinde kalıyor. 401 alındığında bir kez `refresh_token` denenip istek tekrarlanıyor.
- **Yetki:** `/api/abp/application-configuration` çağrısından `grantedPolicies` okunuyor; admin
  kontrolleri ona bağlı. Bu yalnızca UI gizleme — gerçek koruma sunucuda.
- **Çok dillilik:** `en` ve `tr` sözlüklerinin ikisi de `Record<TranslationKey, string>` tipinde,
  yani birinde eksik kalan anahtar **derleme hatası** oluyor.

---

## Varsayımlar

Ödev metninde açık olmayan noktalarda verdiğim kararlar:

1. **Görünürlük:** Ziyaretçi yalnızca `Approved` görür (metinde yazdığı gibi). Giriş yapmış
   kullanıcılar **tüm statüleri** görür — böylece kendi açtıkları `Pending` talebi ve topluluğun
   bekleyen taleplerini görebiliyorlar.
2. **Yorum minimum uzunluğu 100 karakter**, metinde yazdığı gibi uygulandı.
   `FeatureRequestConsts.MinCommentTextLength` ile tek noktadan yönetiliyor.
3. **Ana sayfa doğrudan liste sayfasıdır** (`/`); şablonun karşılama sayfası kaldırıldı.
4. **Liste kolonları:** İstenen Başlık / Oy / Durum kolonlarına ek olarak **Oluşturulma** kolonu
   eklendi. Varsayılan sıralama oluşturulma tarihine göre olduğu için bu kolonun görünmesi
   sıralamayı anlaşılır kılıyor.
5. **Statü geçişlerinde kural yok.** Şartname "admin istediği status'e serbestçe geçebilir" dediği
   için kısıtlamadım; gerekseydi `FeatureRequest.SetStatus` içine bir state machine konurdu.
6. **PostgreSQL portu 5433**, geliştirme makinelerinde 5432 sıklıkla dolu olduğu için.

### Şartname dışında eklediklerim

Bunlar istenmemişti, kendim ekledim — değerlendirmede ayırt edilebilsin diye ayrıca yazıyorum:

- **React + TypeScript arayüz** (`src/FeatureRequestPortal.SPA`) — Razor'a dokunulmadan, yanına.
- **Kayıt akışı:** e-posta ile kod doğrulama + admin onayı, ve şifre sıfırlama.
- **Türkçe / İngilizce** dil desteği (her iki arayüzde).
- **Seçilebilir sayfa boyutu** (varsayılan 15; 20/30/50 de seçilebiliyor).

---

## Zorlandığım noktalar

### 1. macOS Keychain tüm sunucuyu kilitledi

React arayüzünü bağlarken ilk giriş denemesinde `/connect/token` isteği hiç dönmedi — ve ardından
sunucu **bütün** isteklere cevap vermez oldu. Log token üretiminin ortasında kesiliyordu.

Önce veritabanına baktım: `pg_stat_activity`'de "idle in transaction" bir bağlantı vardı ama
bekleyen hiçbir lock yoktu, yani kilit veritabanında değildi. Process %0 CPU'da uyuyordu.
`dotnet-stack` ile managed stack dump aldım ve thread'i şurada buldum:

```
Interop+AppleCrypto.AppleCryptoNative_SecKeyCreateSignature
  → RSASecurityTransforms.TrySignHash
    → JsonWebTokenHandler.CreateToken
      → OpenIddict ... GenerateIdentityModelToken
```

Sebep: ABP'nin development imzalama sertifikası macOS'ta login Keychain'de duruyor. JWT imzalamak
Keychain onayı gerektiriyor ve GUI oturumuna bağlı olmayan bir process bu onayı asla alamıyor.
Tek bir asılı istek thread pool'u tıkayınca sunucunun tamamı sağır oluyordu.

Çözüm: Development'ta `AddEphemeralEncryptionKey()` / `AddEphemeralSigningKey()` — anahtarlar
bellekte, Keychain'e hiç gidilmiyor. Production yolu değişmedi. Hatanın daha önce çıkmamasının
sebebi Razor arayüzünün cookie authentication kullanması; token endpoint'ine hiç gitmiyordu.

### 2. Uygulama e-posta gönderiyor sanıyordum, göndermiyordu

SMTP ayarları doğruydu, kayıt akışı hatasız çalışıyordu, hiçbir exception yoktu — ama doğrulama
kodu maili hiç ulaşmıyordu.

SMTP bilgilerinin doğruluğunu bağımsız bir script'le kanıtladıktan sonra sorunun uygulamada
olduğunu anladım ve log'da şu satırı buldum: **`USING NullEmailSender!`**. ABP, Development
ortamında `IEmailSender`'ı `NullEmailSender` ile değiştiriyor; mail üretiliyor, loglanıyor ve
sessizce çöpe atılıyor.

Çözüm: sender'ı açıkça seçmek — SMTP host tanımlıysa gerçek `SmtpEmailSender`, tanımlı değilse
mailleri diske yazan bir `FileEmailSender`. İkincisi sessizce yutmuyor, konsola uyarı düşüyor.

Buradan çıkardığım ders: **"hata yok" ile "iş yapıldı" aynı şey değil.**

### 3. Aynı istek curl'de 200, tarayıcıda 400 dönüyordu

React arayüzünden yapılan POST'lar 400 dönüyordu; aynı isteği `curl` ile atınca 200 alıyordum.

Fark şuydu: Vite proxy'si SPA'yı backend ile **aynı origin**'e koyuyor, dolayısıyla tarayıcı ABP'nin
antiforgery cookie'sini her istekte geri gönderiyor. ABP bunu görünce isteği "cookie ile
doğrulanmış" sayıp `RequestVerificationToken` header'ı bekliyor. `curl`'de cookie olmadığı için o
kontrol hiç tetiklenmiyordu.

Çözüm: ABP'nin okunabilir `XSRF-TOKEN` cookie'sini okuyup güvenli olmayan HTTP metotlarında bu
header ile geri göndermek.

### 4. Mapperly: derlenen ama çalışmayan mapper

Bu şablon AutoMapper değil **Mapperly** ile geliyor, dolayısıyla ABP dokümanlarındaki `CreateMap<>`
yaklaşımı burada çalışmıyor. Mapper sınıfının `[Mapper]` ile işaretlenip `MapperBase<,>`'den
türemesi gerekiyor.

Tuzak şu: `IAbpMapperlyMapper<,>` arayüzünü doğrudan implemente etmek **derleniyor**, ama runtime'da
`AddMapperlyObjectMapper` mapper'ı bulamıyor ve *"No object mapping was found"* hatası veriyor.
Çünkü o arayüz `Map` dışında `BeforeMap`/`AfterMap` hook'larını da bekliyor; `MapperBase` bunları
hazır veriyor. Derleyici uyarmadığı için bunu ancak entegrasyon testlerini yazdıktan sonra fark
ettim.

### 5. Sonradan eklenen permission mevcut veritabanına hiç ulaşmıyor

Kayıt onayı için `Users.Approve` yetkisini ekledim, ama admin ile giriş yapınca yeni admin sayfasına
erişemedim.

Sebep: ABP tüm yetkileri admin rolüne **yalnızca o rolü ilk yarattığı anda** veriyor. Sonradan
tanımlanan bir permission mevcut bir veritabanına hiç ulaşmıyor. Sıfırdan kurulan bir veritabanında
sorun görünmediği için fark etmesi de kolay değil.

Çözüm: `AdminPermissionDataSeedContributor` ile yetkiyi idempotent şekilde vermek — güncellenen
veritabanlarını onarıyor, yeni kurulumları etkilemiyor.

---

## Öğrendiklerim

**ABP'nin konvansiyonları çok şey veriyor, ama ne yaptığını bilmek şart.** Auto API controller'lar,
soft-delete için global query filter, audit alanlarının otomatik doldurulması, permission sistemi —
bunların hiçbirini yazmadım. Buna karşılık framework'ün sessizce devreye giren davranışları
(development'ta `NullEmailSender`, permission'ları yalnızca rol yaratılırken verme,
`IHtmlLocalizer.Value`'nun formatlamaması) en çok vakit kaybettiren şeyler oldu. Bir framework'ü
öğrenmek, ne yaptığını olduğu kadar **ne zaman sizin yerinize karar verdiğini** öğrenmek demek.

**Katman kuralları soyut değil, somut sonuçları var.** `Application.Contracts`'ın `Domain`'i
görmemesi başta gereksiz bir kısıt gibi geldi; sonra DTO'daki `[StringLength]` attribute'u ile
entity'deki doğrulamanın aynı sabiti kullanması gerektiğinde sabitin neden `Domain.Shared`'da olması
gerektiğini anladım. Kural, sözleşme paketinin tek başına dağıtılabilir kalmasını sağlıyor.

**"Test geçiyor" ile "çalışıyor" farklı şeyler.** Silme onayı mesajındaki `{0}` yer tutucusunu,
`NullEmailSender`'ı ve tarayıcı-curl farkını testler yakalamadı; hepsini uygulamayı gerçekten
çalıştırıp tarayıcıda tıklayarak buldum. Aynı şekilde SPA'da `tsc --noEmit`'in aslında hiçbir şeyi
kontrol etmediğini, sözlüğü bilerek bozup hâlâ "temiz" dediğini görünce fark ettim. **Yeşil bir
çıktı, doğrulama anlamına gelmiyor** — o çıktının gerçekten ne kontrol ettiğini bilmek gerekiyor.

**Güvenlik çoğu zaman "kullanıcı girdisini kapalı bir kümeye eşlemek" demek.** Dinamik LINQ ile
string'den sorgu üretmek güçlü ama tehlikeli; `NormalizeSorting` ve `NormalizePageSize` gibi küçük
whitelist'ler bu gücü güvenli hale getiriyor. Aynı mantıkla 403 yerine 404 dönmenin bir kaydın
varlığını gizlediğini öğrendim — küçük bir tercih, gerçek bir sızıntıyı kapatıyor.

**Denormalizasyon, encapsulation ile birlikte gelirse güvenli.** `VoteCount`'u ayrı kolonda tutmak
performans için gerekliydi ama tutarsızlık riski taşıyordu. `private set` + tek bir metotta artırma
ile riski tasarım seviyesinde kapattım. Performans kararlarının yanına onları koruyacak bir kısıt
koymak gerekiyor.
