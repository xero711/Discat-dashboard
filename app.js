"use strict";

const PUBLIC_API_BASE_URL = "https://api.xero-x.me";
const LOCAL_ONE_API_BASE_URL = "http://127.0.0.1:8000";
const PUBLIC_DASHBOARD_URL = "https://xero-x.me/Discat-dashboard/";
const API_BASE_URL = configuredOneApiBase();
const PRODUCT_STORAGE_KEY = "discat_dashboard_product";
const ONE_API_BASE_STORAGE_KEY = "discat_one_api_base";
const GUARD_API_BASE_STORAGE_KEY = "discat_guard_api_base";
const GUARD_DEFAULT_API_BASE_URL = "http://127.0.0.1:8788";
const GUARD_PUBLIC_API_BASE_URL = "https://guard-api.xero-x.me";
const GUARD_STATUS_SAMPLE_ENDPOINT = "./guard-status.sample.json";
const GUARD_DISCORD_CLIENT_ID = "1503177107910561954";
const GUARD_BOT_PERMISSIONS = "4785635568372983";
const AUTH_TOKEN_STORAGE_KEY = "discat_one_session_token";
const AUTH_TOKEN_COOKIE_NAME = "discat_one_session_token";
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const REQUEST_TIMEOUT_MS = 60000;
const SERVICE_STATUS_TIMEOUT_MS = 10000;
const SERVICE_STATUS_REFRESH_INTERVAL_MS = 30000;
const GUARD_STATUS_REFRESH_INTERVAL_MS = SERVICE_STATUS_REFRESH_INTERVAL_MS;
const HOST_REFRESH_INTERVAL_MS = 5000;
const PLAYLIST_PREVIEW_DURATION_SECONDS = 15;
const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TURNSTILE_PROOF_STORAGE_KEY = "discat_one_turnstile_proof";
const MASCOT_URL = "./assets/discat-mascot.png";
const GUARD_MASCOT_URL = "./assets/discatGuard-mascot.png";
const ONE_SITE_ICON_URL = "./assets/apple-touch-icon.png";
const GUARD_SITE_ICON_URL = "./assets/guard-site-icon.png";
const DASHBOARD_OG_IMAGE_URL = "https://xero-x.me/Discat-dashboard/assets/og-image.png";
const ONE_OG_IMAGE_URL = DASHBOARD_OG_IMAGE_URL;
const GUARD_OG_IMAGE_URL = DASHBOARD_OG_IMAGE_URL;
const SUPPORT_SERVER_URL = "https://discord.gg/6ZzGvfnhRn";
const TTS_TEXT_LENGTH_DEFAULT = 20;
const TTS_TEXT_LENGTH_MIN = 1;
const TTS_TEXT_LENGTH_MAX = 100;
const HOST_CONTROL_ADMIN_DISCORD_USER_ID = "907254481371144243";

const TTS_ENGINES = [
  { value: "voicevox", label: "VOICEVOX" },
  { value: "aivis", label: "AivisSpeech" },
  { value: "coeiroink", label: "COEIROINK" },
];

const USER_PAGE = {
  id: "user",
  label: "ユーザーページ",
  eyebrow: "ユーザー",
  description: "プロフィールとプレイリスト",
  icon: "user",
  view: "user",
};
const SERVER_DEFAULT_PAGE = "welcome-message";
const ACTIVITY_PERIODS = [
  { id: "daily", label: "日" },
  { id: "weekly", label: "週" },
  { id: "monthly", label: "月" },
];
const WELCOME_MESSAGE_TOKEN_GROUPS = [
  {
    title: "メンバー",
    tokens: [
      { value: "[user]", description: "参加したメンバーにメンションする" },
      { value: "[userName]", description: "参加したメンバーのユーザー名を表示する（メンションはしません）" },
      { value: "[displayName]", description: "参加したメンバーのサーバー表示名を表示する（メンションはしません）" },
      { value: "[userId]", description: "参加したメンバーのDiscord IDを表示する" },
    ],
  },
  {
    title: "サーバー",
    tokens: [
      { value: "[memberCount]", description: "現在のサーバーメンバー数を表示する" },
      { value: "[server]", description: "このサーバーの名前を表示する" },
      { value: "[serverId]", description: "このサーバーのIDを表示する" },
    ],
  },
  {
    title: "招待",
    tokens: [
      { value: "[inviter]", description: "招待者にメンションする" },
      { value: "[inviterName]", description: "招待者の名前を表示する（メンションはしません）" },
      { value: "[invites]", description: "招待した回数を表示する" },
    ],
  },
];
const WELCOME_MESSAGE_TOKENS = WELCOME_MESSAGE_TOKEN_GROUPS.flatMap((group) => group.tokens);

const SETTINGS_PAGES = [
  {
    id: "welcome-message",
    label: "歓迎メッセージ",
    eyebrow: "参加",
    description: "新規メンバーへの案内",
    help: "メンバー参加時に、指定チャンネルへ歓迎メッセージを送信します。",
    icon: "message",
    view: "features",
  },
  {
    id: "tts",
    label: "読み上げ設定",
    eyebrow: "読み上げ",
    description: "声と自動読み上げ",
    help: "読み上げエンジン、話者、音量、速度、読み上げ対象チャンネル、ユーザー辞書を設定します。",
    icon: "volume",
    view: "tts",
  },
  {
    id: "global-chat",
    label: "グローバルチャット",
    eyebrow: "チャット",
    description: "共通チャット連携",
    help: "指定チャンネルの投稿を、グローバルチャットを有効にした他サーバーへ中継します。",
    icon: "message",
    view: "features",
  },
  {
    id: "sticky-message",
    label: "固定メッセージ",
    eyebrow: "チャット",
    description: "チャンネルごとの固定文",
    help: "指定チャンネルに案内文を再掲し、重要なメッセージを下部で見つけやすくします。",
    icon: "pin",
    view: "features",
  },
  {
    id: "vc-notification",
    label: "VC通知",
    eyebrow: "通知",
    description: "参加通知とロール",
    help: "案内メッセージにリアクションしたユーザーへ、VC参加時の通知ロールで知らせます。",
    icon: "bell",
    view: "features",
  },
  {
    id: "admin",
    label: "管理者用",
    eyebrow: "BOT管理",
    description: "稼働状況とPC操作",
    help: "BOT、API、ストレージ、ログ、再起動などホスト側の状態確認と操作を行います。",
    icon: "activity",
    view: "host",
  },
];

const AUTH_ERROR_MESSAGES = {
  discord_denied: "Discordログインがキャンセルされました。",
  missing_code: "Discordログインの応答が不足しています。もう一度ログインしてください。",
  invalid_state: "ログイン確認の有効期限が切れました。もう一度ログインしてください。",
  oauth_failed: "Discordログインに失敗しました。時間をおいて再試行してください。",
  security_failed: "セキュリティ検証の有効期限が切れました。もう一度検証してください。",
};

const PRODUCT_META = {
  one: {
    id: "one",
    label: "Discat One",
    shortLabel: "One",
    subtitle: "管理ダッシュボード",
    iconUrl: MASCOT_URL,
  },
  guard: {
    id: "guard",
    label: "Discat Guard",
    shortLabel: "Guard",
    subtitle: "セキュリティダッシュボード",
    iconUrl: GUARD_MASCOT_URL,
  },
};

const GUARD_FEATURES = [
  {
    id: "verification",
    label: "認証",
    description: "認証ボタン、付与ロール、同一端末検知時の処置を設定します。",
    help: "サーバーごとに認証ボタン、ログチャンネル、付与ロール、同一端末検知時の処置を設定します。",
    icon: "lock",
  },
  {
    id: "moderation",
    label: "荒らし対策",
    description: "招待リンク連投、外部リンク、スパム、暴言、下ネタの検知と処罰を設定します。",
    help: "検知レベル、処罰内容、処罰ログ、検知対象チャンネルを機能ごとに設定します。",
    icon: "shield",
  },
  {
    id: "logging",
    label: "ログ機能",
    description: "参加、脱退、ロール付与、VC入退室、メッセージ削除・編集のログ送信先を設定します。",
    help: "イベントごとに有効化とログを送るチャンネルを設定します。",
    icon: "activity",
  },
];

const GUARD_FEATURE_ROWS = [
  ["不審メッセージ監視", "大量メンション、短時間URL投稿、荒らし兆候を監査ログへ記録します。"],
  ["内容保護", "ログに保存する内容は本文を除外し、必要なメタデータだけを扱います。"],
  ["低権限運用", "スラッシュコマンドや通常コマンドを使わない監視専用BOTとして動作します。"],
];

const GUARD_SAMPLE_EVENTS = [
  { event_type: "bot_ready", guild: { name: "System" }, actor: { name: "Discat Guard" }, level: "info" },
  { event_type: "guild_joined", guild: { name: "Sample Guild" }, actor: { name: "Discord" }, level: "success" },
  { event_type: "suspicious_message", guild: { name: "Sample Guild" }, actor: { name: "sample-user" }, level: "warning" },
];

const GUARD_DUPLICATE_ACTIONS = [
  { id: "notify", label: "通知のみ" },
  { id: "kick", label: "キック" },
  { id: "ban", label: "BAN" },
];

const GUARD_MODERATION_FEATURES = [
  {
    id: "invite_spam",
    label: "招待リンク連投",
    description: "Discordサーバー招待リンクを一定ペース以上で送ったユーザーを検知します。",
  },
  {
    id: "other_links",
    label: "外部リンク遮断",
    description: "Discord招待リンク以外のURL投稿を検知します。",
  },
  {
    id: "spam",
    label: "スパム検知",
    description: "短時間の連投、同じ文面の繰り返し、大量メンションを検知します。",
  },
  {
    id: "profanity",
    label: "暴言禁止",
    description: "攻撃的な言葉や暴言を検知して処罰します。",
  },
  {
    id: "sexual_language",
    label: "下ネタ禁止",
    description: "性的な表現や下ネタを検知して処罰します。",
  },
];

const GUARD_MODERATION_LEVELS = [
  { id: "low", label: "低" },
  { id: "medium", label: "標準" },
  { id: "high", label: "高" },
];

const GUARD_MODERATION_ACTIONS = [
  { id: "log", label: "ログのみ" },
  { id: "delete", label: "メッセージ削除" },
  { id: "kick", label: "キック" },
  { id: "ban", label: "BAN" },
];

const GUARD_MODERATION_DEFAULTS = {
  invite_spam: { enabled: true, level: "medium", action: "kick", log_channel_id: "", target_channel_ids: [], all_channels_enabled: true },
  other_links: { enabled: true, level: "high", action: "delete", log_channel_id: "", target_channel_ids: [], all_channels_enabled: true },
  spam: { enabled: true, level: "medium", action: "delete", log_channel_id: "", target_channel_ids: [], all_channels_enabled: true },
  profanity: { enabled: true, level: "medium", action: "delete", log_channel_id: "", target_channel_ids: [], all_channels_enabled: true },
  sexual_language: { enabled: true, level: "medium", action: "delete", log_channel_id: "", target_channel_ids: [], all_channels_enabled: true },
};

const GUARD_LOGGING_EVENTS = [
  {
    id: "member_joined",
    label: "メンバー参加",
    description: "サーバーにメンバーが参加した時に送信します。",
    icon: "user",
  },
  {
    id: "member_removed",
    label: "メンバー脱退",
    description: "サーバーからメンバーが脱退した時に送信します。",
    icon: "logout",
  },
  {
    id: "role_added",
    label: "ロール付与",
    description: "メンバーにロールが付与された時に送信します。",
    icon: "shield",
  },
  {
    id: "voice_joined",
    label: "VC入室",
    description: "メンバーがボイスチャンネルへ入室した時に送信します。",
    icon: "radio",
  },
  {
    id: "voice_left",
    label: "VC退室",
    description: "メンバーがボイスチャンネルから退室した時に送信します。",
    icon: "radio",
  },
  {
    id: "message_deleted",
    label: "メッセージ取り消し",
    description: "メッセージが削除された時に送信します。",
    icon: "trash",
  },
  {
    id: "message_edited",
    label: "メッセージ編集",
    description: "メッセージが編集された時に送信します。",
    icon: "message",
  },
];

const GUARD_LOGGING_DEFAULTS = Object.fromEntries(
  GUARD_LOGGING_EVENTS.map((event) => [event.id, { enabled: true, channel_id: "" }]),
);

class ApiError extends Error {
  constructor(status, message, requestId) {
    super(message);
    this.status = status;
    this.requestId = requestId;
  }
}

const state = {
  activeProduct: readInitialProduct(),
  productTransition: null,
  user: null,
  guilds: [],
  selectedGuildId: null,
  guildListCollapsed: true,
  settings: null,
  savedSettings: null,
  featureSettings: null,
  savedFeatureSettings: null,
  ttsOptions: null,
  hostStatus: null,
  hostLogs: [],
  hostError: null,
  hostMessage: null,
  hostLoading: false,
  hostActionRunning: null,
  hostLastUpdatedAt: null,
  serviceStatus: {
    loading: true,
    apiOnline: false,
    botOnline: false,
    maintenance: true,
    botStale: true,
    botStatusUpdatedAt: null,
    checkedAt: null,
    error: null,
  },
  playlist: null,
  playlistLoading: false,
  playlistSaving: false,
  playlistError: null,
  playlistMessage: null,
  playlistUrl: "",
  playlistDragActive: false,
  userActivity: null,
  userActivityLoading: false,
  userActivityError: null,
  activeActivityPeriod: "daily",
  security: {
    loading: true,
    enabled: false,
    siteKey: "",
    proofToken: readTurnstileProofToken(),
    verified: Boolean(readTurnstileProofToken()),
    verifying: false,
    error: null,
    message: null,
    widgetId: null,
  },
  activePage: "user",
  loading: false,
  saving: false,
  message: null,
  guildDataError: null,
  dirtyViews: {
    tts: false,
    features: false,
    guardVerification: false,
    guardModeration: false,
    guardLogging: false,
  },
  pendingPageId: null,
  pendingProductId: null,
  guard: {
    apiBase: configuredGuardApiBase(),
    apiError: null,
    health: null,
    events: GUARD_SAMPLE_EVENTS,
    loading: true,
    loadedAt: null,
    activeFeature: "verification",
    source: "sample",
    status: normalizeGuardStatus(null),
    verificationSettings: [],
    moderationSettings: [],
    loggingSettings: [],
    verificationOptions: null,
    verificationOptionsError: null,
    verificationRecords: [],
    verificationSaving: false,
    moderationSaving: false,
    loggingSaving: false,
    verificationMessage: null,
    verificationError: null,
    moderationMessage: null,
    moderationError: null,
    loggingMessage: null,
    loggingError: null,
    savedVerificationForm: null,
    savedModerationForm: null,
    savedLoggingForm: null,
    pendingFeatureId: null,
    pendingGuildId: null,
    verificationForm: {
      guild_id: "",
      enabled: true,
      button_channel_lock_enabled: true,
      button_channel_id: "",
      log_channel_id: "",
      role_id: "",
      duplicate_action: "notify",
    },
    moderationForm: {
      guild_id: "",
      features: {},
    },
    loggingForm: {
      guild_id: "",
      events: {},
    },
  },
  requestIds: {
    account: 0,
    guildData: 0,
    save: 0,
    host: 0,
    serviceStatus: 0,
    playlist: 0,
    activity: 0,
    guard: 0,
  },
};

const root = document.getElementById("root");
let hostRefreshTimerId = null;
let serviceStatusRefreshTimerId = null;
let guardStatusRefreshTimerId = null;
let turnstileScriptPromise = null;
let playlistAnimationFrameId = null;
let lastPlaylistPointerToggleTrackId = "";
let lastPlaylistPointerToggleAt = 0;
root.addEventListener("pointerdown", handlePointerDown);
root.addEventListener("click", handleClick);
root.addEventListener("change", handleChange);
root.addEventListener("input", handleInput);
root.addEventListener("submit", handleSubmit);
root.addEventListener("dragover", handleDragOver);
root.addEventListener("dragleave", handleDragLeave);
root.addEventListener("drop", handleDrop);
["play", "playing", "pause", "ended", "timeupdate", "seeking", "seeked", "loadedmetadata", "durationchange", "canplay"].forEach((eventName) => {
  root.addEventListener(eventName, handlePlaylistAudioEvent, true);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    return;
  }
  if (state.activeProduct === "guard") {
    void loadGuardData({ silent: true });
    return;
  }
  void loadServiceStatus({ silent: true });
  if (shouldAutoRefreshHost()) {
    void loadHostData({ silent: true, keepMessage: true });
  }
});

async function boot() {
  const params = new URLSearchParams(window.location.search);
  const authError = params.get("auth_error");
  const sessionToken = params.get("session_token");
  const product = normalizeProductId(params.get("product"));
  const dashboardVersion = params.get("dashboardVersion");

  if (sessionToken) {
    setAuthToken(sessionToken);
    params.delete("session_token");
  }
  if (authError) {
    state.message = AUTH_ERROR_MESSAGES[authError] ?? "Discordログインに失敗しました。";
    if (authError === "security_failed") {
      clearTurnstileProofToken();
      state.security.proofToken = "";
      state.security.verified = false;
    }
    params.delete("auth_error");
  }
  if (product) {
    state.activeProduct = product;
    writeProductPreference(product);
    params.delete("product");
  } else if (authError || sessionToken) {
    state.activeProduct = "one";
    writeProductPreference("one");
  }
  if (dashboardVersion) {
    params.delete("dashboardVersion");
  }
  if (authError || sessionToken || product || dashboardVersion) {
    const query = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }

  render();
  updateDocumentForProduct();
  if (state.activeProduct === "guard") {
    await Promise.all([
      loadTurnstileConfig(),
      loadGuardAccountContext({ silent: true, renderAfter: false }),
      loadGuardData({ silent: true, renderAfter: false }),
    ]);
    hydrateGuardVerificationForm();
    hydrateGuardModerationForm();
    render();
    return;
  }
  await loadServiceStatus({ silent: true, hydrate: false });
  if (serviceMaintenanceActive()) {
    return;
  }
  await loadTurnstileConfig();
  if (getAuthToken()) {
    await loadAccount();
  }
}

function normalizeProductId(value) {
  const id = String(value ?? "").trim().toLowerCase();
  return PRODUCT_META[id] ? id : null;
}

function readInitialProduct() {
  const params = new URLSearchParams(window.location.search);
  let storedProduct = null;
  try {
    storedProduct = localStorage.getItem(PRODUCT_STORAGE_KEY);
  } catch {
    storedProduct = null;
  }
  return normalizeProductId(params.get("product")) ?? normalizeProductId(storedProduct) ?? "one";
}

function configuredOneApiBase() {
  const params = new URLSearchParams(window.location.search);
  const paramApiBase = cleanGuardApiBase(params.get("oneApiBase"));
  if (paramApiBase) {
    return paramApiBase;
  }

  let storedApiBase = null;
  try {
    storedApiBase = localStorage.getItem(ONE_API_BASE_STORAGE_KEY);
  } catch {
    storedApiBase = null;
  }

  const cleanStoredApiBase = cleanGuardApiBase(storedApiBase);
  if (cleanStoredApiBase && !isWrongPublicOneApiBase(cleanStoredApiBase)) {
    return cleanStoredApiBase;
  }
  if (cleanStoredApiBase) {
    try {
      localStorage.removeItem(ONE_API_BASE_STORAGE_KEY);
    } catch {
      // Ignore storage errors in restricted browser contexts.
    }
  }
  return defaultOneApiBase();
}

function isLocalDashboardOrigin() {
  return ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);
}

function defaultOneApiBase() {
  return isLocalDashboardOrigin() ? LOCAL_ONE_API_BASE_URL : PUBLIC_API_BASE_URL;
}

function isWrongPublicOneApiBase(value) {
  if (isLocalDashboardOrigin()) {
    return false;
  }
  try {
    const url = new URL(value);
    if (window.location.protocol === "https:" && url.protocol !== "https:") {
      return true;
    }
    return url.hostname !== new URL(PUBLIC_API_BASE_URL).hostname;
  } catch {
    return true;
  }
}

function configuredGuardApiBase() {
  const params = new URLSearchParams(window.location.search);
  let storedApiBase = null;
  try {
    storedApiBase = localStorage.getItem(GUARD_API_BASE_STORAGE_KEY);
  } catch {
    storedApiBase = null;
  }
  const configuredApiBase =
    cleanGuardApiBase(params.get("guardApiBase")) ??
    cleanGuardApiBase(params.get("apiBase")) ??
    cleanGuardApiBase(storedApiBase);
  if (configuredApiBase && validateGuardApiBase(configuredApiBase)) {
    return defaultGuardApiBase();
  }
  if (configuredApiBase && isWrongPublicGuardApiBase(configuredApiBase)) {
    return defaultGuardApiBase();
  }
  return configuredApiBase ?? defaultGuardApiBase();
}

function defaultGuardApiBase() {
  return isLocalDashboardOrigin() ? GUARD_DEFAULT_API_BASE_URL : GUARD_PUBLIC_API_BASE_URL;
}

function isWrongPublicGuardApiBase(value) {
  if (isLocalDashboardOrigin()) {
    return false;
  }
  try {
    return new URL(value).hostname === "api.xero-x.me";
  } catch {
    return false;
  }
}

function cleanGuardApiBase(value) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return null;
  }
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function validateGuardApiBase(value) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return "";
  }
  let url;
  try {
    url = new URL(raw);
  } catch {
    return "Guard API URLは http:// または https:// から始まるURLを入力してください。";
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    return "Guard API URLは http:// または https:// から始まるURLを入力してください。";
  }
  if (window.location.protocol === "https:" && url.protocol !== "https:" && !isLocalDashboardOrigin()) {
    return "GitHub PagesなどHTTPSのダッシュボードでは、https:// から始まるGuard API URLを指定してください。";
  }
  return "";
}

function writeProductPreference(productId) {
  try {
    localStorage.setItem(PRODUCT_STORAGE_KEY, productId);
  } catch {
    // Ignore storage errors in restricted browser contexts.
  }
}

async function activateProduct(productId) {
  const nextProduct = normalizeProductId(productId);
  if (!nextProduct) {
    return;
  }
  if (state.activeProduct === nextProduct) {
    clearPendingNavigation();
    render();
    return;
  }
  if (hasUnsavedChanges()) {
    clearPendingNavigation();
    state.pendingProductId = nextProduct;
    render();
    return;
  }
  const previousProduct = state.activeProduct;
  state.activeProduct = nextProduct;
  writeProductPreference(nextProduct);
  stopOneAutoRefresh();
  stopGuardAutoRefresh();
  if (nextProduct === "guard") {
    state.security.loading = true;
    state.security.error = null;
  }
  renderProductTransition(previousProduct, nextProduct);

  if (nextProduct === "guard") {
    await Promise.all([
      loadTurnstileConfig({ silent: true, renderAfter: false }),
      loadGuardAccountContext({ silent: true, renderAfter: false }),
      loadGuardData({ silent: true, renderAfter: false }),
    ]);
    hydrateGuardVerificationForm();
    render();
    return;
  }

  await loadOneDashboardData();
}

function renderProductTransition(fromProduct, toProduct) {
  state.productTransition = null;
  render();
}

async function loadOneDashboardData() {
  await loadServiceStatus({ silent: true, hydrate: false });
  if (serviceMaintenanceActive()) {
    return;
  }
  await loadTurnstileConfig();
  if (getAuthToken()) {
    await loadAccount();
  } else {
    render();
  }
}

function stopOneAutoRefresh() {
  if (serviceStatusRefreshTimerId) {
    window.clearInterval(serviceStatusRefreshTimerId);
    serviceStatusRefreshTimerId = null;
  }
  if (hostRefreshTimerId) {
    window.clearInterval(hostRefreshTimerId);
    hostRefreshTimerId = null;
  }
}

function stopGuardAutoRefresh() {
  if (guardStatusRefreshTimerId) {
    window.clearInterval(guardStatusRefreshTimerId);
    guardStatusRefreshTimerId = null;
  }
}

function updateDocumentForProduct() {
  const product = PRODUCT_META[state.activeProduct] ?? PRODUCT_META.one;
  const isGuard = product.id === "guard";
  const description = isGuard
    ? "認証、監査ログ、重複端末検知を管理するDiscat Guardセキュリティダッシュボード"
    : "Discat Botの導入、設定、読み上げを管理するDiscat Oneダッシュボード";
  const ogImage = isGuard ? GUARD_OG_IMAGE_URL : ONE_OG_IMAGE_URL;
  const shareUrl = isGuard ? `${PUBLIC_DASHBOARD_URL}guard/` : `${PUBLIC_DASHBOARD_URL}one/`;
  document.title = `${product.label} Dashboard`;
  setMetaContent("description", description);
  setMetaContent("theme-color", isGuard ? "#081a22" : "#21183f");
  setMetaContent("og:site_name", product.label, "property");
  setMetaContent("og:title", `${product.label} Dashboard`, "property");
  setMetaContent("og:description", description, "property");
  setMetaContent("og:url", shareUrl, "property");
  setMetaContent("og:image", ogImage, "property");
  setMetaContent("og:image:url", ogImage, "property");
  setMetaContent("og:image:secure_url", ogImage, "property");
  setMetaContent("og:image:alt", `${product.label} Dashboard`, "property");
  setMetaContent("twitter:title", `${product.label} Dashboard`);
  setMetaContent("twitter:description", description);
  setMetaContent("twitter:image", ogImage);
  setMetaContent("twitter:image:src", ogImage);
  setSiteIcon(isGuard ? GUARD_SITE_ICON_URL : ONE_SITE_ICON_URL);
  document.body.classList.toggle("body--guard", isGuard);
}

function setMetaContent(name, content, attr = "name") {
  const selector = `meta[${attr}="${name}"]`;
  const node = document.querySelector(selector);
  if (node) {
    node.setAttribute("content", content);
  }
}

function setSiteIcon(href) {
  document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((link) => {
    link.setAttribute("href", href);
  });
}

function getAuthToken() {
  const storedToken = readLocalStorageToken();
  if (storedToken) {
    return storedToken;
  }
  const cookieToken = readCookie(AUTH_TOKEN_COOKIE_NAME);
  if (cookieToken) {
    writeLocalStorageToken(cookieToken);
  }
  return cookieToken;
}

function setAuthToken(token) {
  writeLocalStorageToken(token);
  writeCookie(AUTH_TOKEN_COOKIE_NAME, token, AUTH_COOKIE_MAX_AGE_SECONDS);
}

function clearAuthToken() {
  removeLocalStorageToken();
  deleteCookie(AUTH_TOKEN_COOKIE_NAME);
}

function readLocalStorageToken() {
  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLocalStorageToken(token) {
  try {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch {
    // Cookie remains the fallback when localStorage is unavailable.
  }
}

function removeLocalStorageToken() {
  try {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage failures; the cookie cleanup still runs.
  }
}

function readTurnstileProofToken() {
  try {
    return window.sessionStorage.getItem(TURNSTILE_PROOF_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeTurnstileProofToken(token) {
  try {
    window.sessionStorage.setItem(TURNSTILE_PROOF_STORAGE_KEY, token);
  } catch {
    // The proof token only improves continuity across reloads.
  }
}

function clearTurnstileProofToken() {
  try {
    window.sessionStorage.removeItem(TURNSTILE_PROOF_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

function readCookie(name) {
  const prefix = `${encodeURIComponent(name)}=`;
  return (
    document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix))
      ?.slice(prefix.length) ?? null
  );
}

function writeCookie(name, value, maxAgeSeconds) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${value}; Max-Age=${maxAgeSeconds}; Path=${cookiePath()}; SameSite=Lax${secure}`;
}

function deleteCookie(name) {
  const encodedName = encodeURIComponent(name);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  for (const path of new Set([cookiePath(), "/"])) {
    document.cookie = `${encodedName}=; Max-Age=0; Path=${path}; SameSite=Lax${secure}`;
  }
}

function cookiePath() {
  const path = window.location.pathname || "/";
  if (path.endsWith("/")) {
    return path;
  }
  const slashIndex = path.lastIndexOf("/");
  return slashIndex >= 0 ? path.slice(0, slashIndex + 1) || "/" : "/";
}

async function request(path, init = {}, options = {}) {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      credentials: "omit",
      signal: controller.signal,
    });
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    throw new ApiError(
      0,
      aborted
        ? "APIの応答がタイムアウトしました。BotとAPIの起動状態を確認してください。"
        : "APIに接続できませんでした。Botと公開URLを確認してください。",
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json().catch(() => null) : null;
  const requestId = response.headers.get("x-request-id") ?? undefined;

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }
    throw new ApiError(response.status, apiErrorMessage(response.status, payload), requestId);
  }

  return payload;
}

function apiErrorMessage(status, payload) {
  const detail = isObject(payload) ? payload.detail : undefined;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const messages = detail
      .map((item) => (isObject(item) && typeof item.msg === "string" ? item.msg : null))
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join(" / ");
    }
  }
  if (status === 401) {
    return "ログインの有効期限が切れました。もう一度ログインしてください。";
  }
  if (status === 403) {
    return "この操作を実行する権限がありません。";
  }
  if (status === 502) {
    return "Discord APIまたはBotから応答を取得できませんでした。";
  }
  if (status >= 500) {
    return "APIサーバーでエラーが発生しました。時間をおいて再試行してください。";
  }
  return "APIリクエストに失敗しました。";
}

const api = {
  loginUrl(turnstileToken = "") {
    const redirectUrl = dashboardRedirectUrl();
    const params = new URLSearchParams({ dashboard_redirect_url: redirectUrl.href });
    if (turnstileToken) {
      params.set("turnstile_token", turnstileToken);
    }
    return `${API_BASE_URL}/auth/discord/login?${params.toString()}`;
  },
  turnstileConfig: () => request("/auth/turnstile/config"),
  verifyTurnstile: (token) =>
    request("/auth/turnstile/verify", {
      method: "POST",
      body: JSON.stringify({
        token,
        dashboard_redirect_url: dashboardRedirectUrl().href,
      }),
    }),
  publicStatus: () => request("/host/public-status", {}, { timeoutMs: SERVICE_STATUS_TIMEOUT_MS }),
  me: () => request("/me"),
  userActivity: () => request("/me/activity"),
  guilds: () => request("/guilds"),
  settings: (guildId) => request(`/guilds/${encodeURIComponent(guildId)}/settings`),
  featureSettings: (guildId) => request(`/guilds/${encodeURIComponent(guildId)}/feature-settings`),
  ttsOptions: (guildId) => request(`/guilds/${encodeURIComponent(guildId)}/tts-options`),
  playlist: () => request("/playlist/me"),
  addPlaylistUrl: (url) =>
    request(
      "/playlist/tracks/url",
      {
        method: "POST",
        body: JSON.stringify({ url }),
      },
      { timeoutMs: 90000 },
    ),
  uploadPlaylistMp3: (filename, contentBase64) =>
    request(
      "/playlist/tracks/upload",
      {
        method: "POST",
        body: JSON.stringify({ filename, content_base64: contentBase64 }),
      },
      { timeoutMs: 120000 },
    ),
  deletePlaylistTrack: (trackId) =>
    request(`/playlist/tracks/${encodeURIComponent(trackId)}`, {
      method: "DELETE",
    }),
  hostStatus: () => request("/host/status"),
  hostLogs: (limit = 20) => request(`/host/actions?limit=${encodeURIComponent(limit)}`),
  hostAction: (action) =>
    request("/host/actions", {
      method: "POST",
      body: JSON.stringify({ action }),
    }),
  updateSettings: (guildId, patch) =>
    request(`/guilds/${encodeURIComponent(guildId)}/settings`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  updateFeatureSettings: (guildId, patch) =>
    request(`/guilds/${encodeURIComponent(guildId)}/feature-settings`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
};

boot();

function dashboardRedirectUrl() {
  if (!["http:", "https:"].includes(window.location.protocol)) {
    const publicUrl = new URL(PUBLIC_DASHBOARD_URL);
    if (state.activeProduct === "guard") {
      publicUrl.searchParams.set("product", "guard");
    }
    return publicUrl;
  }
  const redirectUrl = new URL(window.location.href);
  redirectUrl.search = "";
  redirectUrl.hash = "";
  if (state.activeProduct === "guard") {
    redirectUrl.searchParams.set("product", "guard");
  }
  return redirectUrl;
}

async function loadAccount() {
  const requestId = state.requestIds.account + 1;
  state.requestIds.account = requestId;
  state.loading = true;
  state.message = null;
  state.guildDataError = null;
  render();

  try {
    const [me, guilds, playlist] = await Promise.all([api.me(), api.guilds(), api.playlist()]);
    if (requestId !== state.requestIds.account) {
      return;
    }
    state.user = me;
    state.guilds = guilds;
    state.playlist = normalizePlaylist(playlist);
    state.userActivity = normalizeUserActivity(null);
    const currentGuild = guilds.find((guild) => guild.id === state.selectedGuildId);
    state.selectedGuildId =
      currentGuild?.bot_present && currentGuild.can_manage
        ? state.selectedGuildId
        : (guilds.find((guild) => guild.bot_present && guild.can_manage)?.id ?? null);
    render();
    if (state.selectedGuildId && activeSettingsView() !== "user") {
      await loadGuildData(state.selectedGuildId);
    }
    if (activeSettingsView() === "host") {
      await loadHostData({ silent: true });
    }
    if (activeSettingsView() === "user") {
      void loadUserActivity({ silent: true });
    }
  } catch (error) {
    if (requestId !== state.requestIds.account) {
      return;
    }
    if (error instanceof ApiError && error.status === 401) {
      resetSessionState();
      return;
    }
    state.message = error instanceof Error ? error.message : "APIに接続できませんでした。";
  } finally {
    if (requestId === state.requestIds.account) {
      state.loading = false;
      render();
    }
  }
}

async function loadGuardAccountContext(options = {}) {
  if (!getAuthToken()) {
    return;
  }

  const requestId = state.requestIds.account + 1;
  state.requestIds.account = requestId;
  if (!options.silent) {
    state.loading = true;
    render();
  }

  try {
    const [me, guilds] = await Promise.all([api.me(), api.guilds()]);
    if (requestId !== state.requestIds.account) {
      return;
    }
    state.user = me;
    state.guilds = Array.isArray(guilds) ? guilds : [];
    const currentGuild = state.guilds.find((guild) => guild.id === state.selectedGuildId);
    state.selectedGuildId =
      currentGuild?.bot_present && currentGuild.can_manage
        ? state.selectedGuildId
        : (state.guilds.find((guild) => guild.bot_present && guild.can_manage)?.id ?? null);
    hydrateGuardVerificationForm();
    hydrateGuardModerationForm();
  } catch (error) {
    if (requestId !== state.requestIds.account) {
      return;
    }
    if (error instanceof ApiError && error.status === 401) {
      resetSessionState();
      return;
    }
    state.message = error instanceof Error ? error.message : "サーバー一覧を取得できませんでした。";
  } finally {
    if (requestId === state.requestIds.account) {
      if (!options.silent) {
        state.loading = false;
      }
      if (options.renderAfter !== false) {
        render();
      }
    }
  }
}

async function loadGuildData(guildId) {
  const requestId = state.requestIds.guildData + 1;
  state.requestIds.guildData = requestId;
  state.loading = true;
  state.message = null;
  state.guildDataError = null;
  state.ttsOptions = null;
  state.featureSettings = null;
  state.savedSettings = null;
  state.savedFeatureSettings = null;
  resetDirtyViews();
  render();

  try {
    const [settings, options, featureSettings] = await Promise.all([
      api.settings(guildId),
      api.ttsOptions(guildId),
      api.featureSettings(guildId),
    ]);
    if (requestId !== state.requestIds.guildData) {
      return;
    }
    rememberSavedSettings(settings);
    state.ttsOptions = options;
    rememberSavedFeatureSettings(featureSettings);
    render();
  } catch (error) {
    if (requestId !== state.requestIds.guildData) {
      return;
    }
    state.guildDataError = error instanceof Error ? error.message : "サーバー設定を取得できませんでした。";
    state.message = state.guildDataError;
  } finally {
    if (requestId === state.requestIds.guildData) {
      state.loading = false;
      render();
    }
  }
}

async function loadServiceStatus(options = {}) {
  const requestId = state.requestIds.serviceStatus + 1;
  state.requestIds.serviceStatus = requestId;
  const wasMaintenance = serviceMaintenanceActive() || state.serviceStatus.loading;
  state.serviceStatus = {
    ...state.serviceStatus,
    loading: !options.silent,
    error: null,
  };
  if (!options.silent) {
    render();
  }

  try {
    const status = await api.publicStatus();
    if (requestId !== state.requestIds.serviceStatus) {
      return;
    }
    state.serviceStatus = normalizeServiceStatus(status);
  } catch (error) {
    if (requestId !== state.requestIds.serviceStatus) {
      return;
    }
    state.serviceStatus = normalizeServiceStatus({
      api_online: false,
      bot_online: false,
      maintenance: true,
      bot_stale: true,
      checked_at: new Date().toISOString(),
    });
    state.serviceStatus.error = error instanceof Error ? error.message : "APIの起動状態を確認できませんでした。";
  } finally {
    if (requestId === state.requestIds.serviceStatus) {
      render();
      if (wasMaintenance && !serviceMaintenanceActive() && options.hydrate !== false) {
        void ensureInteractiveWhenServiceOnline();
      }
    }
  }
}

async function refreshServiceStatus() {
  await loadServiceStatus({ hydrate: false });
  if (!serviceMaintenanceActive()) {
    await ensureInteractiveWhenServiceOnline();
  }
}

async function ensureInteractiveWhenServiceOnline() {
  if (state.serviceStatus.loading || serviceMaintenanceActive()) {
    return;
  }
  if (!state.user && state.security.loading) {
    await loadTurnstileConfig();
  }
  if (getAuthToken() && !state.user && !state.loading) {
    await loadAccount();
  }
}

async function loadHostData(options = {}) {
  const requestId = state.requestIds.host + 1;
  state.requestIds.host = requestId;
  state.hostLoading = !options.silent;
  state.hostError = null;
  if (!options.keepMessage) {
    state.hostMessage = null;
  }
  render();

  try {
    const [status, logs] = await Promise.all([api.hostStatus(), api.hostLogs(12)]);
    if (requestId !== state.requestIds.host) {
      return;
    }
    state.hostStatus = normalizeHostStatus(status);
    state.hostLogs = Array.isArray(logs) ? logs : [];
    state.hostLastUpdatedAt = new Date().toISOString();
  } catch (error) {
    if (requestId !== state.requestIds.host) {
      return;
    }
    state.hostError = error instanceof Error ? error.message : "管理者用情報を取得できませんでした。";
  } finally {
    if (requestId === state.requestIds.host) {
      state.hostLoading = false;
      render();
    }
  }
}

async function loadPlaylist(options = {}) {
  if (!state.user) {
    return;
  }
  const requestId = state.requestIds.playlist + 1;
  state.requestIds.playlist = requestId;
  state.playlistLoading = !options.silent;
  state.playlistError = null;
  if (!options.keepMessage) {
    state.playlistMessage = null;
  }
  render();

  try {
    const playlist = await api.playlist();
    if (requestId !== state.requestIds.playlist) {
      return;
    }
    state.playlist = normalizePlaylist(playlist);
  } catch (error) {
    if (requestId !== state.requestIds.playlist) {
      return;
    }
    state.playlistError = error instanceof Error ? error.message : "プレイリストを取得できませんでした。";
  } finally {
    if (requestId === state.requestIds.playlist) {
      state.playlistLoading = false;
      render();
    }
  }
}

async function loadUserActivity(options = {}) {
  if (!state.user) {
    return;
  }
  const requestId = state.requestIds.activity + 1;
  state.requestIds.activity = requestId;
  state.userActivityLoading = !options.silent;
  state.userActivityError = null;
  render();

  try {
    const activity = await api.userActivity();
    if (requestId !== state.requestIds.activity) {
      return;
    }
    state.userActivity = normalizeUserActivity(activity);
  } catch (error) {
    if (requestId !== state.requestIds.activity) {
      return;
    }
    state.userActivityError = error instanceof Error ? error.message : "アクティビティを取得できませんでした。";
  } finally {
    if (requestId === state.requestIds.activity) {
      state.userActivityLoading = false;
      render();
    }
  }
}

async function addPlaylistUrl() {
  const url = state.playlistUrl.trim();
  if (!url) {
    state.playlistError = "YouTubeなどのURLを入力してください。";
    state.playlistMessage = null;
    render();
    return;
  }
  state.playlistSaving = true;
  state.playlistError = null;
  state.playlistMessage = null;
  render();
  try {
    const playlist = await api.addPlaylistUrl(url);
    state.playlist = normalizePlaylist(playlist);
    state.playlistUrl = "";
  } catch (error) {
    state.playlistError = error instanceof Error ? error.message : "URLの登録に失敗しました。";
  } finally {
    state.playlistSaving = false;
    render();
  }
}

async function uploadPlaylistFile(file) {
  if (!file) {
    return;
  }
  if (!file.name.toLowerCase().endsWith(".mp3")) {
    state.playlistError = "mp3ファイルを選択してください。";
    state.playlistMessage = null;
    render();
    return;
  }
  state.playlistSaving = true;
  state.playlistError = null;
  state.playlistMessage = null;
  render();
  try {
    const contentBase64 = await readFileAsBase64(file);
    const playlist = await api.uploadPlaylistMp3(file.name, contentBase64);
    state.playlist = normalizePlaylist(playlist);
  } catch (error) {
    state.playlistError = error instanceof Error ? error.message : "mp3の登録に失敗しました。";
  } finally {
    state.playlistSaving = false;
    state.playlistDragActive = false;
    render();
  }
}

async function deletePlaylistTrack(trackId) {
  state.playlistSaving = true;
  state.playlistError = null;
  state.playlistMessage = null;
  render();
  try {
    const playlist = await api.deletePlaylistTrack(trackId);
    state.playlist = normalizePlaylist(playlist);
  } catch (error) {
    state.playlistError = error instanceof Error ? error.message : "削除に失敗しました。";
  } finally {
    state.playlistSaving = false;
    render();
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const value = String(reader.result ?? "");
      resolve(value.includes(",") ? value.split(",").pop() : value);
    });
    reader.addEventListener("error", () => reject(new Error("ファイルを読み取れませんでした。")));
    reader.readAsDataURL(file);
  });
}

function normalizeHostStatus(status) {
  return {
    ...status,
    api_latency_ms: Number(status?.api_latency_ms ?? 0),
    root_dir: status?.root_dir ?? "",
    data_dir_total_bytes: Number(status?.data_dir_total_bytes ?? 0),
    data_dir_used_bytes: Number(status?.data_dir_used_bytes ?? 0),
    data_stats: {
      guild_settings_count: 0,
      tts_settings_count: 0,
      tts_voice_cache_count: 0,
      audit_log_bytes: 0,
      session_store_bytes: 0,
      host_control_log_bytes: 0,
      ...(status?.data_stats ?? {}),
    },
    configuration: {
      api_host: "",
      dashboard_allowed_origins: [],
      host_control_enabled: false,
      host_control_allowed_user_count: 0,
      jwt_access_token_minutes: 0,
      session_ttl_seconds: 0,
      upnp_lease_seconds: 0,
      ...(status?.configuration ?? {}),
    },
    bot_status: status?.bot_status ?? null,
  };
}

function normalizeServiceStatus(status) {
  const apiOnline = Boolean(status?.api_online);
  const botOnline = Boolean(status?.bot_online);
  const maintenance = Boolean(status?.maintenance ?? !botOnline);
  return {
    loading: false,
    apiOnline,
    botOnline,
    maintenance,
    botStale: Boolean(status?.bot_stale ?? !botOnline),
    botStatusUpdatedAt: status?.bot_status_updated_at ?? null,
    checkedAt: status?.checked_at ?? new Date().toISOString(),
    error: null,
  };
}

function serviceMaintenanceActive() {
  return !state.serviceStatus.loading && state.serviceStatus.maintenance;
}

function serviceCheckingActive() {
  return state.serviceStatus.loading && !state.user;
}

function guardMaintenanceActive() {
  return (
    state.guard.source === "api-error" ||
    (!state.guard.loading && (!state.guard.status.online || state.guard.status.stale))
  );
}

function guardCheckingActive() {
  return state.guard.loading && !state.guard.loadedAt;
}

function guardStatusOnlyActive() {
  return guardCheckingActive() || guardMaintenanceActive();
}

function shouldAutoRefreshServiceStatus() {
  return !document.hidden;
}

function syncServiceStatusRefresh() {
  if (shouldAutoRefreshServiceStatus()) {
    if (!serviceStatusRefreshTimerId) {
      serviceStatusRefreshTimerId = window.setInterval(() => {
        if (!state.serviceStatus.loading && shouldAutoRefreshServiceStatus()) {
          void loadServiceStatus({ silent: true });
        }
      }, SERVICE_STATUS_REFRESH_INTERVAL_MS);
    }
    return;
  }
  if (serviceStatusRefreshTimerId) {
    window.clearInterval(serviceStatusRefreshTimerId);
    serviceStatusRefreshTimerId = null;
  }
}

function shouldAutoRefreshGuardStatus() {
  return state.activeProduct === "guard" && !document.hidden;
}

function syncGuardStatusRefresh() {
  if (shouldAutoRefreshGuardStatus()) {
    if (!guardStatusRefreshTimerId) {
      guardStatusRefreshTimerId = window.setInterval(() => {
        if (!state.guard.loading && shouldAutoRefreshGuardStatus()) {
          void loadGuardData({ silent: true });
        }
      }, GUARD_STATUS_REFRESH_INTERVAL_MS);
    }
    return;
  }
  if (guardStatusRefreshTimerId) {
    window.clearInterval(guardStatusRefreshTimerId);
    guardStatusRefreshTimerId = null;
  }
}

function shouldAutoRefreshHost() {
  return Boolean(
    state.user &&
      activeSettingsView() === "host" &&
      !document.hidden,
  );
}

function syncHostAutoRefresh() {
  if (shouldAutoRefreshHost()) {
    if (!hostRefreshTimerId) {
      hostRefreshTimerId = window.setInterval(() => {
        if (!state.hostLoading && !state.hostActionRunning && shouldAutoRefreshHost()) {
          void loadHostData({ silent: true, keepMessage: true });
        }
      }, HOST_REFRESH_INTERVAL_MS);
    }
    return;
  }
  if (hostRefreshTimerId) {
    window.clearInterval(hostRefreshTimerId);
    hostRefreshTimerId = null;
  }
}

async function runHostAction(action) {
  state.hostActionRunning = action;
  state.hostError = null;
  state.hostMessage = null;
  render();

  try {
    const result = await api.hostAction(action);
    state.hostMessage = result?.message ?? "操作を実行しました。";
    await loadHostData({ silent: true, keepMessage: true });
  } catch (error) {
    state.hostError = error instanceof Error ? error.message : "管理者用操作に失敗しました。";
  } finally {
    state.hostActionRunning = null;
    render();
  }
}

function normalizeDashboardSettings(settings) {
  return {
    ...settings,
    tts_enabled: Boolean(settings.tts_enabled),
    tts_pitch: clampNumber(settings.tts_pitch ?? 0, -1, 1),
    tts_intonation: clampNumber(settings.tts_intonation ?? 1, 0, 2),
    tts_max_text_length: clampInteger(
      settings.tts_max_text_length ?? TTS_TEXT_LENGTH_DEFAULT,
      TTS_TEXT_LENGTH_MIN,
      TTS_TEXT_LENGTH_MAX,
    ),
    tts_read_sender: settings.tts_read_sender !== false,
    tts_keep_panel_bottom: Boolean(settings.tts_keep_panel_bottom),
    user_dictionary: Array.isArray(settings.user_dictionary) ? settings.user_dictionary : [],
    auto_join_rules: Array.isArray(settings.auto_join_rules)
      ? settings.auto_join_rules.map(normalizeAutoJoinRule)
      : [],
  };
}

function normalizeAutoJoinRule(rule) {
  return {
    voice_channel_id: rule?.voice_channel_id ?? "",
    text_channel_id: rule?.text_channel_id ?? "",
    read_voice_channel_chat: Boolean(rule?.read_voice_channel_chat),
  };
}

function normalizeFeatureSettings(featureSettings) {
  return {
    ...featureSettings,
    welcome_message: normalizeWelcomeMessageSettings(featureSettings?.welcome_message),
    global_chat_channel_id: normalizeNullableString(featureSettings?.global_chat_channel_id) ?? "",
    sticky_messages: Array.isArray(featureSettings?.sticky_messages)
      ? featureSettings.sticky_messages
      : [],
    vc_notification: normalizeVcNotificationSettings(featureSettings?.vc_notification),
  };
}

function normalizePlaylist(playlist) {
  return {
    user_id: String(playlist?.user_id ?? state.user?.discord_user_id ?? ""),
    tracks: Array.isArray(playlist?.tracks) ? playlist.tracks.map(normalizePlaylistTrack) : [],
    updated_at: playlist?.updated_at ?? null,
  };
}

function normalizeUserActivity(activity) {
  return {
    user_id: String(activity?.user_id ?? state.user?.discord_user_id ?? ""),
    generated_at: activity?.generated_at ?? null,
    daily: normalizeUserActivityPoints(activity?.daily),
    weekly: normalizeUserActivityPoints(activity?.weekly),
    monthly: normalizeUserActivityPoints(activity?.monthly),
  };
}

function normalizeUserActivityPoints(points) {
  return Array.isArray(points) ? points.map(normalizeUserActivityPoint) : [];
}

function normalizeUserActivityPoint(point) {
  return {
    label: String(point?.label ?? ""),
    start_date: String(point?.start_date ?? ""),
    end_date: String(point?.end_date ?? ""),
    vc_seconds: Math.max(0, Math.trunc(Number(point?.vc_seconds) || 0)),
    message_count: Math.max(0, Math.trunc(Number(point?.message_count) || 0)),
    character_count: Math.max(0, Math.trunc(Number(point?.character_count) || 0)),
  };
}

function normalizePlaylistTrack(track) {
  return {
    id: String(track?.id ?? ""),
    source_type: track?.source_type === "upload" ? "upload" : "url",
    title: String(track?.title ?? "Untitled"),
    webpage_url: normalizeNullableString(track?.webpage_url),
    duration: Number.isFinite(Number(track?.duration)) ? Number(track.duration) : null,
    thumbnail: normalizeNullableString(track?.thumbnail),
    preview_url: normalizeNullableString(track?.preview_url),
    original_filename: normalizeNullableString(track?.original_filename),
    created_at: track?.created_at ?? null,
  };
}

function normalizeWelcomeMessageSettings(settings) {
  return {
    enabled: Boolean(settings?.enabled),
    channel_id: normalizeNullableString(settings?.channel_id) ?? "",
    message: String(settings?.message ?? "").trim(),
  };
}

function normalizeVcNotificationSettings(settings) {
  return {
    reaction_channel_id: normalizeNullableString(settings?.reaction_channel_id) ?? "",
    notification_channel_id: normalizeNullableString(settings?.notification_channel_id) ?? "",
    reaction_message_id: normalizeNullableString(settings?.reaction_message_id) ?? "",
    emoji: String(settings?.emoji ?? "").trim(),
    role_id: normalizeNullableString(settings?.role_id) ?? "",
  };
}

function cloneState(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function rememberSavedSettings(settings) {
  state.settings = normalizeDashboardSettings(settings);
  state.savedSettings = cloneState(state.settings);
  state.dirtyViews.tts = false;
}

function rememberSavedFeatureSettings(featureSettings) {
  state.featureSettings = normalizeFeatureSettings(featureSettings);
  state.savedFeatureSettings = cloneState(state.featureSettings);
  state.dirtyViews.features = false;
}

function resetDirtyViews() {
  state.dirtyViews = {
    tts: false,
    features: false,
    guardVerification: false,
    guardModeration: false,
    guardLogging: false,
  };
  clearPendingNavigation();
}

function comparableSettings(settings) {
  if (!settings) {
    return null;
  }
  return {
    tts_enabled: Boolean(settings.tts_enabled),
    tts_engine: settings.tts_engine,
    tts_speaker: settings.tts_speaker,
    tts_volume: settings.tts_volume,
    tts_speed: settings.tts_speed,
    tts_pitch: clampNumber(settings.tts_pitch, -1, 1),
    tts_intonation: clampNumber(settings.tts_intonation, 0, 2),
    tts_max_text_length: clampInteger(
      settings.tts_max_text_length,
      TTS_TEXT_LENGTH_MIN,
      TTS_TEXT_LENGTH_MAX,
    ),
    tts_read_sender: settings.tts_read_sender !== false,
    tts_keep_panel_bottom: Boolean(settings.tts_keep_panel_bottom),
    voice_join_announce_enabled: settings.voice_join_announce_enabled,
    voice_move_announce_enabled: settings.voice_move_announce_enabled,
    user_dictionary: (settings.user_dictionary ?? []).map((entry) => ({
      word: entry.word,
      reading: entry.reading,
    })),
    auto_join_rules: (settings.auto_join_rules ?? []).map((rule) => ({
      voice_channel_id: rule.voice_channel_id,
      text_channel_id: rule.text_channel_id ?? "",
      read_voice_channel_chat: Boolean(rule.read_voice_channel_chat),
    })),
  };
}

function comparableFeatureSettings(featureSettings) {
  if (!featureSettings) {
    return null;
  }
  const vcNotification = comparableVcNotificationSettings(featureSettings.vc_notification);
  return {
    welcome_message: comparableWelcomeMessageSettings(featureSettings.welcome_message),
    global_chat_channel_id: normalizeNullableString(featureSettings.global_chat_channel_id),
    sticky_messages: (featureSettings.sticky_messages ?? []).map((rule) => ({
      channel_id: rule.channel_id,
      content: rule.content,
    })),
    vc_notification: vcNotification,
  };
}

function comparableWelcomeMessageSettings(settings) {
  const normalized = normalizeWelcomeMessageSettings(settings);
  if (!normalized.enabled && !normalized.channel_id && !normalized.message) {
    return null;
  }
  return {
    enabled: normalized.enabled,
    channel_id: normalizeNullableString(normalized.channel_id),
    message: normalized.message,
  };
}

function comparableVcNotificationSettings(settings) {
  const normalized = normalizeVcNotificationSettings(settings);
  const hasAnyValue = Object.values(normalized).some((value) => String(value).trim());
  if (!hasAnyValue) {
    return null;
  }
  return {
    reaction_channel_id: normalizeNullableString(normalized.reaction_channel_id),
    notification_channel_id: normalizeNullableString(normalized.notification_channel_id),
    reaction_message_id: normalizeNullableString(normalized.reaction_message_id),
    emoji: normalized.emoji,
    role_id: normalizeNullableString(normalized.role_id),
  };
}

function normalizeGuardVerificationForm(form) {
  return {
    guild_id: String(form?.guild_id ?? ""),
    enabled: form?.enabled !== false,
    button_channel_lock_enabled: form?.button_channel_lock_enabled !== false,
    button_channel_id: String(form?.button_channel_id ?? ""),
    log_channel_id: String(form?.log_channel_id ?? ""),
    role_id: String(form?.role_id ?? ""),
    duplicate_action: normalizeGuardDuplicateAction(form?.duplicate_action),
  };
}

function guardVerificationFormFromSettings(guildId) {
  const resolvedGuildId = String(guildId ?? "");
  const settings = state.guard.verificationSettings.find((item) => item.guild_id === resolvedGuildId);
  return normalizeGuardVerificationForm({
    guild_id: resolvedGuildId,
    enabled: settings?.enabled ?? true,
    button_channel_lock_enabled: settings?.button_channel_lock_enabled ?? true,
    button_channel_id: settings?.button_channel_id ?? "",
    log_channel_id: settings?.log_channel_id ?? "",
    role_id: settings?.role_id ?? "",
    duplicate_action: settings?.duplicate_action ?? "notify",
  });
}

function guardModerationFormFromSettings(guildId) {
  const resolvedGuildId = String(guildId ?? "");
  const settings = state.guard.moderationSettings.find((item) => item.guild_id === resolvedGuildId);
  return normalizeGuardModerationForm({
    guild_id: resolvedGuildId,
    features: settings?.features ?? {},
  });
}

function guardLoggingFormFromSettings(guildId) {
  const resolvedGuildId = String(guildId ?? "");
  const settings = state.guard.loggingSettings.find((item) => item.guild_id === resolvedGuildId);
  return normalizeGuardLoggingForm({
    guild_id: resolvedGuildId,
    events: settings?.events ?? {},
  });
}

function rememberSavedGuardVerificationForm(form) {
  const normalized = normalizeGuardVerificationForm(form);
  state.guard.verificationForm = cloneState(normalized);
  state.guard.savedVerificationForm = cloneState(normalized);
  state.dirtyViews.guardVerification = false;
}

function rememberSavedGuardModerationForm(form) {
  const normalized = normalizeGuardModerationForm(form);
  state.guard.moderationForm = cloneState(normalized);
  state.guard.savedModerationForm = cloneState(normalized);
  state.dirtyViews.guardModeration = false;
}

function rememberSavedGuardLoggingForm(form) {
  const normalized = normalizeGuardLoggingForm(form);
  state.guard.loggingForm = cloneState(normalized);
  state.guard.savedLoggingForm = cloneState(normalized);
  state.dirtyViews.guardLogging = false;
}

function comparableGuardVerificationForm(form) {
  if (!form) {
    return null;
  }
  return normalizeGuardVerificationForm(form);
}

function comparableGuardModerationForm(form) {
  if (!form) {
    return null;
  }
  return normalizeGuardModerationForm(form);
}

function comparableGuardLoggingForm(form) {
  if (!form) {
    return null;
  }
  return normalizeGuardLoggingForm(form);
}

function updateDirtyState(view) {
  if (view === "guardVerification") {
    state.dirtyViews.guardVerification =
      JSON.stringify(comparableGuardVerificationForm(state.guard.verificationForm)) !==
      JSON.stringify(comparableGuardVerificationForm(state.guard.savedVerificationForm));
  } else if (view === "guardModeration") {
    state.dirtyViews.guardModeration =
      JSON.stringify(comparableGuardModerationForm(state.guard.moderationForm)) !==
      JSON.stringify(comparableGuardModerationForm(state.guard.savedModerationForm));
  } else if (view === "guardLogging") {
    state.dirtyViews.guardLogging =
      JSON.stringify(comparableGuardLoggingForm(state.guard.loggingForm)) !==
      JSON.stringify(comparableGuardLoggingForm(state.guard.savedLoggingForm));
  } else if (view === "features") {
    state.dirtyViews.features =
      JSON.stringify(comparableFeatureSettings(state.featureSettings)) !==
      JSON.stringify(comparableFeatureSettings(state.savedFeatureSettings));
  } else {
    state.dirtyViews.tts =
      JSON.stringify(comparableSettings(state.settings)) !==
      JSON.stringify(comparableSettings(state.savedSettings));
  }
  syncDirtyControls();
}

function isViewDirty(view) {
  return Boolean(state.dirtyViews[view]);
}

function hasUnsavedChanges() {
  if (state.activeProduct === "guard") {
    return isViewDirty(activeGuardDirtyView());
  }
  const view = activeSettingsView();
  return (view === "tts" || view === "features") && isViewDirty(view);
}

function activeGuardDirtyView() {
  const featureId = activeGuardFeature().id;
  if (featureId === "moderation") {
    return "guardModeration";
  }
  if (featureId === "logging") {
    return "guardLogging";
  }
  return "guardVerification";
}

function syncDirtyControls() {
  root.querySelectorAll("[data-save-view]").forEach((button) => {
    const view = button instanceof HTMLElement ? button.dataset.saveView : "";
    button.classList.toggle("save-button--dirty", isViewDirty(view));
  });
}

async function savePatch(patch, applyUpdatedSettings = rememberSavedSettings) {
  if (!state.selectedGuildId) {
    return false;
  }
  const requestId = state.requestIds.save + 1;
  state.requestIds.save = requestId;
  state.saving = true;
  state.message = null;
  render();

  let saved = false;
  try {
    const updated = await api.updateSettings(state.selectedGuildId, patch);
    if (requestId === state.requestIds.save) {
      applyUpdatedSettings(updated);
      clearPendingNavigation();
      saved = true;
    }
  } catch (error) {
    if (requestId === state.requestIds.save) {
      state.message = error instanceof Error ? error.message : "保存に失敗しました。";
    }
  } finally {
    if (requestId === state.requestIds.save) {
      state.saving = false;
      render();
    }
  }
  return saved;
}

async function saveSettings() {
  if (!state.settings) {
    return false;
  }
  return savePatch(
    {
      tts_enabled: Boolean(state.settings.tts_enabled),
      tts_engine: state.settings.tts_engine,
      tts_speaker: state.settings.tts_speaker,
      tts_volume: state.settings.tts_volume,
      tts_speed: state.settings.tts_speed,
      tts_pitch: clampNumber(state.settings.tts_pitch, -1, 1),
      tts_intonation: clampNumber(state.settings.tts_intonation, 0, 2),
      tts_max_text_length: clampInteger(
        state.settings.tts_max_text_length,
        TTS_TEXT_LENGTH_MIN,
        TTS_TEXT_LENGTH_MAX,
      ),
      tts_read_sender: state.settings.tts_read_sender !== false,
      tts_keep_panel_bottom: Boolean(state.settings.tts_keep_panel_bottom),
      voice_join_announce_enabled: state.settings.voice_join_announce_enabled,
      voice_move_announce_enabled: state.settings.voice_move_announce_enabled,
      user_dictionary: state.settings.user_dictionary.filter((entry) => entry.word.trim() && entry.reading.trim()),
      auto_join_rules: state.settings.auto_join_rules
        .map(normalizeAutoJoinRule)
        .filter((rule) => rule.voice_channel_id && (rule.text_channel_id || rule.read_voice_channel_chat))
        .map((rule) => ({
          voice_channel_id: rule.voice_channel_id,
          text_channel_id: rule.text_channel_id || null,
          read_voice_channel_chat: rule.read_voice_channel_chat,
        })),
    },
  );
}

async function saveFeatureSettings() {
  if (!state.selectedGuildId || !state.featureSettings) {
    return false;
  }
  const requestId = state.requestIds.save + 1;
  state.requestIds.save = requestId;
  state.saving = true;
  state.message = null;
  render();

  let saved = false;
  try {
    const updated = await api.updateFeatureSettings(state.selectedGuildId, {
      welcome_message: buildWelcomeMessagePatch(state.featureSettings.welcome_message),
      global_chat_channel_id: normalizeNullableString(state.featureSettings.global_chat_channel_id),
      sticky_messages: state.featureSettings.sticky_messages
        .map((rule) => ({
          channel_id: rule.channel_id,
          content: rule.content.trim(),
        }))
        .filter((rule) => rule.channel_id && rule.content),
      vc_notification: buildVcNotificationPatch(state.featureSettings.vc_notification),
    });
    if (requestId === state.requestIds.save) {
      rememberSavedFeatureSettings(updated);
      clearPendingNavigation();
      saved = true;
    }
  } catch (error) {
    if (requestId === state.requestIds.save) {
      state.message = error instanceof Error ? error.message : "保存に失敗しました。";
    }
  } finally {
    if (requestId === state.requestIds.save) {
      state.saving = false;
      render();
    }
  }
  return saved;
}

function buildWelcomeMessagePatch(settings) {
  const normalized = normalizeWelcomeMessageSettings(settings);
  if (!normalized.enabled && !normalized.channel_id && !normalized.message) {
    return null;
  }
  const canEnable = Boolean(normalized.channel_id && normalized.message);
  return {
    enabled: Boolean(normalized.enabled && canEnable),
    channel_id: normalized.channel_id || null,
    message: normalized.message,
  };
}

function buildVcNotificationPatch(settings) {
  const normalized = normalizeVcNotificationSettings(settings);
  const hasAnyValue = Object.values(normalized).some((value) => String(value).trim());
  if (!hasAnyValue) {
    return null;
  }
  return {
    reaction_channel_id: normalized.reaction_channel_id || null,
    notification_channel_id: normalized.notification_channel_id || null,
    reaction_message_id: normalized.reaction_message_id || null,
    emoji: normalized.emoji,
    role_id: normalized.role_id || null,
  };
}

async function logout() {
  state.requestIds.account += 1;
  state.requestIds.guildData += 1;
  state.requestIds.save += 1;
  state.requestIds.playlist += 1;
  await api.logout().catch(() => undefined);
  clearAuthToken();
  clearTurnstileProofToken();
  resetSessionState();
}

async function loadTurnstileConfig(options = {}) {
  state.security.loading = true;
  state.security.error = null;
  if (!options.silent) {
    render();
  }
  try {
    const config = await api.turnstileConfig();
    state.security.enabled = Boolean(config?.enabled);
    state.security.siteKey = String(config?.site_key ?? "");
    if (!state.security.enabled) {
      clearTurnstileProofToken();
      state.security.proofToken = "";
      state.security.verified = false;
      state.security.message = null;
    } else if (!state.security.proofToken) {
      state.security.verified = false;
    }
  } catch (error) {
    state.security.enabled = false;
    state.security.siteKey = "";
    state.security.proofToken = "";
    state.security.verified = false;
    state.security.error = null;
  } finally {
    state.security.loading = false;
    if (options.renderAfter !== false) {
      render();
    }
  }
}

async function handleTurnstileToken(token) {
  if (!token) {
    state.security.error = "セキュリティ検証トークンを取得できませんでした。";
    render();
    return;
  }
  state.security.verifying = true;
  state.security.error = null;
  state.security.message = "検証中です。";
  render();
  try {
    const result = await api.verifyTurnstile(token);
    if (!result?.verified) {
      throw new Error("セキュリティ検証に失敗しました。もう一度お試しください。");
    }
    const proofToken = String(result.turnstile_token ?? "");
    state.security.proofToken = proofToken;
    state.security.verified = true;
    state.security.message = "検証が完了しました。Discordでログインできます。";
    state.security.error = null;
    if (proofToken) {
      writeTurnstileProofToken(proofToken);
    }
  } catch (error) {
    clearTurnstileProofToken();
    state.security.proofToken = "";
    state.security.verified = false;
    state.security.error =
      error instanceof Error ? error.message : "セキュリティ検証に失敗しました。もう一度お試しください。";
    state.security.message = null;
  } finally {
    state.security.verifying = false;
    render();
  }
}

function loadTurnstileScript() {
  if (window.turnstile?.render) {
    return Promise.resolve(window.turnstile);
  }
  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${TURNSTILE_SCRIPT_URL}"]`);
      const script = existing instanceof HTMLScriptElement ? existing : document.createElement("script");
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", () => resolve(window.turnstile), { once: true });
      script.addEventListener("error", () => reject(new Error("Turnstileを読み込めませんでした。")), { once: true });
      if (!existing) {
        document.head.append(script);
      }
    });
  }
  return turnstileScriptPromise;
}

function syncTurnstileWidget() {
  const container = root.querySelector("[data-turnstile-widget]");
  if (
    !(container instanceof HTMLElement) ||
    !state.security.enabled ||
    state.security.loading ||
    state.security.verified ||
    state.security.verifying ||
    !state.security.siteKey ||
    container.dataset.rendered === "true"
  ) {
    return;
  }

  void loadTurnstileScript()
    .then((turnstile) => {
      if (!window.document.body.contains(container) || container.dataset.rendered === "true") {
        return;
      }
      if (!turnstile?.render) {
        throw new Error("Turnstileを初期化できませんでした。");
      }
      container.dataset.rendered = "true";
      state.security.widgetId = turnstile.render(container, {
        sitekey: state.security.siteKey,
        theme: "dark",
        action: "login",
        callback: (token) => {
          void handleTurnstileToken(token);
        },
        "expired-callback": () => {
          clearTurnstileProofToken();
          state.security.proofToken = "";
          state.security.verified = false;
          state.security.message = null;
          state.security.error = "検証の有効期限が切れました。もう一度お試しください。";
          render();
        },
        "error-callback": () => {
          clearTurnstileProofToken();
          state.security.proofToken = "";
          state.security.verified = false;
          state.security.message = null;
          state.security.error = "検証中にエラーが発生しました。ページを更新して再試行してください。";
          render();
        },
      });
    })
    .catch((error) => {
      state.security.error =
        error instanceof Error ? error.message : "Turnstileを読み込めませんでした。";
      render();
    });
}

function resetSessionState() {
  state.user = null;
  state.guilds = [];
  state.selectedGuildId = null;
  state.settings = null;
  state.savedSettings = null;
  state.featureSettings = null;
  state.savedFeatureSettings = null;
  state.ttsOptions = null;
  state.guildDataError = null;
  state.hostStatus = null;
  state.hostLogs = [];
  state.hostError = null;
  state.hostMessage = null;
  state.hostLoading = false;
  state.hostActionRunning = null;
  state.hostLastUpdatedAt = null;
  state.playlist = null;
  state.playlistLoading = false;
  state.playlistSaving = false;
  state.playlistError = null;
  state.playlistMessage = null;
  state.playlistUrl = "";
  state.playlistDragActive = false;
  state.userActivity = null;
  state.userActivityLoading = false;
  state.userActivityError = null;
  state.activeActivityPeriod = "daily";
  resetDirtyViews();
  render();
}

function selectedGuild() {
  return state.guilds.find((guild) => guild.id === state.selectedGuildId) ?? null;
}

function selectedGuildCanConfigure() {
  const guild = selectedGuild();
  return Boolean(guild?.bot_present && guild.can_manage);
}

function canViewHostAdmin() {
  return String(state.user?.discord_user_id ?? "") === HOST_CONTROL_ADMIN_DISCORD_USER_ID;
}

function visibleSettingsPages() {
  return SETTINGS_PAGES.filter((page) => page.view !== "host" || canViewHostAdmin());
}

function defaultServerPageId() {
  return visibleSettingsPages()[0]?.id ?? SERVER_DEFAULT_PAGE;
}

function render() {
  stopPlaylistProgressLoop();
  const serviceOnly = state.activeProduct === "one" && serviceStatusOnlyActive();
  const mainContent = renderMainContent();
  const guardOnly = state.activeProduct === "guard" && mainContent.includes("data-service-status");
  const statusOnly = serviceOnly || guardOnly;
  const shellClasses = ["app-shell"];
  if (state.activeProduct === "guard") {
    shellClasses.push("app-shell--guard");
  }
  if (state.productTransition) {
    const transitionShouldAnimate = !state.productTransition.rendered;
    shellClasses.push(
      `app-shell--product-from-${state.productTransition.from}`,
      `app-shell--product-to-${state.productTransition.to}`,
    );
    if (transitionShouldAnimate) {
      shellClasses.push("app-shell--product-transition");
    }
  }
  if (hasPendingNavigation() && hasUnsavedChanges()) {
    shellClasses.push("app-shell--with-unsaved-bar");
  }
  root.innerHTML = `
    <div class="${shellClasses.join(" ")}">
      ${renderTopbar()}
      <main class="dashboard">
        ${mainContent}
      </main>
      ${statusOnly ? "" : renderStatusToasts()}
      ${statusOnly ? "" : renderUnsavedChangesPrompt()}
    </div>
  `;
  updateDocumentForProduct();
  if (state.productTransition && !state.productTransition.rendered) {
    state.productTransition = { ...state.productTransition, rendered: true };
  }
  document.body.classList.toggle("body--status-only", statusOnly);
  if (state.activeProduct === "one") {
    syncServiceStatusRefresh();
    syncHostAutoRefresh();
    syncTurnstileWidget();
    syncPlaylistPlayers();
  } else if (state.activeProduct === "guard") {
    syncGuardStatusRefresh();
  }
}

function renderMainContent() {
  if (state.activeProduct === "guard") {
    if (guardCheckingActive()) {
      return renderServiceStatusPanel("checking");
    }
    if (guardMaintenanceActive()) {
      return renderServiceStatusPanel("maintenance");
    }
    return renderGuardDashboard();
  }
  if (serviceCheckingActive()) {
    return renderServiceStatusPanel("checking");
  }
  if (serviceMaintenanceActive()) {
    return renderServiceStatusPanel("maintenance");
  }
  return state.user ? renderDashboard() : renderLoginPanel();
}

function serviceStatusOnlyActive() {
  return serviceCheckingActive() || serviceMaintenanceActive();
}

function renderTopbar() {
  const loginState = loginButtonState();
  const product = PRODUCT_META[state.activeProduct] ?? PRODUCT_META.one;
  const guardProduct = state.activeProduct === "guard";
  return `
    <header class="topbar">
      <div class="brand">
        <img class="brand__mascot" src="${escapeAttribute(product.iconUrl)}" alt="" />
        <div>
          <h1>${escapeHtml(product.label)}</h1>
          <p>${escapeHtml(product.subtitle)}</p>
        </div>
      </div>
      <nav class="topbar__actions" aria-label="Dashboard actions">
        ${renderProductSwitcher()}
        ${
          state.user
            ? `
              <a class="icon-button icon-button--ghost" href="${SUPPORT_SERVER_URL}" target="_blank" rel="noreferrer">
                ${icon("external")}<span>サポートサーバー</span>
              </a>
              <div class="user-chip">
                ${
                  state.user.avatar_url
                    ? `<img src="${escapeAttribute(state.user.avatar_url)}" alt="" />`
                    : icon("user")
                }
                <span>${escapeHtml(state.user.username)}</span>
              </div>
              <button class="icon-button icon-button--ghost" type="button" data-action="logout">
                ${icon("logout")}<span>ログアウト</span>
              </button>
            `
            : guardProduct
            ? `
              <a class="icon-button icon-button--ghost" href="${SUPPORT_SERVER_URL}" target="_blank" rel="noreferrer">
                ${icon("external")}<span>サポートサーバー</span>
              </a>
              <button class="icon-button icon-button--primary" type="button" data-action="login" ${guardLoginBlocked() ? "disabled" : ""}>
                ${icon(guardLoginButtonState().icon)}<span>${guardLoginButtonState().label}</span>
              </button>
            `
            : `
              <a class="icon-button icon-button--ghost" href="${SUPPORT_SERVER_URL}" target="_blank" rel="noreferrer">
                ${icon("external")}<span>サポートサーバー</span>
              </a>
              <button class="icon-button icon-button--primary" type="button" data-action="login" ${loginBlocked() ? "disabled" : ""}>
                ${icon(loginState.icon)}<span>${loginState.label}</span>
              </button>
            `
        }
      </nav>
    </header>
  `;
}

function renderProductSwitcher() {
  return `
    <div class="product-switcher" role="tablist" aria-label="Discat dashboard switch">
      ${Object.values(PRODUCT_META).map((product) => `
        <button class="product-switcher__item ${state.activeProduct === product.id ? "product-switcher__item--active" : ""}" type="button" role="tab" aria-selected="${state.activeProduct === product.id}" data-action="switch-product" data-product="${product.id}">
          <span>${escapeHtml(product.shortLabel)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function loginButtonState() {
  if (serviceMaintenanceActive()) {
    return { icon: "radio", label: "メンテナンス中" };
  }
  if (state.serviceStatus.loading) {
    return { icon: "radio", label: "接続中" };
  }
  if (loginBlocked()) {
    return { icon: "shield", label: "検証待ち" };
  }
  return { icon: "login", label: "Discordでログイン" };
}

function guardLoginButtonState() {
  if (state.security.loading) {
    return { icon: "radio", label: "確認中" };
  }
  if (guardLoginBlocked()) {
    return { icon: "shield", label: "検証待ち" };
  }
  return { icon: "login", label: "Discordでログイン" };
}

function renderLoginPanel() {
  const securityEnabled = state.security.enabled || state.security.loading || state.security.error;
  const title = state.security.enabled && !state.security.verified ? "セキュリティ検証の実行" : "ログインが必要です";
  const copy = state.security.enabled
    ? "Cloudflare Turnstileでアクセス元を確認してから、Discordログインへ進みます。"
    : "Discordアカウントでログインすると、参加中のサーバーとBOTの設定を管理できます。";
  const loginState = loginButtonState();
  return `
    <section class="login-panel">
      <div class="login-panel__copy">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(copy)}</p>
        ${securityEnabled ? renderSecurityVerification() : ""}
        <div class="login-panel__actions">
          <button class="icon-button icon-button--primary" type="button" data-action="login" ${loginBlocked() ? "disabled" : ""}>
            ${icon(loginState.icon)}<span>${loginState.label}</span>
          </button>
          <a class="icon-button icon-button--ghost" href="${SUPPORT_SERVER_URL}" target="_blank" rel="noreferrer">
            ${icon("external")}<span>サポートサーバーはこちらから</span>
          </a>
        </div>
      </div>
      <div class="login-panel__mascot" aria-hidden="true">
        <img src="${MASCOT_URL}" alt="" />
      </div>
    </section>
  `;
}

function renderServiceStatusPanel(mode) {
  const checking = mode === "checking" || state.serviceStatus.loading;
  return `
    <section class="service-status-panel service-status-panel--${checking ? "checking" : "maintenance"}" data-service-status>
      <h2>${checking ? "接続中" : "メンテナンス中"}</h2>
    </section>
  `;
}

function renderServiceStatusFact(label, value, online) {
  return `
    <div class="service-status-fact ${online ? "service-status-fact--online" : ""}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderSecurityVerification() {
  if (state.security.loading) {
    return `
      <div class="security-verification">
        <div class="security-verification__status">
          <span class="security-verification__spinner" aria-hidden="true"></span>
          <span>セキュリティ検証の設定を確認中です。</span>
        </div>
      </div>
    `;
  }
  if (state.security.error && !state.security.siteKey) {
    return `
      <div class="security-verification security-verification--error">
        ${icon("shield")}<span>${escapeHtml(state.security.error)}</span>
      </div>
    `;
  }
  if (!state.security.enabled) {
    return "";
  }
  return `
    <div class="security-verification ${state.security.verified ? "security-verification--verified" : ""}">
      <div class="security-verification__header">
        ${icon(state.security.verified ? "success" : "shield")}
        <span>${state.security.verified ? "検証済み" : "Bot対策の確認"}</span>
      </div>
      ${
        state.security.verified
          ? `<p>このブラウザは検証済みです。続けてDiscordでログインできます。</p>`
          : `
            <p>検証が完了するとログインボタンが有効になります。</p>
            <div class="security-verification__widget" data-turnstile-widget></div>
          `
      }
    </div>
  `;
}

function loginBlocked() {
  return (
    state.serviceStatus.loading ||
    serviceMaintenanceActive() ||
    state.security.loading ||
    Boolean(state.security.error && !state.security.verified) ||
    (state.security.enabled && !state.security.verified)
  );
}

function guardLoginBlocked() {
  return (
    state.security.loading ||
    Boolean(state.security.error && !state.security.verified) ||
    (state.security.enabled && !state.security.verified)
  );
}

function currentLoginBlocked() {
  return state.activeProduct === "guard" ? guardLoginBlocked() : loginBlocked();
}

function renderDashboard() {
  const guild = selectedGuild();
  const canConfigure = selectedGuildCanConfigure();
  const page = activeSettingsPage();
  const view = activeSettingsView();
  const pageTitle =
    view === "user"
      ? escapeHtml(state.user?.username ?? "ユーザー")
      : view === "host"
        ? "BOT詳細"
        : canConfigure
          ? escapeHtml(guild?.name ?? "")
          : "サーバーを選択";
  if (view === "user") {
    return `
      <div class="dashboard-grid dashboard-grid--user">
        <div class="workspace workspace--user">
          ${renderDashboardModeNav()}
          <div class="workspace-main workspace-main--user">
            <div class="workspace__title">
              <span>${page.eyebrow}</span>
              <h2>${pageTitle}</h2>
            </div>
            ${renderWorkspaceContent()}
          </div>
        </div>
      </div>
    `;
  }
  return `
    <div class="dashboard-grid">
      ${renderGuildList()}
      <div class="workspace">
        ${renderDashboardModeNav()}
        <div class="workspace-layout">
          ${renderFunctionSidebar()}
          <div class="workspace-main">
            <div class="workspace__title">
              <span>${page.eyebrow}</span>
              <h2>${pageTitle}</h2>
            </div>
            ${renderWorkspaceContent()}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardModeNav() {
  const userActive = activeSettingsView() === "user";
  return `
    <nav class="dashboard-mode-nav" aria-label="ダッシュボードページ">
      <button class="dashboard-mode-nav__item ${userActive ? "dashboard-mode-nav__item--active" : ""}" type="button" data-dashboard-page="user" aria-current="${userActive ? "page" : "false"}">
        ${icon("user")}<span>ユーザーページ</span>
      </button>
      <button class="dashboard-mode-nav__item ${!userActive ? "dashboard-mode-nav__item--active" : ""}" type="button" data-dashboard-page="server" aria-current="${!userActive ? "page" : "false"}">
        ${icon("server")}<span>サーバー設定</span>
      </button>
    </nav>
  `;
}

async function loadGuardData(options = {}) {
  const requestId = state.requestIds.guard + 1;
  state.requestIds.guard = requestId;
  state.guard.apiError = null;
  state.guard.health = null;
  state.guard.loading = !options.silent;
  if (!options.silent) {
    render();
  }

  if (state.guard.apiBase) {
    try {
      const [healthResult, statusResult, settingsResult, moderationResult, loggingResult, optionsResult] = await Promise.allSettled([
        guardFetchJson(guardApiUrl("/health")),
        guardFetchJson(guardApiUrl("/status")),
        guardFetchJson(guardApiUrl("/verification/settings")),
        guardFetchJson(guardApiUrl("/moderation/settings")),
        guardFetchJson(guardApiUrl("/logging/settings")),
        guardFetchJson(guardApiUrl("/verification/options")),
      ]);
      if (healthResult.status !== "fulfilled") {
        throw healthResult.reason;
      }
      if (statusResult.status !== "fulfilled") {
        throw statusResult.reason;
      }
      if (requestId !== state.requestIds.guard) {
        return;
      }
      state.guard.health = healthResult.value;
      state.guard.status = normalizeGuardStatus(statusResult.value);
      state.guard.events = [];
      state.guard.verificationSettings =
        settingsResult.status === "fulfilled" ? normalizeGuardVerificationSettings(settingsResult.value?.settings) : [];
      state.guard.moderationSettings =
        moderationResult.status === "fulfilled" ? normalizeGuardModerationSettings(moderationResult.value?.settings) : [];
      state.guard.loggingSettings =
        loggingResult.status === "fulfilled" ? normalizeGuardLoggingSettings(loggingResult.value?.settings) : [];
      state.guard.verificationRecords = [];
      if (optionsResult.status === "fulfilled" && optionsResult.value) {
        state.guard.verificationOptions = normalizeGuardVerificationOptions(optionsResult.value);
        state.guard.verificationOptionsError = null;
      } else if (optionsResult.status === "rejected") {
        state.guard.verificationOptionsError = optionsResult.reason instanceof Error ? optionsResult.reason.message : String(optionsResult.reason);
      }
      hydrateGuardVerificationForm();
      hydrateGuardModerationForm();
      hydrateGuardLoggingForm();
      state.guard.source = "api";
      state.guard.loadedAt = new Date().toISOString();
      state.guard.loading = false;
      if (options.renderAfter !== false) {
        render();
      }
      return;
    } catch (error) {
      if (requestId !== state.requestIds.guard) {
        return;
      }
      state.guard.apiError = error instanceof Error ? error.message : String(error);
      state.guard.source = "api-error";
    }
  }

  try {
    state.guard.status = normalizeGuardStatus(await guardFetchJson(GUARD_STATUS_SAMPLE_ENDPOINT));
  } catch {
    state.guard.status = normalizeGuardStatus(null);
  }
  if (requestId !== state.requestIds.guard) {
    return;
  }
  state.guard.events = [];
  state.guard.loadedAt = new Date().toISOString();
  if (!state.guard.apiBase) {
    state.guard.source = "sample";
  }
  state.guard.verificationSettings = [];
  state.guard.moderationSettings = [];
  state.guard.loggingSettings = [];
  state.guard.verificationOptions = null;
  state.guard.verificationRecords = [];
  hydrateGuardVerificationForm();
  hydrateGuardModerationForm();
  hydrateGuardLoggingForm();
  state.guard.loading = false;
  if (options.renderAfter !== false) {
    render();
  }
}

function guardApiUrl(path) {
  return `${state.guard.apiBase}${path}`;
}

async function guardFetchJson(url, options = {}) {
  const headers = new Headers(options.headers ?? {});
  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  let response;
  try {
    response = await fetch(url, { ...options, headers, cache: "no-store" });
  } catch {
    throw new Error(guardConnectionErrorMessage(url));
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail = isObject(payload) ? (payload.message ?? payload.error) : "";
    throw new Error(detail ? `${response.status} ${detail}` : `${response.status} ${response.statusText}`);
  }
  return response.json();
}

function guardConnectionErrorMessage(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (window.location.protocol === "https:" && url.protocol === "http:" && !isLocalDashboardOrigin()) {
      return "HTTPSのダッシュボードからHTTPのGuard APIには接続できません。HTTPSで公開したGuard API URLを指定してください。";
    }
  } catch {
    // Fall through to the generic connection message.
  }
  return "Guard APIに接続できませんでした。API URL、Guard APIの起動状態、CORS許可Originを確認してください。";
}

function normalizeGuardStatus(status) {
  const stale = Boolean(status?.stale);
  return {
    bot_name: String(status?.bot_name ?? "Discat Guard"),
    online: Boolean(status?.online) && !stale,
    stale,
    process_id: status?.process_id ?? null,
    started_at: status?.started_at ?? null,
    last_ready_at: status?.last_ready_at ?? null,
    status_updated_at: status?.status_updated_at ?? null,
    uptime_seconds: Number(status?.uptime_seconds ?? 0),
    user: isObject(status?.user) ? status.user : null,
    latency_ms: status?.latency_ms == null ? null : Number(status.latency_ms),
    guild_count: Number(status?.guild_count ?? 0),
    member_count: Number(status?.member_count ?? 0),
    commands_enabled: Boolean(status?.commands_enabled),
    security_log_enabled: status?.security_log_enabled !== false,
    security_log_path: String(status?.security_log_path ?? "database/security_events.jsonl"),
    guilds: Array.isArray(status?.guilds) ? status.guilds : [],
  };
}

function normalizeGuardEvents(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  return events.map((event) => ({
    timestamp: event?.timestamp ?? null,
    event_type: String(event?.event_type ?? "event"),
    guild: isObject(event?.guild) ? event.guild : null,
    actor: isObject(event?.actor) ? event.actor : null,
    target: isObject(event?.target) ? event.target : null,
    details: isObject(event?.details) ? event.details : null,
    level: guardEventLevel(event?.event_type ?? event?.level),
  }));
}

function normalizeGuardVerificationSettings(settings) {
  if (!Array.isArray(settings)) {
    return [];
  }
  return settings.map((item) => ({
    guild_id: String(item?.guild_id ?? ""),
    enabled: item?.enabled !== false,
    button_channel_lock_enabled: item?.button_channel_lock_enabled !== false,
    button_channel_id: String(item?.button_channel_id ?? ""),
    log_channel_id: String(item?.log_channel_id ?? ""),
    role_id: String(item?.role_id ?? ""),
    duplicate_action: normalizeGuardDuplicateAction(item?.duplicate_action),
    updated_at: item?.updated_at ?? null,
    updated_by: item?.updated_by ?? null,
  })).filter((item) => item.guild_id);
}

function normalizeGuardVerificationRecords(records) {
  if (!Array.isArray(records)) {
    return [];
  }
  return records.map((record) => ({
    id: String(record?.id ?? ""),
    guild_id: String(record?.guild_id ?? ""),
    user_id: String(record?.user_id ?? ""),
    user_name: String(record?.user_name ?? ""),
    display_name: String(record?.display_name ?? ""),
    device_fingerprint_preview: String(record?.device_fingerprint_preview ?? ""),
    duplicate_detected: Boolean(record?.duplicate_detected),
    duplicate_user_ids: Array.isArray(record?.duplicate_user_ids) ? record.duplicate_user_ids.map(String) : [],
    created_at: record?.created_at ?? null,
    status: String(record?.status ?? "recorded"),
    action_taken: String(record?.action_taken ?? "pending"),
    action_error: record?.action_error ? String(record.action_error) : null,
    ip_address: record?.ip_address ? String(record.ip_address) : "",
  })).filter((record) => record.id || record.user_id);
}

function normalizeGuardVerificationOptions(payload) {
  const guilds = Array.isArray(payload?.guilds) ? payload.guilds : [];
  return {
    bot_connected: payload?.bot_connected !== false,
    guilds: guilds.map((guild) => ({
      id: String(guild?.id ?? ""),
      name: String(guild?.name ?? "Unknown Guild"),
      icon_url: normalizeNullableString(guild?.icon_url),
      member_count: Number(guild?.member_count ?? 0),
      text_channels: Array.isArray(guild?.text_channels)
        ? guild.text_channels.map((channel) => ({
            id: String(channel?.id ?? ""),
            name: String(channel?.name ?? "unknown"),
            can_send_messages: channel?.can_send_messages !== false,
          })).filter((channel) => channel.id)
        : [],
      roles: Array.isArray(guild?.roles)
        ? guild.roles.map((role) => ({
            id: String(role?.id ?? ""),
            name: String(role?.name ?? "unknown"),
            position: Number(role?.position ?? 0),
            managed: Boolean(role?.managed),
            can_assign: role?.can_assign !== false,
          })).filter((role) => role.id)
        : [],
    })).filter((guild) => guild.id),
  };
}

function normalizeGuardDuplicateAction(value) {
  const action = String(value ?? "notify").toLowerCase();
  return GUARD_DUPLICATE_ACTIONS.some((item) => item.id === action) ? action : "notify";
}

function normalizeGuardModerationLevel(value) {
  const level = String(value ?? "medium").toLowerCase();
  return GUARD_MODERATION_LEVELS.some((item) => item.id === level) ? level : "medium";
}

function normalizeGuardModerationAction(value, fallback = "delete") {
  const action = String(value ?? fallback).toLowerCase();
  return GUARD_MODERATION_ACTIONS.some((item) => item.id === action) ? action : fallback;
}

function normalizeGuardModerationChannelIds(value) {
  const rawItems = Array.isArray(value) ? value : value ? [value] : [];
  return rawItems
    .map((item) => String(item ?? "").trim())
    .filter((item, index, array) => item && /^\d+$/.test(item) && array.indexOf(item) === index);
}

function normalizeGuardModerationFeatureSettings(featureId, settings) {
  const defaults = GUARD_MODERATION_DEFAULTS[featureId] ?? {
    enabled: true,
    level: "medium",
    action: "delete",
    log_channel_id: "",
    target_channel_ids: [],
    all_channels_enabled: true,
  };
  const rawAllChannelsEnabled = settings?.all_channels_enabled;
  const allChannelsEnabled = rawAllChannelsEnabled == null
    ? !Boolean(settings?.all_channels_disabled)
    : Boolean(rawAllChannelsEnabled);
  return {
    enabled: settings?.enabled !== false,
    level: normalizeGuardModerationLevel(settings?.level ?? defaults.level),
    action: normalizeGuardModerationAction(settings?.action, defaults.action),
    log_channel_id: String(settings?.log_channel_id ?? defaults.log_channel_id ?? ""),
    target_channel_ids: normalizeGuardModerationChannelIds(settings?.target_channel_ids ?? settings?.disabled_channel_ids ?? defaults.target_channel_ids),
    all_channels_enabled: allChannelsEnabled,
  };
}

function normalizeGuardModerationForm(form) {
  const rawFeatures = isObject(form?.features) ? form.features : {};
  return {
    guild_id: String(form?.guild_id ?? ""),
    features: Object.fromEntries(
      GUARD_MODERATION_FEATURES.map((feature) => [
        feature.id,
        normalizeGuardModerationFeatureSettings(feature.id, rawFeatures[feature.id]),
      ]),
    ),
  };
}

function normalizeGuardModerationSettings(settings) {
  if (!Array.isArray(settings)) {
    return [];
  }
  return settings.map((item) => {
    const normalized = normalizeGuardModerationForm(item);
    return {
      ...normalized,
      updated_at: item?.updated_at ?? null,
      updated_by: item?.updated_by ?? null,
    };
  }).filter((item) => item.guild_id);
}

function normalizeGuardLoggingEventSettings(eventId, settings) {
  const defaults = GUARD_LOGGING_DEFAULTS[eventId] ?? { enabled: true, channel_id: "" };
  return {
    enabled: settings?.enabled !== false,
    channel_id: String(settings?.channel_id ?? defaults.channel_id ?? ""),
  };
}

function normalizeGuardLoggingForm(form) {
  const rawEvents = isObject(form?.events) ? form.events : {};
  return {
    guild_id: String(form?.guild_id ?? ""),
    events: Object.fromEntries(
      GUARD_LOGGING_EVENTS.map((event) => [
        event.id,
        normalizeGuardLoggingEventSettings(event.id, rawEvents[event.id]),
      ]),
    ),
  };
}

function normalizeGuardLoggingSettings(settings) {
  if (!Array.isArray(settings)) {
    return [];
  }
  return settings.map((item) => {
    const normalized = normalizeGuardLoggingForm(item);
    return {
      ...normalized,
      updated_at: item?.updated_at ?? null,
      updated_by: item?.updated_by ?? null,
    };
  }).filter((item) => item.guild_id);
}

function hydrateGuardVerificationForm() {
  const form = state.guard.verificationForm;
  const guilds = guardConfigurableGuilds();
  const guildIds = new Set(guilds.map((guild) => guild.id));
  const fallbackGuildId = guilds[0]?.id ?? "";
  const guildId = [
    form.guild_id,
    state.guard.verificationSettings[0]?.guild_id,
    state.guard.verificationOptions?.guilds?.[0]?.id,
    state.guard.status.guilds?.[0]?.id,
  ].find((id) => id && guildIds.has(id)) ?? fallbackGuildId;
  const savedForm = guardVerificationFormFromSettings(guildId);
  const preserveDirtyForm = isViewDirty("guardVerification") && form.guild_id === guildId;
  state.guard.savedVerificationForm = cloneState(savedForm);
  if (!preserveDirtyForm) {
    state.guard.verificationForm = cloneState(savedForm);
  }
  updateDirtyState("guardVerification");
}

function hydrateGuardModerationForm() {
  const form = state.guard.moderationForm;
  const guilds = guardConfigurableGuilds();
  const guildIds = new Set(guilds.map((guild) => guild.id));
  const fallbackGuildId = guilds[0]?.id ?? "";
  const guildId = [
    form.guild_id,
    state.guard.moderationSettings[0]?.guild_id,
    state.guard.verificationForm.guild_id,
    state.guard.verificationOptions?.guilds?.[0]?.id,
    state.guard.status.guilds?.[0]?.id,
  ].find((id) => id && guildIds.has(id)) ?? fallbackGuildId;
  const savedForm = guardModerationFormFromSettings(guildId);
  const preserveDirtyForm = isViewDirty("guardModeration") && form.guild_id === guildId;
  state.guard.savedModerationForm = cloneState(savedForm);
  if (!preserveDirtyForm) {
    state.guard.moderationForm = cloneState(savedForm);
  }
  updateDirtyState("guardModeration");
}

function hydrateGuardLoggingForm() {
  const form = state.guard.loggingForm;
  const guilds = guardConfigurableGuilds();
  const guildIds = new Set(guilds.map((guild) => guild.id));
  const fallbackGuildId = guilds[0]?.id ?? "";
  const guildId = [
    form.guild_id,
    state.guard.loggingSettings[0]?.guild_id,
    state.guard.verificationForm.guild_id,
    state.guard.verificationOptions?.guilds?.[0]?.id,
    state.guard.status.guilds?.[0]?.id,
  ].find((id) => id && guildIds.has(id)) ?? fallbackGuildId;
  const savedForm = guardLoggingFormFromSettings(guildId);
  const preserveDirtyForm = isViewDirty("guardLogging") && form.guild_id === guildId;
  state.guard.savedLoggingForm = cloneState(savedForm);
  if (!preserveDirtyForm) {
    state.guard.loggingForm = cloneState(savedForm);
  }
  updateDirtyState("guardLogging");
}

function applyGuardVerificationSettingsForGuild(guildId) {
  rememberSavedGuardVerificationForm(guardVerificationFormFromSettings(guildId));
}

function applyGuardModerationSettingsForGuild(guildId) {
  rememberSavedGuardModerationForm(guardModerationFormFromSettings(guildId));
}

function applyGuardLoggingSettingsForGuild(guildId) {
  rememberSavedGuardLoggingForm(guardLoggingFormFromSettings(guildId));
}

function applyGuardSettingsForGuild(guildId) {
  applyGuardVerificationSettingsForGuild(guildId);
  applyGuardModerationSettingsForGuild(guildId);
  applyGuardLoggingSettingsForGuild(guildId);
}

function guardSourceText() {
  if (state.guard.source === "api") {
    return "接続済み";
  }
  if (state.guard.source === "api-error") {
    return "接続失敗";
  }
  return "サンプル表示";
}

function guardStatusClass() {
  if (state.guard.status.online) {
    return "source-chip--online";
  }
  if (state.guard.source === "sample") {
    return "source-chip--sample";
  }
  return "source-chip--offline";
}

function renderGuardDashboard() {
  const feature = activeGuardFeature();
  const selectedGuild = activeGuardSelectedGuild();
  const pageTitle = selectedGuild?.name ?? (guardConfigurableGuilds().length ? "サーバーを選択" : "設定可能なサーバーなし");
  return `
    <div class="dashboard-grid dashboard-grid--guard">
      ${renderGuardGuildList()}
      <div class="workspace workspace--guard">
        <div class="workspace-layout workspace-layout--guard">
          ${renderGuardFunctionSidebar()}
          <div class="workspace-main">
            <div class="workspace__title">
              <span>${escapeHtml(feature.label)}</span>
              <h2>${escapeHtml(pageTitle)}</h2>
            </div>
            ${renderGuardFeatureContent(feature)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function activeGuardFeature() {
  return GUARD_FEATURES.find((feature) => feature.id === state.guard.activeFeature) ?? GUARD_FEATURES[0];
}

function renderGuardFeatureContent(feature) {
  if (feature?.id === "verification") {
    return renderGuardVerification();
  }
  if (feature?.id === "moderation") {
    return renderGuardModeration();
  }
  if (feature?.id === "logging") {
    return renderGuardLogging();
  }
  return `
    <section class="settings-panel empty-state">
      ${icon("settings")}
      <strong>この機能はまだ準備中です。</strong>
      <span>Guard機能を追加するとここに設定画面が表示されます。</span>
    </section>
  `;
}

function renderGuardFunctionSidebar() {
  return `
    <aside class="function-sidebar" aria-label="Guard機能メニュー">
      <div class="function-sidebar__label">Guard機能</div>
      <div class="function-sidebar__items" role="tablist" aria-orientation="vertical" aria-label="Guard機能">
        ${GUARD_FEATURES.map(renderGuardFunctionNavItem).join("")}
      </div>
    </aside>
  `;
}

function renderGuardFunctionNavItem(feature) {
  const active = activeGuardFeature().id === feature.id;
  return `
    <div class="function-nav-entry">
      <button class="function-nav-item ${active ? "function-nav-item--active" : ""}" type="button" role="tab" aria-selected="${active}" data-guard-feature="${escapeAttribute(feature.id)}">
        ${icon(feature.icon)}
        <span class="function-nav-item__body">
          <strong>${escapeHtml(feature.label)}</strong>
          <span>${escapeHtml(feature.description)}</span>
        </span>
      </button>
      ${renderInfoPopover(feature.help, `${feature.label}の説明`)}
    </div>
  `;
}

function renderGuardGuildList() {
  const guilds = guardConfigurableGuilds();
  const installableGuilds = guardInstallableGuilds();
  const selectedGuild = activeGuardSelectedGuild();
  const guildListExpanded = !state.guildListCollapsed;
  return `
    <aside class="guild-list ${state.guildListCollapsed ? "guild-list--collapsed" : ""}" aria-label="Guardサーバー">
      <div class="guild-list__header">
        <div class="panel-heading">
          ${icon("server")}<h2>サーバー</h2>
        </div>
        <button class="guild-list__toggle" type="button" data-action="toggle-guild-list" aria-expanded="${guildListExpanded}" aria-controls="guard-guild-list-body">
          <span>${guildListExpanded ? "閉じる" : "開く"}</span>${icon(guildListExpanded ? "chevronUp" : "chevronDown")}
        </button>
      </div>
      <div class="guild-list__mobile-summary">
        <span>選択中</span>
        <strong>${escapeHtml(selectedGuild?.name ?? "サーバー未選択")}</strong>
        <small>設定可能 ${guilds.length} / BOT未導入 ${installableGuilds.length}</small>
      </div>
      <div class="guild-list__body" id="guard-guild-list-body">
        ${renderGuildSection(
          "設定可能",
          guilds.length,
          guilds.length > 0
            ? guilds.map(renderGuardSelectableGuild).join("")
            : `<div class="empty-state">Guard BOT導入済みで管理権限があるサーバーがありません。</div>`,
        )}
        ${renderGuildSection(
          "BOT未導入",
          installableGuilds.length,
          installableGuilds.length > 0
            ? installableGuilds.map(renderInstallableGuild).join("")
            : `<div class="empty-state">導入待ちのサーバーはありません。</div>`,
        )}
      </div>
    </aside>
  `;
}

function renderGuardSelectableGuild(guild) {
  const active = activeGuardSelectedGuild()?.id === guild.id;
  return `
    <button class="guild-row ${active ? "guild-row--selected" : ""}" type="button" data-guard-guild-id="${escapeAttribute(guild.id)}">
      ${renderGuardGuildIcon(guild)}
      <span class="guild-row__body">
        <span class="guild-row__name">${escapeHtml(guild.name)}</span>
        <span class="guild-row__meta">${escapeHtml(guardGuildMeta(guild))}</span>
      </span>
      ${icon("shield", "Guard設定対象")}
    </button>
  `;
}

function renderGuardGuildIcon(guild) {
  if (guild.icon_url) {
    return `<img class="guild-row__icon" src="${escapeAttribute(guild.icon_url)}" alt="" />`;
  }
  return `<span class="guild-row__icon guild-row__icon--fallback">${escapeHtml((guild.name || "?").slice(0, 1))}</span>`;
}

function guardGuildMeta(guild) {
  return "BOT導入済み / 管理権限あり";
}

function renderGuardFeatureList() {
  return `
    <section class="settings-panel guard-feature-index" aria-label="Guard機能一覧">
      <div class="settings-panel__header">
        <div class="panel-heading">${icon("shield")}<h2>機能一覧</h2></div>
        <span class="feature-status feature-status--on">${GUARD_FEATURES.length}件</span>
      </div>
      <div class="guard-feature-index__list">
        ${GUARD_FEATURES.map((feature) => `
          <a class="guard-feature-index__item" href="#guard-${escapeAttribute(feature.id)}-settings">
            <span class="guard-feature-index__icon">${icon(feature.icon)}</span>
            <span>
              <strong>${escapeHtml(feature.label)}</strong>
              <small>${escapeHtml(feature.description)}</small>
            </span>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderGuardStatusRail() {
  const status = state.guard.status;
  return `
    <aside class="guild-list guard-status-rail" aria-label="Guard status">
      <div class="guild-list__header">
        <div class="panel-heading">
          ${icon("shield")}<h2>Guard状態</h2>
        </div>
        <span class="feature-status ${status.online ? "feature-status--on" : ""}">${status.online ? "Online" : state.guard.source === "sample" ? "Sample" : "Offline"}</span>
      </div>
      <div class="guard-status-card">
        <img class="guard-status-card__icon" src="${GUARD_MASCOT_URL}" alt="" />
        <div>
          <strong>${escapeHtml(status.bot_name)}</strong>
          <span>${escapeHtml(guardSourceText())}</span>
        </div>
      </div>
      <div class="guard-rail-facts">
        ${renderHostFact("サーバー", formatCompactNumber(status.guild_count))}
        ${renderHostFact("メンバー", formatCompactNumber(status.member_count))}
        ${renderHostFact("Ping", status.latency_ms == null ? "未取得" : `${status.latency_ms}ms`)}
        ${renderHostFact("更新", formatTimeOnly(state.guard.loadedAt))}
      </div>
    </aside>
  `;
}

function renderGuardContent() {
  return renderGuardFeatureContent(activeGuardFeature());
}

function renderGuardOverview() {
  const status = state.guard.status;
  return `
    ${renderGuardApiNotice()}
    <section class="settings-panel guard-overview" aria-label="Guard概要">
      <div class="settings-panel__header">
        <div class="panel-heading">
          ${icon("shield")}<h2>${escapeHtml(status.bot_name)}</h2>
        </div>
        <span class="feature-status ${status.online ? "feature-status--on" : ""}">${status.online ? "監視中" : "待機"}</span>
      </div>
      <div class="host-metrics">
        ${renderMetricTile("参加サーバー", formatCompactNumber(status.guild_count), "監視対象", status.online)}
        ${renderMetricTile("監視メンバー", formatCompactNumber(status.member_count), "サーバー総計", status.online)}
        ${renderMetricTile("Discord Ping", status.latency_ms == null ? "未取得" : `${status.latency_ms}ms`, "Gateway", status.online)}
        ${renderMetricTile("稼働時間", formatDuration(status.uptime_seconds), formatDateTime(status.started_at), status.online)}
      </div>
      <div class="guard-panel-grid">
        <section class="feature-card">
          <div class="feature-card__header">
            <div class="panel-heading">${icon("bot")}<h2>プロセス</h2></div>
          </div>
          ${renderDetailList([
            ["ログイン", status.user?.name || "未取得"],
            ["プロセスID", status.process_id || "未取得"],
            ["最終Ready", formatDateTime(status.last_ready_at)],
            ["状態更新", formatDateTime(status.status_updated_at)],
          ])}
        </section>
        <section class="feature-card">
          <div class="feature-card__header">
            <div class="panel-heading">${icon("activity")}<h2>監査</h2></div>
          </div>
          ${renderDetailList([
            ["監査ログ", status.security_log_path],
            ["ログ機能", status.security_log_enabled ? "有効" : "無効"],
            ["通常コマンド", status.commands_enabled ? "有効" : "無効"],
            ["API Contract", state.guard.health?.api_contract_version || "未取得"],
          ])}
        </section>
      </div>
      <div class="guard-feature-list">
        ${GUARD_FEATURE_ROWS.map(([heading, text]) => `
          <article class="guard-feature-row">
            ${icon("shield")}
            <span><strong>${escapeHtml(heading)}</strong><small>${escapeHtml(text)}</small></span>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderGuardApiNotice() {
  if (state.guard.source !== "api-error") {
    return "";
  }
  return `
    <section class="status-banner status-banner--error guard-api-notice">
      ${icon("alert")}<span>Guard APIに接続できませんでした: ${escapeHtml(state.guard.apiError ?? "unknown error")}</span>
    </section>
  `;
}

function renderGuardApiHint() {
  if (state.guard.source === "api") {
    return "";
  }
  const message =
    window.location.protocol === "https:" && !isLocalDashboardOrigin()
      ? "GitHub Pagesから認証設定を保存するには、HTTPSで公開されたGuard API URLを指定してください。"
      : "Guard API URLを接続すると認証設定を保存できます。";
  return `
    <div class="status-banner status-banner--info guard-api-hint">
      ${icon("info")}<span>${escapeHtml(message)}</span>
    </div>
  `;
}

function renderGuardServers() {
  const guilds = state.guard.status.guilds ?? [];
  if (!guilds.length) {
    return `
      ${renderGuardApiNotice()}
      <section class="settings-panel empty-state">
        ${icon("server")}
        <strong>参加サーバーはまだ取得されていません。</strong>
        <span>Guard APIの /status が更新されるとここに反映されます。</span>
      </section>
    `;
  }
  return `
    ${renderGuardApiNotice()}
    <section class="settings-panel">
      <div class="settings-panel__header">
        <div class="panel-heading">${icon("server")}<h2>参加サーバー</h2></div>
        <span class="feature-status feature-status--on">${guilds.length}件</span>
      </div>
      <div class="guard-server-list">
        ${guilds.map(renderGuardServerRow).join("")}
      </div>
    </section>
  `;
}

function renderGuardServerRow(guild) {
  const name = String(guild?.name ?? "Unknown Guild");
  return `
    <article class="guard-server-row">
      <span class="guild-row__icon guild-row__icon--fallback">${escapeHtml(name.slice(0, 1))}</span>
      <span>
        <strong>${escapeHtml(name)}</strong>
        <small>${formatCompactNumber(Number(guild?.member_count ?? 0))} members / joined ${formatDateTime(guild?.joined_at)}</small>
      </span>
      <code>${escapeHtml(guild?.id ?? "unknown")}</code>
    </article>
  `;
}

function renderGuardEvents() {
  const events = state.guard.events ?? [];
  if (state.guard.source === "api" && events.length === 0) {
    return `
      <section class="settings-panel empty-state">
        ${icon("activity")}
        <strong>監査ログはまだありません。</strong>
        <span>セキュリティイベントが記録されると /events から反映されます。</span>
      </section>
    `;
  }
  return `
    ${renderGuardApiNotice()}
    <section class="settings-panel">
      <div class="settings-panel__header">
        <div class="panel-heading">${icon("activity")}<h2>監査ログ</h2></div>
      </div>
      <div class="guard-event-list">
        ${events.map(renderGuardEventRow).join("")}
      </div>
    </section>
  `;
}

function renderGuardEventRow(event) {
  return `
    <article class="guard-event-row guard-event-row--${escapeAttribute(event.level ?? "info")}">
      <span class="guard-event-row__icon">${icon(event.level === "warning" ? "alert" : event.level === "success" ? "success" : "activity")}</span>
      <span>
        <strong>${escapeHtml(guardEventName(event.event_type))}</strong>
        <small>${escapeHtml(guardText(guardGuildName(event.guild)))} / ${escapeHtml(guardText(guardActorName(event.actor)))} / ${formatDateTime(event.timestamp)}</small>
      </span>
    </article>
  `;
}

function renderGuardVerification() {
  const form = state.guard.verificationForm;
  const selectedGuild = guardVerificationSelectedGuild();
  const dirty = isViewDirty("guardVerification");
  return `
    ${renderGuardApiNotice()}
    <section class="settings-panel guard-verification-panel" id="guard-verification-settings">
      <div class="settings-panel__header">
        <div class="panel-heading">${icon("lock")}<h2>認証設定</h2></div>
        <div class="settings-panel__header-actions">
          <span class="feature-status ${state.guard.source === "api" ? "feature-status--on" : ""}">${state.guard.source === "api" ? "設定可能" : "未接続"}</span>
          <button class="icon-button icon-button--primary save-button ${dirty ? "save-button--dirty" : ""}" type="button" data-action="save-guard-verification-settings" data-save-view="guardVerification" ${state.guard.verificationSaving ? "disabled" : ""}>
            ${icon("save")}<span>${state.guard.verificationSaving ? "保存中" : "変更を保存"}</span>
          </button>
        </div>
      </div>
      <div class="status-banner guard-privacy-note">
        ${icon("shield")}<span>サーバーごとに認証ボタン、ログチャンネル、付与ロール、同一端末検知時の処置を設定します。</span>
      </div>
      ${state.guard.verificationError ? `<p class="status-banner status-banner--error">${icon("alert")}<span>${escapeHtml(state.guard.verificationError)}</span></p>` : ""}
      ${state.guard.verificationMessage ? `<p class="status-banner status-banner--success">${icon("success")}<span>${escapeHtml(state.guard.verificationMessage)}</span></p>` : ""}
      <form class="settings-grid guard-verification-form" data-guard-verification-form>
        <div class="field guard-selected-server">
          <span>選択中のサーバー</span>
          <strong>${escapeHtml(selectedGuild?.name ?? "右側のサーバー一覧から選択してください")}</strong>
          <small>${escapeHtml(selectedGuild?.id ?? "未選択")}</small>
        </div>
        ${renderGuardVerificationChannelField("button_channel_id", "認証ボタン配置チャンネル", form.button_channel_id, selectedGuild)}
        ${renderGuardVerificationChannelField("log_channel_id", "ログチャンネル", form.log_channel_id, selectedGuild)}
        ${renderGuardVerificationRoleField(form.role_id, selectedGuild)}
        <label class="field">
          <span>重複検知時の処置</span>
          <select data-guard-verification-field="duplicate_action">
            ${GUARD_DUPLICATE_ACTIONS.map((action) => `<option value="${escapeAttribute(action.id)}" ${action.id === form.duplicate_action ? "selected" : ""}>${escapeHtml(action.label)}</option>`).join("")}
          </select>
        </label>
        <label class="toggle-row guard-verification-toggle">
          <input type="checkbox" data-guard-verification-field="button_channel_lock_enabled" ${form.button_channel_lock_enabled ? "checked" : ""} />
          <span>認証ボタン配置チャンネルを管理者以外送信不可にする</span>
        </label>
        <label class="toggle-row guard-verification-toggle">
          <input type="checkbox" data-guard-verification-field="enabled" ${form.enabled ? "checked" : ""} />
          <span>認証機能を有効にする</span>
        </label>
      </form>
      ${state.guard.verificationOptionsError ? `<p class="guard-inline-hint">チャンネルとロール候補を読み込めませんでした: ${escapeHtml(state.guard.verificationOptionsError)}</p>` : ""}
    </section>
  `;
}

function renderGuardModeration() {
  const form = normalizeGuardModerationForm(state.guard.moderationForm);
  const selectedGuild = guardModerationSelectedGuild();
  const dirty = isViewDirty("guardModeration");
  return `
    ${renderGuardApiNotice()}
    <section class="settings-panel guard-verification-panel guard-moderation-panel" id="guard-moderation-settings">
      <div class="settings-panel__header">
        <div class="panel-heading">${icon("shield")}<h2>荒らし対策</h2></div>
        <div class="settings-panel__header-actions">
          <span class="feature-status ${state.guard.source === "api" ? "feature-status--on" : ""}">${state.guard.source === "api" ? "設定可能" : "未接続"}</span>
          <button class="icon-button icon-button--primary save-button ${dirty ? "save-button--dirty" : ""}" type="button" data-action="save-guard-moderation-settings" data-save-view="guardModeration" ${state.guard.moderationSaving ? "disabled" : ""}>
            ${icon("save")}<span>${state.guard.moderationSaving ? "保存中" : "変更を保存"}</span>
          </button>
        </div>
      </div>
      <div class="status-banner guard-privacy-note">
        ${icon("shield")}<span>招待リンク連投、外部リンク、スパム、暴言、下ネタの検知レベル・処罰・処罰ログチャンネル・対象チャンネルを機能ごとに設定します。</span>
      </div>
      ${state.guard.moderationError ? `<p class="status-banner status-banner--error">${icon("alert")}<span>${escapeHtml(state.guard.moderationError)}</span></p>` : ""}
      ${state.guard.moderationMessage ? `<p class="status-banner status-banner--success">${icon("success")}<span>${escapeHtml(state.guard.moderationMessage)}</span></p>` : ""}
      <form class="guard-moderation-form" data-guard-moderation-form>
        <div class="field guard-selected-server">
          <span>選択中のサーバー</span>
          <strong>${escapeHtml(selectedGuild?.name ?? "右側のサーバー一覧から選択してください")}</strong>
          <small>${escapeHtml(selectedGuild?.id ?? "未選択")}</small>
        </div>
        <div class="guard-moderation-grid">
          ${GUARD_MODERATION_FEATURES.map((feature) => renderGuardModerationFeatureCard(feature, form.features[feature.id], selectedGuild)).join("")}
        </div>
      </form>
      ${state.guard.verificationOptionsError ? `<p class="guard-inline-hint">チャンネル候補を読み込めませんでした: ${escapeHtml(state.guard.verificationOptionsError)}</p>` : ""}
    </section>
  `;
}

function renderGuardModerationFeatureCard(feature, settings, guild) {
  const normalized = normalizeGuardModerationFeatureSettings(feature.id, settings);
  const statusText = !normalized.enabled
    ? "無効"
    : normalized.all_channels_enabled
      ? "全チャンネル対象"
      : normalized.target_channel_ids.length
        ? `対象 ${normalized.target_channel_ids.length}`
        : "対象なし";
  const allChannelsLabel = feature.id === "other_links" || feature.id === "invite_spam"
    ? "全チャンネルでURLを無効にする"
    : "全チャンネルで禁止する";
  return `
    <article class="feature-card guard-moderation-card">
      <div class="feature-card__header">
        <div class="panel-heading">${icon(feature.id === "other_links" ? "link" : feature.id === "spam" ? "message" : "shield")}<h2>${escapeHtml(feature.label)}</h2></div>
        <span class="feature-status ${normalized.enabled && (normalized.all_channels_enabled || normalized.target_channel_ids.length) ? "feature-status--on" : ""}">${escapeHtml(statusText)}</span>
      </div>
      <p class="guard-moderation-card__description">${escapeHtml(feature.description)}</p>
      <div class="settings-grid guard-moderation-card__fields">
        <label class="toggle-row guard-verification-toggle">
          <input type="checkbox" data-guard-moderation-feature="${escapeAttribute(feature.id)}" data-guard-moderation-field="enabled" ${normalized.enabled ? "checked" : ""} />
          <span>この検知を有効にする</span>
        </label>
        <label class="toggle-row guard-verification-toggle">
          <input type="checkbox" data-guard-moderation-feature="${escapeAttribute(feature.id)}" data-guard-moderation-field="all_channels_enabled" ${normalized.all_channels_enabled ? "checked" : ""} />
          <span>${escapeHtml(allChannelsLabel)}</span>
        </label>
        <label class="field">
          <span>検知レベル</span>
          <select data-guard-moderation-feature="${escapeAttribute(feature.id)}" data-guard-moderation-field="level">
            ${GUARD_MODERATION_LEVELS.map((level) => `<option value="${escapeAttribute(level.id)}" ${level.id === normalized.level ? "selected" : ""}>${escapeHtml(level.label)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>処罰内容</span>
          <select data-guard-moderation-feature="${escapeAttribute(feature.id)}" data-guard-moderation-field="action">
            ${GUARD_MODERATION_ACTIONS.map((action) => `<option value="${escapeAttribute(action.id)}" ${action.id === normalized.action ? "selected" : ""}>${escapeHtml(action.label)}</option>`).join("")}
          </select>
        </label>
        ${renderGuardModerationChannelField(feature.id, normalized.log_channel_id, guild)}
        ${renderGuardModerationTargetChannelsFieldAdditive(feature.id, normalized.target_channel_ids, guild)}
      </div>
    </article>
  `;
}

function renderGuardModerationChannelField(featureId, selectedValue, guild) {
  const channels = guild?.text_channels ?? [];
  if (!channels.length) {
    const optionText = selectedValue ? `保存済み: ${selectedValue}` : "Guard APIに接続すると選択できます";
    return `
      <label class="field guard-moderation-log-field">
        <span>処罰ログチャンネル</span>
        <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="log_channel_id" disabled>
          <option value="${escapeAttribute(selectedValue)}">${escapeHtml(optionText)}</option>
        </select>
      </label>
    `;
  }
  return `
    <label class="field guard-moderation-log-field">
      <span>処罰ログチャンネル</span>
      <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="log_channel_id" size="${Math.min(Math.max(channels.length + 1, 3), 5)}">
        <option value="">未設定</option>
        ${channels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === selectedValue ? "selected" : ""}>#${escapeHtml(channel.name)}${channel.can_send_messages ? "" : "（送信権限なし）"}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderGuardModerationTargetChannelsField(featureId, selectedValues, guild) {
  const channels = guild?.text_channels ?? [];
  const label = featureId === "other_links" || featureId === "invite_spam" ? "URL無効チャンネル" : "禁止チャンネル";
  const selectedIds = new Set(normalizeGuardModerationChannelIds(selectedValues));
  if (!channels.length) {
    const optionText = selectedIds.size ? `保存済み: ${[...selectedIds].join(", ")}` : "Guard APIに接続すると選択できます";
    return `
      <label class="field guard-moderation-channel-field">
        <span>${escapeHtml(label)}</span>
        <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="target_channel_ids" multiple disabled>
          <option value="">${escapeHtml(optionText)}</option>
        </select>
        <small>全チャンネル対象をオフにした時、ここで選んだチャンネルだけに適用します。</small>
      </label>
    `;
  }
  return `
    <label class="field guard-moderation-channel-field">
      <span>${escapeHtml(label)}</span>
      <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="target_channel_ids" multiple size="${Math.min(Math.max(channels.length, 3), 6)}">
        ${channels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${selectedIds.has(channel.id) ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
      </select>
      <small>全チャンネル対象をオフにした時、ここで選んだチャンネルだけに適用します。</small>
    </label>
  `;
}

function renderGuardModerationTargetChannelsFieldAdditive(featureId, selectedValues, guild) {
  const channels = guild?.text_channels ?? [];
  const label = featureId === "other_links" || featureId === "invite_spam" ? "URL無効チャンネル" : "禁止チャンネル";
  const selectedIds = new Set(normalizeGuardModerationChannelIds(selectedValues));
  if (!channels.length) {
    const optionText = selectedIds.size ? `保存済み: ${[...selectedIds].join(", ")}` : "Guard APIに接続すると選択できます";
    return `
      <label class="field guard-moderation-channel-field">
        <span>${escapeHtml(label)}</span>
        <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="target_channel_ids_add" disabled>
          <option value="">${escapeHtml(optionText)}</option>
        </select>
        <small>全チャンネル対象をオフにすると、追加済みのチャンネルだけに適用します。</small>
      </label>
    `;
  }

  const availableChannels = channels.filter((channel) => !selectedIds.has(String(channel.id)));
  const selectedRows = [...selectedIds].map((channelId) => {
    const channel = channels.find((item) => String(item.id) === channelId);
    return {
      id: channelId,
      label: channel ? `#${channel.name}` : channelId,
    };
  });

  return `
    <label class="field guard-moderation-channel-field">
      <span>${escapeHtml(label)}</span>
      <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="target_channel_ids_add" ${availableChannels.length ? "" : "disabled"}>
        <option value="">${availableChannels.length ? "追加するチャンネルを選択" : "追加できるチャンネルはありません"}</option>
        ${availableChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}">#${escapeHtml(channel.name)}</option>`).join("")}
      </select>
      <div class="guard-moderation-channel-list" role="list">
        ${selectedRows.length
          ? selectedRows.map((channel) => `
            <button class="guard-moderation-channel-chip" type="button" data-action="remove-guard-moderation-channel" data-guard-moderation-feature="${escapeAttribute(featureId)}" data-channel-id="${escapeAttribute(channel.id)}" title="対象から外す">
              <span>${escapeHtml(channel.label)}</span>${icon("trash")}
            </button>
          `).join("")
          : `<span class="guard-moderation-channel-empty">まだ追加されていません</span>`}
      </div>
      <small>全チャンネル対象をオフにすると、追加済みのチャンネルだけに適用します。チャンネルは選ぶたびに追加されます。</small>
    </label>
  `;
}

function renderGuardLogging() {
  const form = normalizeGuardLoggingForm(state.guard.loggingForm);
  const selectedGuild = guardLoggingSelectedGuild();
  const dirty = isViewDirty("guardLogging");
  return `
    ${renderGuardApiNotice()}
    <section class="settings-panel guard-verification-panel guard-logging-panel" id="guard-logging-settings">
      <div class="settings-panel__header">
        <div class="panel-heading">${icon("activity")}<h2>ログ機能</h2></div>
        <div class="settings-panel__header-actions">
          <span class="feature-status ${state.guard.source === "api" ? "feature-status--on" : ""}">${state.guard.source === "api" ? "設定可能" : "未接続"}</span>
          <button class="icon-button icon-button--primary save-button ${dirty ? "save-button--dirty" : ""}" type="button" data-action="save-guard-logging-settings" data-save-view="guardLogging" ${state.guard.loggingSaving ? "disabled" : ""}>
            ${icon("save")}<span>${state.guard.loggingSaving ? "保存中" : "変更を保存"}</span>
          </button>
        </div>
      </div>
      <div class="status-banner guard-privacy-note">
        ${icon("activity")}<span>参加、脱退、ロール付与、VC入退室、メッセージ削除・編集のログ送信先をイベントごとに設定します。</span>
      </div>
      ${state.guard.loggingError ? `<p class="status-banner status-banner--error">${icon("alert")}<span>${escapeHtml(state.guard.loggingError)}</span></p>` : ""}
      ${state.guard.loggingMessage ? `<p class="status-banner status-banner--success">${icon("success")}<span>${escapeHtml(state.guard.loggingMessage)}</span></p>` : ""}
      <form class="guard-moderation-form guard-logging-form" data-guard-logging-form>
        <div class="field guard-selected-server">
          <span>選択中のサーバー</span>
          <strong>${escapeHtml(selectedGuild?.name ?? "右側のサーバー一覧から選択してください")}</strong>
          <small>${escapeHtml(selectedGuild?.id ?? "未選択")}</small>
        </div>
        <div class="guard-moderation-grid guard-logging-grid">
          ${GUARD_LOGGING_EVENTS.map((event) => renderGuardLoggingEventCard(event, form.events[event.id], selectedGuild)).join("")}
        </div>
      </form>
      ${state.guard.verificationOptionsError ? `<p class="guard-inline-hint">チャンネル候補を読み込めませんでした: ${escapeHtml(state.guard.verificationOptionsError)}</p>` : ""}
    </section>
  `;
}

function renderGuardLoggingEventCard(event, settings, guild) {
  const normalized = normalizeGuardLoggingEventSettings(event.id, settings);
  const configured = Boolean(normalized.enabled && normalized.channel_id);
  const statusText = configured ? "有効" : normalized.enabled ? "未設定" : "無効";
  return `
    <article class="feature-card guard-moderation-card guard-logging-card">
      <div class="feature-card__header">
        <div class="panel-heading">${icon(event.icon)}<h2>${escapeHtml(event.label)}</h2></div>
        <span class="feature-status ${configured ? "feature-status--on" : ""}">${statusText}</span>
      </div>
      <p class="guard-moderation-card__description">${escapeHtml(event.description)}</p>
      <div class="settings-grid guard-moderation-card__fields guard-logging-card__fields">
        <label class="toggle-row guard-verification-toggle">
          <input type="checkbox" data-guard-logging-event="${escapeAttribute(event.id)}" data-guard-logging-field="enabled" ${normalized.enabled ? "checked" : ""} />
          <span>このログを有効にする</span>
        </label>
        ${renderGuardLoggingChannelField(event.id, normalized.channel_id, guild)}
      </div>
    </article>
  `;
}

function renderGuardLoggingChannelField(eventId, selectedValue, guild) {
  const channels = guild?.text_channels ?? [];
  if (!channels.length) {
    const optionText = selectedValue ? `保存済み: ${selectedValue}` : "Guard APIに接続すると選択できます";
    return `
      <label class="field">
        <span>ログ送信先チャンネル</span>
        <select data-guard-logging-event="${escapeAttribute(eventId)}" data-guard-logging-field="channel_id" disabled>
          <option value="${escapeAttribute(selectedValue)}">${escapeHtml(optionText)}</option>
        </select>
      </label>
    `;
  }
  return `
    <label class="field">
      <span>ログ送信先チャンネル</span>
      <select data-guard-logging-event="${escapeAttribute(eventId)}" data-guard-logging-field="channel_id">
        <option value="">未設定</option>
        ${channels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === selectedValue ? "selected" : ""}>#${escapeHtml(channel.name)}${channel.can_send_messages ? "" : "（送信権限なし）"}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderGuardVerificationGuildField(guilds, selectedGuildId) {
  if (!guilds.length) {
    return `
      <label class="field">
        <span>サーバーID</span>
        <input type="text" data-guard-verification-field="guild_id" value="${escapeAttribute(selectedGuildId)}" placeholder="Discord Guild ID" />
      </label>
    `;
  }
  return `
    <label class="field">
      <span>サーバー</span>
      <select data-guard-verification-field="guild_id">
        ${guilds.map((guild) => `<option value="${escapeAttribute(guild.id)}" ${guild.id === selectedGuildId ? "selected" : ""}>${escapeHtml(guild.name)} (${escapeHtml(guild.id)})</option>`).join("")}
      </select>
    </label>
  `;
}

function renderGuardVerificationChannelField(field, label, selectedValue, guild) {
  const channels = guild?.text_channels ?? [];
  if (!channels.length) {
    const optionText = selectedValue ? `保存済み: ${selectedValue}` : "Guard APIに接続すると選択できます";
    return `
      <label class="field">
        <span>${escapeHtml(label)}</span>
        <select data-guard-verification-field="${escapeAttribute(field)}" disabled>
          <option value="${escapeAttribute(selectedValue)}">${escapeHtml(optionText)}</option>
        </select>
      </label>
    `;
  }
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <select data-guard-verification-field="${escapeAttribute(field)}">
        <option value="">未設定</option>
        ${channels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === selectedValue ? "selected" : ""}>#${escapeHtml(channel.name)}${channel.can_send_messages ? "" : "（送信権限なし）"}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderGuardVerificationRoleField(selectedValue, guild) {
  const roles = guild?.roles ?? [];
  if (!roles.length) {
    const optionText = selectedValue ? `保存済み: ${selectedValue}` : "Guard APIに接続すると選択できます";
    return `
      <label class="field">
        <span>認証後に付与するロール</span>
        <select data-guard-verification-field="role_id" disabled>
          <option value="${escapeAttribute(selectedValue)}">${escapeHtml(optionText)}</option>
        </select>
      </label>
    `;
  }
  return `
    <label class="field">
      <span>認証後に付与するロール</span>
      <select data-guard-verification-field="role_id">
        <option value="">未設定</option>
        ${roles.map((role) => `<option value="${escapeAttribute(role.id)}" ${role.id === selectedValue ? "selected" : ""}>@${escapeHtml(role.name)}${role.managed ? "（管理ロール）" : role.can_assign ? "" : "（付与不可）"}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderGuardVerificationServerSettings(guilds) {
  const rows = guilds.map((guild) => {
    const settings = state.guard.verificationSettings.find((item) => item.guild_id === guild.id);
    const active = state.guard.verificationForm.guild_id === guild.id;
    const configured = Boolean(settings?.button_channel_id && settings?.log_channel_id && settings?.role_id);
    const statusText = configured ? (settings.enabled ? "有効" : "無効") : "未設定";
    return `
      <article class="guard-server-row ${active ? "guard-server-row--active" : ""}">
        <span class="guild-row__icon guild-row__icon--fallback">${escapeHtml(guild.name.slice(0, 1))}</span>
        <span>
          <strong>${escapeHtml(guild.name)}</strong>
          <small>${escapeHtml(statusText)} / ボタン ${escapeHtml(channelNameForGuard(guild, settings?.button_channel_id))} / ログ ${escapeHtml(channelNameForGuard(guild, settings?.log_channel_id))} / ロール ${escapeHtml(roleNameForGuard(guild, settings?.role_id))}</small>
        </span>
        <button class="icon-button icon-button--ghost" type="button" data-action="guard-edit-verification-guild" data-guard-guild-id="${escapeAttribute(guild.id)}">
          ${icon("settings")}<span>${active ? "編集中" : "編集"}</span>
        </button>
      </article>
    `;
  });
  return `
    <div class="guard-server-list guard-verification-server-list">
      ${rows.length ? rows.join("") : renderGuardVerificationEmpty("Guard APIに接続すると、サーバーごとに認証設定を編集できます。")}
    </div>
  `;
}

function channelNameForGuard(guild, channelId) {
  if (!channelId) {
    return "未設定";
  }
  const channel = (guild?.text_channels ?? []).find((item) => item.id === channelId);
  return channel ? `#${channel.name}` : String(channelId);
}

function roleNameForGuard(guild, roleId) {
  if (!roleId) {
    return "未設定";
  }
  const role = (guild?.roles ?? []).find((item) => item.id === roleId);
  return role ? `@${role.name}` : String(roleId);
}

function renderGuardVerificationEmpty(message) {
  return `
    <div class="guard-verification-empty">
      ${icon("info")}<span>${escapeHtml(message)}</span>
    </div>
  `;
}

function guardLiveGuilds() {
  const map = new Map();
  (state.guard.verificationOptions?.guilds ?? []).forEach((guild) => {
    map.set(guild.id, guild);
  });
  (state.guard.status.guilds ?? []).forEach((guild) => {
    const id = String(guild?.id ?? "");
    if (!id) {
      return;
    }
    const current = map.get(id);
    const statusGuild = {
      id,
      name: String(guild?.name ?? id),
      icon_url: normalizeNullableString(guild?.icon_url),
      member_count: Number(guild?.member_count ?? 0),
      text_channels: [],
      roles: [],
    };
    if (current) {
      map.set(id, {
        ...statusGuild,
        ...current,
        icon_url: current.icon_url || statusGuild.icon_url,
        member_count: current.member_count || statusGuild.member_count,
      });
    } else {
      map.set(id, statusGuild);
    }
  });
  return [...map.values()];
}

function guardVerificationGuilds() {
  const map = new Map(guardLiveGuilds().map((guild) => [guild.id, guild]));
  state.guard.verificationSettings.forEach((settings) => {
    if (settings.guild_id && !map.has(settings.guild_id)) {
      map.set(settings.guild_id, { id: settings.guild_id, name: settings.guild_id, icon_url: null, member_count: 0, text_channels: [], roles: [] });
    }
  });
  return [...map.values()];
}

function guardVerificationSelectedGuild() {
  return guardConfigurableGuilds().find((guild) => guild.id === state.guard.verificationForm.guild_id) ?? null;
}

function guardModerationSelectedGuild() {
  return guardConfigurableGuilds().find((guild) => guild.id === state.guard.moderationForm.guild_id) ?? null;
}

function guardLoggingSelectedGuild() {
  return guardConfigurableGuilds().find((guild) => guild.id === state.guard.loggingForm.guild_id) ?? null;
}

function activeGuardSelectedGuild() {
  const featureId = activeGuardFeature().id;
  if (featureId === "moderation") {
    return guardModerationSelectedGuild();
  }
  if (featureId === "logging") {
    return guardLoggingSelectedGuild();
  }
  return guardVerificationSelectedGuild();
}

function guardConfigurableGuilds() {
  const guardGuildsById = new Map(guardLiveGuilds().map((guild) => [guild.id, guild]));
  if (state.guilds.length === 0) {
    return [...guardGuildsById.values()];
  }
  return state.guilds
    .filter((guild) => guild.can_manage && guardGuildsById.has(String(guild?.id ?? "")))
    .map((guild) => mergeGuardGuild(guild, guardGuildsById.get(String(guild?.id ?? ""))));
}

function guardInstallableGuilds() {
  if (state.guilds.length === 0) {
    return [];
  }
  const guardGuildIds = new Set(guardLiveGuilds().map((guild) => guild.id));
  return state.guilds
    .filter((guild) => guild.can_manage && !guardGuildIds.has(String(guild?.id ?? "")))
    .map((guild) => ({
      ...guild,
      bot_present: false,
      bot_invite_url: buildGuardBotInviteUrl(guild.id),
    }));
}

function mergeGuardGuild(guild, guardGuild) {
  return {
    id: String(guild?.id ?? guardGuild?.id ?? ""),
    name: String(guild?.name ?? guardGuild?.name ?? guild?.id ?? "Unknown Guild"),
    icon_url: normalizeNullableString(guild?.icon_url) || normalizeNullableString(guardGuild?.icon_url),
    member_count: Number(guardGuild?.member_count ?? guild?.member_count ?? 0),
    text_channels: Array.isArray(guardGuild?.text_channels) ? guardGuild.text_channels : [],
    roles: Array.isArray(guardGuild?.roles) ? guardGuild.roles : [],
    bot_present: Boolean(guardGuild?.id),
    can_manage: Boolean(guild?.can_manage),
    bot_invite_url: null,
  };
}

function buildGuardBotInviteUrl(guildId) {
  const id = String(guildId ?? "");
  if (!id) {
    return null;
  }
  const query = new URLSearchParams({
    client_id: GUARD_DISCORD_CLIENT_ID,
    permissions: GUARD_BOT_PERMISSIONS,
    integration_type: "0",
    scope: "bot",
    guild_id: id,
    disable_guild_select: "true",
  });
  return `https://discord.com/oauth2/authorize?${query.toString()}`;
}

function renderGuardSettings() {
  return renderGuardFeatureContent(activeGuardFeature());
}

function saveGuardApiBase() {
  const input = root.querySelector("#guardApiBaseInput");
  const rawValue = input instanceof HTMLInputElement ? input.value : "";
  const validationMessage = validateGuardApiBase(rawValue);
  if (validationMessage) {
    state.guard.verificationError = validationMessage;
    state.guard.moderationError = validationMessage;
    state.guard.loggingError = validationMessage;
    state.guard.verificationMessage = null;
    state.guard.moderationMessage = null;
    state.guard.loggingMessage = null;
    render();
    return;
  }
  const value = cleanGuardApiBase(rawValue);
  state.guard.apiBase = value ?? "";
  state.guard.apiError = null;
  state.guard.verificationError = null;
  state.guard.moderationError = null;
  state.guard.loggingError = null;
  state.guard.verificationMessage = value
    ? "Guard API URLを保存しました。"
    : "Guard API URLをクリアしました。";
  state.guard.moderationMessage = state.guard.verificationMessage;
  state.guard.loggingMessage = state.guard.verificationMessage;
  try {
    if (value) {
      localStorage.setItem(GUARD_API_BASE_STORAGE_KEY, value);
    } else {
      localStorage.removeItem(GUARD_API_BASE_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors in restricted browser contexts.
  }
  void loadGuardData();
}

function clearGuardApiBase() {
  state.guard.apiBase = "";
  state.guard.apiError = null;
  state.guard.verificationError = null;
  state.guard.moderationError = null;
  state.guard.loggingError = null;
  state.guard.verificationMessage = "Guard API URLをクリアしました。";
  state.guard.moderationMessage = "Guard API URLをクリアしました。";
  state.guard.loggingMessage = "Guard API URLをクリアしました。";
  try {
    localStorage.removeItem(GUARD_API_BASE_STORAGE_KEY);
  } catch {
    // Ignore storage errors in restricted browser contexts.
  }
  void loadGuardData();
}

function updateGuardVerificationField(target, options = { renderAfter: true }) {
  const field = target.dataset.guardVerificationField;
  if (!field) {
    return;
  }
  if (field === "guild_id") {
    const guildId = target.value;
    if (target instanceof HTMLSelectElement) {
      requestGuardGuildChange(guildId);
    } else {
      state.guard.verificationForm = { ...state.guard.verificationForm, guild_id: guildId };
      updateDirtyState("guardVerification");
      if (options.renderAfter) {
        render();
      }
    }
    return;
  }

  const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
  state.guard.verificationForm = {
    ...state.guard.verificationForm,
    [field]: field === "duplicate_action" ? normalizeGuardDuplicateAction(value) : value,
  };
  state.guard.verificationError = null;
  updateDirtyState("guardVerification");
  if (options.renderAfter) {
    render();
  }
}

async function saveGuardVerificationSettings() {
  if (!state.guard.apiBase) {
    state.guard.verificationError = "Guard APIに接続できません。";
    render();
    return false;
  }
  const form = normalizeGuardVerificationForm(state.guard.verificationForm);
  if (!form.guild_id || !form.button_channel_id || !form.log_channel_id || !form.role_id) {
    state.guard.verificationError = "サーバー、認証ボタン配置チャンネル、ログチャンネル、付与ロールを指定してください。";
    render();
    return false;
  }

  state.guard.verificationSaving = true;
  state.guard.verificationError = null;
  state.guard.verificationMessage = null;
  render();

  let saved = false;
  try {
    const payload = await guardFetchJson(guardApiUrl("/verification/settings"), {
      method: "POST",
      body: JSON.stringify({ settings: form }),
    });
    const nextSettings = normalizeGuardVerificationSettings([payload?.settings]);
    state.guard.verificationSettings = [
      ...state.guard.verificationSettings.filter((item) => item.guild_id !== form.guild_id),
      ...nextSettings,
    ];
    rememberSavedGuardVerificationForm(nextSettings[0] ?? form);
    clearPendingNavigation();
    const panel = payload?.panel;
    if (panel?.status === "published") {
      state.guard.verificationMessage = "認証設定を保存し、選択チャンネルへ認証ボタンを設置しました。";
    } else if (panel?.message) {
      state.guard.verificationMessage = `認証設定は保存しました。認証ボタンの設置は未完了です: ${panel.message}`;
    } else {
      state.guard.verificationMessage = "認証設定を保存しました。";
    }
    saved = true;
    await loadGuardData({ silent: true, renderAfter: false });
  } catch (error) {
    state.guard.verificationError = error instanceof Error ? error.message : String(error);
  } finally {
    state.guard.verificationSaving = false;
    render();
  }
  return saved;
}

function updateGuardModerationField(target, options = { renderAfter: true }) {
  const featureId = target.dataset.guardModerationFeature;
  const field = target.dataset.guardModerationField;
  if (!featureId || !field || !GUARD_MODERATION_FEATURES.some((feature) => feature.id === featureId)) {
    return;
  }
  const form = normalizeGuardModerationForm(state.guard.moderationForm);
  const currentFeature = normalizeGuardModerationFeatureSettings(featureId, form.features[featureId]);
  if (field === "target_channel_ids_add") {
    const channelId = String(target.value ?? "").trim();
    if (!channelId) {
      return;
    }
    form.features[featureId] = normalizeGuardModerationFeatureSettings(featureId, {
      ...currentFeature,
      all_channels_enabled: false,
      target_channel_ids: normalizeGuardModerationChannelIds([
        ...currentFeature.target_channel_ids,
        channelId,
      ]),
    });
    target.value = "";
    state.guard.moderationForm = form;
    state.guard.moderationError = null;
    updateDirtyState("guardModeration");
    if (options.renderAfter) {
      render();
    }
    return;
  }
  const value = target instanceof HTMLInputElement && target.type === "checkbox"
    ? target.checked
    : target instanceof HTMLSelectElement && target.multiple
      ? Array.from(target.selectedOptions).map((option) => option.value)
      : target.value;
  form.features[featureId] = normalizeGuardModerationFeatureSettings(featureId, {
    ...currentFeature,
    [field]: field === "level"
      ? normalizeGuardModerationLevel(value)
      : field === "action"
        ? normalizeGuardModerationAction(value, GUARD_MODERATION_DEFAULTS[featureId]?.action)
        : field === "target_channel_ids"
          ? normalizeGuardModerationChannelIds(value)
        : value,
    ...(field === "target_channel_ids" ? { all_channels_enabled: false } : {}),
  });
  state.guard.moderationForm = form;
  state.guard.moderationError = null;
  updateDirtyState("guardModeration");
  if (options.renderAfter) {
    render();
  }
}

function removeGuardModerationTargetChannel(featureId, channelId) {
  if (!GUARD_MODERATION_FEATURES.some((feature) => feature.id === featureId)) {
    return;
  }
  const normalizedChannelId = String(channelId ?? "").trim();
  if (!normalizedChannelId) {
    return;
  }
  const form = normalizeGuardModerationForm(state.guard.moderationForm);
  const currentFeature = normalizeGuardModerationFeatureSettings(featureId, form.features[featureId]);
  form.features[featureId] = normalizeGuardModerationFeatureSettings(featureId, {
    ...currentFeature,
    target_channel_ids: currentFeature.target_channel_ids.filter((item) => item !== normalizedChannelId),
  });
  state.guard.moderationForm = form;
  state.guard.moderationError = null;
  updateDirtyState("guardModeration");
  render();
}

async function saveGuardModerationSettings() {
  if (!state.guard.apiBase) {
    state.guard.moderationError = "Guard APIに接続できません。";
    render();
    return false;
  }
  const form = normalizeGuardModerationForm(state.guard.moderationForm);
  if (!form.guild_id) {
    state.guard.moderationError = "サーバーを選択してください。";
    render();
    return false;
  }

  state.guard.moderationSaving = true;
  state.guard.moderationError = null;
  state.guard.moderationMessage = null;
  render();

  let saved = false;
  try {
    const payload = await guardFetchJson(guardApiUrl("/moderation/settings"), {
      method: "POST",
      body: JSON.stringify({ settings: form }),
    });
    const nextSettings = normalizeGuardModerationSettings([payload?.settings]);
    state.guard.moderationSettings = [
      ...state.guard.moderationSettings.filter((item) => item.guild_id !== form.guild_id),
      ...nextSettings,
    ];
    rememberSavedGuardModerationForm(nextSettings[0] ?? form);
    clearPendingNavigation();
    state.guard.moderationMessage = "荒らし対策の設定を保存しました。";
    saved = true;
    await loadGuardData({ silent: true, renderAfter: false });
  } catch (error) {
    state.guard.moderationError = error instanceof Error ? error.message : String(error);
  } finally {
    state.guard.moderationSaving = false;
    render();
  }
  return saved;
}

function updateGuardLoggingField(target, options = { renderAfter: true }) {
  const eventId = target.dataset.guardLoggingEvent;
  const field = target.dataset.guardLoggingField;
  if (!eventId || !field || !GUARD_LOGGING_EVENTS.some((event) => event.id === eventId)) {
    return;
  }
  const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
  const form = normalizeGuardLoggingForm(state.guard.loggingForm);
  form.events[eventId] = normalizeGuardLoggingEventSettings(eventId, {
    ...form.events[eventId],
    [field]: value,
  });
  state.guard.loggingForm = form;
  state.guard.loggingError = null;
  updateDirtyState("guardLogging");
  if (options.renderAfter) {
    render();
  }
}

async function saveGuardLoggingSettings() {
  if (!state.guard.apiBase) {
    state.guard.loggingError = "Guard APIに接続できません。";
    render();
    return false;
  }
  const form = normalizeGuardLoggingForm(state.guard.loggingForm);
  if (!form.guild_id) {
    state.guard.loggingError = "サーバーを選択してください。";
    render();
    return false;
  }

  state.guard.loggingSaving = true;
  state.guard.loggingError = null;
  state.guard.loggingMessage = null;
  render();

  let saved = false;
  try {
    const payload = await guardFetchJson(guardApiUrl("/logging/settings"), {
      method: "POST",
      body: JSON.stringify({ settings: form }),
    });
    const nextSettings = normalizeGuardLoggingSettings([payload?.settings]);
    state.guard.loggingSettings = [
      ...state.guard.loggingSettings.filter((item) => item.guild_id !== form.guild_id),
      ...nextSettings,
    ];
    rememberSavedGuardLoggingForm(nextSettings[0] ?? form);
    clearPendingNavigation();
    state.guard.loggingMessage = "ログ機能の設定を保存しました。";
    saved = true;
    await loadGuardData({ silent: true, renderAfter: false });
  } catch (error) {
    state.guard.loggingError = error instanceof Error ? error.message : String(error);
  } finally {
    state.guard.loggingSaving = false;
    render();
  }
  return saved;
}

function guardEventLevel(value) {
  const raw = String(value ?? "").toLowerCase();
  if (raw.includes("warning") || raw.includes("suspicious") || raw.includes("moderation") || raw.includes("mention") || raw.includes("url")) {
    return "warning";
  }
  if (raw.includes("ready") || raw.includes("joined") || raw.includes("success")) {
    return "success";
  }
  return "info";
}

function guardEventName(value) {
  return String(value ?? "event").replace(/_/g, " ");
}

function guardActorName(value) {
  return value?.name ?? value?.id ?? "System";
}

function guardGuildName(value) {
  return value?.name ?? value?.id ?? "Unknown Guild";
}

function guardText(value, fallback = "未取得") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function renderWorkspaceContent() {
  const view = activeSettingsView();
  if (view === "user") {
    return renderUserPage();
  }
  if (view === "host") {
    return renderHostAdminPanel();
  }
  return view === "tts" ? renderSettingsForm() : renderFeatureSettingsForm();
}

function activeSettingsPage() {
  if (state.activePage === USER_PAGE.id) {
    return USER_PAGE;
  }
  const pages = visibleSettingsPages();
  return pages.find((page) => page.id === state.activePage) ?? pages[0] ?? SETTINGS_PAGES[0];
}

function activeSettingsView() {
  return activeSettingsPage().view;
}

function renderFunctionSidebar() {
  return `
    <aside class="function-sidebar" aria-label="機能メニュー">
      <div class="function-sidebar__label">サーバー設定</div>
      <div class="function-sidebar__items" role="tablist" aria-orientation="vertical" aria-label="設定ページ">
        ${visibleSettingsPages().map(renderFunctionNavItem).join("")}
      </div>
    </aside>
  `;
}

function renderFunctionNavItem(page) {
  const active = activeSettingsPage().id === page.id;
  return `
    <div class="function-nav-entry">
      <button class="function-nav-item ${active ? "function-nav-item--active" : ""}" type="button" role="tab" aria-selected="${active}" data-tab="${page.id}">
        ${icon(page.icon)}
        <span class="function-nav-item__body">
          <strong>${escapeHtml(page.label)}</strong>
          <span>${escapeHtml(page.description)}</span>
        </span>
      </button>
      ${renderInfoPopover(page.help, `${page.label}の説明`)}
    </div>
  `;
}

function renderInfoPopover(text, label) {
  const tooltip = String(text ?? "").trim();
  if (!tooltip) {
    return "";
  }
  return `
    <span class="info-help" aria-label="${escapeAttribute(label)}" title="${escapeAttribute(tooltip)}">
      ${icon("info")}
      <span class="info-popover" role="tooltip">${escapeHtml(tooltip)}</span>
    </span>
  `;
}

function renderGuildList() {
  const manageableGuilds = state.guilds.filter((guild) => guild.bot_present && guild.can_manage);
  const installableGuilds = state.guilds.filter((guild) => !guild.bot_present && guild.can_manage);
  const guild = selectedGuild();
  const guildListExpanded = !state.guildListCollapsed;
  return `
    <aside class="guild-list ${state.guildListCollapsed ? "guild-list--collapsed" : ""}" aria-label="Discordサーバー">
      <div class="guild-list__header">
        <div class="panel-heading">
          ${icon("server")}<h2>サーバー</h2>
        </div>
        <button class="guild-list__toggle" type="button" data-action="toggle-guild-list" aria-expanded="${guildListExpanded}" aria-controls="guild-list-body">
          <span>${guildListExpanded ? "閉じる" : "開く"}</span>${icon(guildListExpanded ? "chevronUp" : "chevronDown")}
        </button>
      </div>
      <div class="guild-list__mobile-summary">
        <span>選択中</span>
        <strong>${escapeHtml(guild?.name ?? "サーバー未選択")}</strong>
        <small>設定可能 ${manageableGuilds.length} / BOT未導入 ${installableGuilds.length}</small>
      </div>
      <div class="guild-list__body" id="guild-list-body">
        ${renderGuildSection(
          "設定可能",
          manageableGuilds.length,
          manageableGuilds.length > 0
            ? manageableGuilds.map(renderManageableGuild).join("")
            : `<div class="empty-state">BOTが入っていて管理権限があるサーバーがありません。</div>`,
        )}
        ${renderGuildSection(
          "BOT未導入",
          installableGuilds.length,
          installableGuilds.length > 0
            ? installableGuilds.map(renderInstallableGuild).join("")
            : `<div class="empty-state">導入待ちのサーバーはありません。</div>`,
        )}
      </div>
    </aside>
  `;
}

function renderGuildSection(title, count, body) {
  return `
    <section class="guild-section">
      <div class="guild-section__title">
        <span>${title}</span>
        <strong>${count}</strong>
      </div>
      <div class="guild-list__items">${body}</div>
    </section>
  `;
}

function renderManageableGuild(guild) {
  return `
    <button class="guild-row ${state.selectedGuildId === guild.id ? "guild-row--selected" : ""}" type="button" data-guild-id="${escapeAttribute(guild.id)}">
      ${renderGuildIcon(guild)}
      <span class="guild-row__body">
        <span class="guild-row__name">${escapeHtml(guild.name)}</span>
        <span class="guild-row__meta">BOT導入済み / 管理権限あり</span>
      </span>
      ${icon("shield", "管理者権限あり")}
    </button>
  `;
}

function renderInstallableGuild(guild) {
  return `
    <a class="guild-row guild-row--invite" href="${escapeAttribute(guild.bot_invite_url ?? "#")}" target="_blank" rel="noreferrer">
      ${renderGuildIcon(guild)}
      <span class="guild-row__body">
        <span class="guild-row__name">${escapeHtml(guild.name)}</span>
        <span class="guild-row__meta">管理権限あり / BOT導入が必要</span>
      </span>
      <span class="guild-row__invite" aria-label="BOTを導入">${icon("external")}</span>
    </a>
  `;
}

function renderGuildIcon(guild) {
  if (guild.icon_url) {
    return `<img class="guild-row__icon" src="${escapeAttribute(guild.icon_url)}" alt="" />`;
  }
  return `<span class="guild-row__icon guild-row__icon--fallback">${escapeHtml((guild.name || "?").slice(0, 1))}</span>`;
}

function renderUserPage() {
  const playlist = state.playlist ?? normalizePlaylist(null);
  return `
    <section class="settings-panel user-page" aria-label="ユーザーページ">
      <div class="settings-panel__header">
        <div class="panel-heading">
          ${icon("user")}<h2>ユーザーページ</h2>
        </div>
        <button class="icon-button icon-button--ghost" type="button" data-action="playlist-refresh" ${state.playlistLoading ? "disabled" : ""}>
          ${icon("refresh")}<span>${state.playlistLoading ? "更新中" : "プレイリスト更新"}</span>
        </button>
      </div>
      <div class="user-page__grid">
        <section class="feature-card user-profile-card">
          <div class="feature-card__header">
            <div class="panel-heading">
              ${icon("user")}<h2>プロフィール</h2>
            </div>
            <span class="feature-status feature-status--on">ログイン中</span>
          </div>
          <div class="user-profile">
            ${
              state.user?.avatar_url
                ? `<img class="user-profile__avatar" src="${escapeAttribute(state.user.avatar_url)}" alt="" />`
                : `<span class="user-profile__avatar user-profile__avatar--fallback">${icon("user")}</span>`
            }
            <div>
              <strong>${escapeHtml(state.user?.username ?? "Discord User")}</strong>
              <span>ID ${escapeHtml(state.user?.discord_user_id ?? "未取得")}</span>
            </div>
          </div>
        </section>
      </div>
      ${renderPlaylistPanel(playlist)}
      ${renderUserActivityPanel()}
    </section>
  `;
}

function renderUserActivityPanel() {
  const activity = normalizeUserActivity(state.userActivity);
  const period = ACTIVITY_PERIODS.some((item) => item.id === state.activeActivityPeriod)
    ? state.activeActivityPeriod
    : "daily";
  const points = activity[period] ?? [];
  const totals = sumActivityPoints(points);
  return `
    <section class="feature-card user-activity-panel" aria-label="アクティビティ">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("activity")}<h2>アクティビティ</h2>
        </div>
        <button class="icon-button icon-button--ghost" type="button" data-action="user-activity-refresh" ${state.userActivityLoading ? "disabled" : ""}>
          ${icon("refresh")}<span>${state.userActivityLoading ? "更新中" : "更新"}</span>
        </button>
      </div>
      <div class="activity-period-tabs" role="tablist" aria-label="アクティビティ期間">
        ${ACTIVITY_PERIODS.map((item) => `
          <button class="activity-period-tab ${period === item.id ? "activity-period-tab--active" : ""}" type="button" role="tab" aria-selected="${period === item.id}" data-activity-period="${item.id}">
            ${escapeHtml(item.label)}
          </button>
        `).join("")}
      </div>
      <div class="activity-metric-grid">
        ${renderActivityMetricCard("VC接続時間", formatActivityDuration(totals.vc_seconds), "vc_seconds", points, "activity-line--vc")}
        ${renderActivityMetricCard("送信メッセージ数", formatCompactNumber(totals.message_count), "message_count", points, "activity-line--messages")}
        ${renderActivityMetricCard("送信文字数", formatCompactNumber(totals.character_count), "character_count", points, "activity-line--characters")}
      </div>
    </section>
  `;
}

function renderActivityMetricCard(title, value, metric, points, lineClass) {
  const latest = points.at(-1);
  return `
    <article class="activity-metric-card">
      <div class="activity-metric-card__header">
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
      ${renderActivitySparkline(points, metric, lineClass)}
      <div class="activity-metric-card__footer">
        <span>${escapeHtml(points[0]?.label ?? "--")}</span>
        <span>${escapeHtml(latest?.label ?? "--")}</span>
      </div>
    </article>
  `;
}

function renderActivitySparkline(points, metric, lineClass) {
  const linePoints = activitySparklinePoints(points, metric);
  return `
    <svg class="activity-sparkline" viewBox="0 0 320 110" role="img" aria-label="アクティビティ推移">
      <path class="activity-grid-line" d="M14 18 H306 M14 55 H306 M14 92 H306"></path>
      <polyline class="activity-line ${lineClass}" points="${escapeAttribute(linePoints)}"></polyline>
    </svg>
  `;
}

function renderPlaylistPanel(playlist) {
  const tracks = playlist.tracks ?? [];
  return `
    <section class="feature-card playlist-panel" aria-label="プレイリスト">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("music")}<h2>プレイリスト</h2>
        </div>
        <span class="feature-status ${tracks.length ? "feature-status--on" : ""}">${tracks.length}曲</span>
      </div>
      <form class="playlist-url-form" data-playlist-url-form>
        <label class="field playlist-url-form__field">
          <span>YouTube URL</span>
          <input type="url" value="${escapeAttribute(state.playlistUrl)}" placeholder="https://www.youtube.com/watch?v=..." data-playlist-field="url" ${state.playlistSaving ? "disabled" : ""} />
        </label>
        <button class="icon-button icon-button--primary" type="submit" ${state.playlistSaving ? "disabled" : ""}>
          ${icon("link")}<span>${state.playlistSaving ? "登録中" : "URL登録"}</span>
        </button>
      </form>
      <div class="playlist-drop-zone ${state.playlistDragActive ? "playlist-drop-zone--active" : ""}" data-playlist-drop-zone>
        <input type="file" accept="audio/mpeg,.mp3" data-playlist-file-input hidden />
        <div>
          ${icon("upload")}
          <strong>mp3をドラッグアンドドロップ</strong>
          <span>ファイル選択からも登録できます。</span>
        </div>
        <button class="icon-button icon-button--ghost" type="button" data-action="playlist-choose-file" ${state.playlistSaving ? "disabled" : ""}>
          ${icon("folder")}<span>ファイル選択</span>
        </button>
      </div>
      <div class="playlist-track-list">
        ${
          tracks.length
            ? tracks.map(renderPlaylistTrack).join("")
            : `<div class="empty-state">登録曲はまだありません。URL登録またはmp3アップロードで追加できます。</div>`
        }
      </div>
    </section>
  `;
}

function renderPlaylistTrack(track) {
  const sourceLabel = track.source_type === "upload" ? "mp3アップロード" : "URL";
  const escapedTrackId = escapeAttribute(track.id);
  const escapedTitle = escapeAttribute(track.title);
  const previewDuration = playlistPreviewDuration(track.duration);
  const previewUrl = playlistPreviewUrl(track.id);
  return `
    <article class="playlist-track-row">
      <div class="playlist-track-row__art">
        <div class="playlist-record" aria-hidden="true">
          <span class="playlist-record__shine"></span>
          <span class="playlist-record__groove playlist-record__groove--outer"></span>
          <span class="playlist-record__groove playlist-record__groove--inner"></span>
          <span class="playlist-record__label">
            ${
              track.thumbnail
                ? `<img class="playlist-record__image" src="${escapeAttribute(track.thumbnail)}" alt="" />`
                : icon(track.source_type === "upload" ? "music" : "play")
            }
          </span>
        </div>
      </div>
      <div class="playlist-track-row__body">
        <div class="playlist-track-row__title">
          <strong>${escapeHtml(track.title)}</strong>
          <span>${escapeHtml(sourceLabel)} / プレビュー${escapeHtml(formatDuration(previewDuration))} / ${escapeHtml(formatDateTime(track.created_at))}</span>
        </div>
        <div class="playlist-player" data-playlist-player data-track-id="${escapedTrackId}" data-track-title="${escapedTitle}" data-track-duration="${escapeAttribute(previewDuration)}">
          <audio class="playlist-player__audio" preload="auto" src="${escapeAttribute(previewUrl)}" data-track-audio data-track-id="${escapedTrackId}"></audio>
          <button class="playlist-player__toggle" type="button" data-action="playlist-toggle-play" data-track-id="${escapedTrackId}" aria-label="${escapedTitle}を再生">
            ${icon("play")}
          </button>
          <div class="playlist-player__timeline">
            <span class="playlist-player__time" data-player-current>0:00</span>
            <input class="playlist-player__seek" type="range" min="0" max="1000" step="1" value="0" data-playlist-seek data-track-id="${escapedTrackId}" aria-label="${escapedTitle}の再生位置" />
            <span class="playlist-player__time playlist-player__time--duration" data-player-duration>${escapeHtml(formatPlaybackTime(previewDuration))}</span>
          </div>
        </div>
      </div>
      <button class="icon-button icon-button--ghost playlist-track-row__remove" type="button" data-action="playlist-delete-track" data-track-id="${escapedTrackId}" title="削除" ${state.playlistSaving ? "disabled" : ""}>
        ${icon("trash")}
      </button>
    </article>
  `;
}

function playlistPreviewUrl(trackId) {
  const token = getAuthToken();
  const query = token ? `?session_token=${encodeURIComponent(token)}` : "";
  return `${API_BASE_URL}/playlist/tracks/${encodeURIComponent(trackId)}/preview${query}`;
}

function syncPlaylistPlayers() {
  root.querySelectorAll("[data-playlist-player]").forEach((player) => {
    const audio = player.querySelector("[data-track-audio]");
    if (audio instanceof HTMLAudioElement) {
      syncPlaylistPlayer(player, audio);
      syncPlaylistPlayerState(player, audio);
    }
  });
}

function handlePlaylistAudioEvent(event) {
  const audio = event.target;
  if (!(audio instanceof HTMLAudioElement) || !("trackAudio" in audio.dataset)) {
    return;
  }

  if (event.type === "play" || event.type === "playing") {
    pauseOtherPlaylistAudio(audio);
    startPlaylistProgressLoop();
  }

  const player = audio.closest("[data-playlist-player]");
  if (player) {
    syncPlaylistPlayer(player, audio);
    syncPlaylistPlayerState(player, audio);
  }
  if (event.type === "pause" || event.type === "ended") {
    stopPlaylistProgressLoopIfIdle();
  }
}

function togglePlaylistTrackPlayback(trackId) {
  const audio = findPlaylistAudio(trackId);
  if (!audio) {
    return;
  }
  const player = audio.closest("[data-playlist-player]");

  if (!audio.paused && !audio.ended) {
    audio.pause();
    if (player) {
      syncPlaylistPlayerState(player, audio);
    }
    return;
  }

  pauseOtherPlaylistAudio(audio);
  if (audio.ended) {
    audio.currentTime = 0;
  }
  if (audio.readyState === 0) {
    audio.load();
  }
  if (player) {
    syncPlaylistPlayerState(player, audio, true);
  }
  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise
      .then(() => {
        if (player) {
          syncPlaylistPlayerState(player, audio);
        }
        startPlaylistProgressLoop();
      })
      .catch(() => {
        if (player) {
          syncPlaylistPlayerState(player, audio, false);
        }
        state.playlistError = "プレビューを再生できませんでした。時間をおいて再試行してください。";
        render();
      });
  }
}

function findPlaylistAudio(trackId) {
  return (
    Array.from(root.querySelectorAll("[data-track-audio]")).find(
      (audio) => audio instanceof HTMLAudioElement && audio.dataset.trackId === trackId,
    ) ?? null
  );
}

function pauseOtherPlaylistAudio(activeAudio) {
  root.querySelectorAll("[data-track-audio]").forEach((audio) => {
    if (audio instanceof HTMLAudioElement && audio !== activeAudio && !audio.paused) {
      audio.pause();
    }
  });
}

function handlePlaylistSeekInput(input) {
  const player = input.closest("[data-playlist-player]");
  const audio = player?.querySelector("[data-track-audio]");
  if (!(audio instanceof HTMLAudioElement) || !player) {
    return;
  }

  const duration = playlistAudioDuration(audio, player);
  if (duration <= 0) {
    return;
  }

  const max = Number(input.max) || 1000;
  const ratio = clampNumber(Number(input.value) / max, 0, 1);
  try {
    audio.currentTime = ratio * duration;
  } catch {
    // Some browsers reject seeking before metadata is available.
  }
  syncPlaylistPlayer(player, audio, ratio * duration);
}

function syncPlaylistPlayer(player, audio, displayCurrentTime = null) {
  const duration = playlistAudioDuration(audio, player);
  const rawCurrentTime = displayCurrentTime ?? (Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
  const currentTime = duration > 0 ? clampNumber(rawCurrentTime, 0, duration) : Math.max(0, rawCurrentTime);
  const progressRatio = duration > 0 ? clampNumber(currentTime / duration, 0, 1) : 0;
  const progress = `${(progressRatio * 100).toFixed(2)}%`;
  const current = player.querySelector("[data-player-current]");
  const durationLabel = player.querySelector("[data-player-duration]");
  const seek = player.querySelector("[data-playlist-seek]");

  player.style.setProperty("--progress", progress);
  if (current) {
    current.textContent = formatPlaybackTime(currentTime);
  }
  if (durationLabel) {
    durationLabel.textContent = formatPlaybackTime(duration);
  }
  if (seek instanceof HTMLInputElement) {
    seek.value = String(Math.round(progressRatio * 1000));
    seek.disabled = duration <= 0;
  }
}

function syncPlaylistPlayerState(player, audio, forcePlaying = null) {
  const isPlaying = forcePlaying ?? (!audio.paused && !audio.ended);
  const row = player.closest(".playlist-track-row");
  const toggle = player.querySelector('[data-action="playlist-toggle-play"]');
  player.classList.toggle("playlist-player--playing", isPlaying);
  if (row) {
    row.classList.toggle("playlist-track-row--playing", isPlaying);
  }
  if (toggle instanceof HTMLButtonElement) {
    const trackTitle = player.dataset.trackTitle;
    toggle.setAttribute("aria-label", trackTitle ? `${trackTitle}を${isPlaying ? "一時停止" : "再生"}` : isPlaying ? "一時停止" : "再生");
    toggle.innerHTML = icon(isPlaying ? "pause" : "play");
  }
}

function playlistAudioDuration(audio, player) {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    return audio.duration;
  }
  const fallback = Number(player.dataset.trackDuration);
  return Number.isFinite(fallback) && fallback > 0 ? fallback : 0;
}

function playlistPreviewDuration(duration) {
  const numericDuration = Number(duration);
  if (Number.isFinite(numericDuration) && numericDuration > 0) {
    return Math.min(numericDuration, PLAYLIST_PREVIEW_DURATION_SECONDS);
  }
  return PLAYLIST_PREVIEW_DURATION_SECONDS;
}

function startPlaylistProgressLoop() {
  if (playlistAnimationFrameId != null) {
    return;
  }
  const tick = () => {
    let hasPlayingAudio = false;
    root.querySelectorAll("[data-track-audio]").forEach((audio) => {
      if (!(audio instanceof HTMLAudioElement)) {
        return;
      }
      const player = audio.closest("[data-playlist-player]");
      if (!player) {
        return;
      }
      syncPlaylistPlayer(player, audio);
      syncPlaylistPlayerState(player, audio);
      if (!audio.paused && !audio.ended) {
        hasPlayingAudio = true;
      }
    });
    playlistAnimationFrameId = hasPlayingAudio ? window.requestAnimationFrame(tick) : null;
  };
  playlistAnimationFrameId = window.requestAnimationFrame(tick);
}

function stopPlaylistProgressLoopIfIdle() {
  const hasPlayingAudio = Array.from(root.querySelectorAll("[data-track-audio]")).some(
    (audio) => audio instanceof HTMLAudioElement && !audio.paused && !audio.ended,
  );
  if (!hasPlayingAudio) {
    stopPlaylistProgressLoop();
  }
}

function stopPlaylistProgressLoop() {
  if (playlistAnimationFrameId == null) {
    return;
  }
  window.cancelAnimationFrame(playlistAnimationFrameId);
  playlistAnimationFrameId = null;
}

function renderSettingsForm() {
  if (!state.settings) {
    return renderGuildDataState();
  }
  return renderTtsSettingsForm();
}

function renderGuildDataState() {
  if (!state.selectedGuildId) {
    return `<section class="settings-panel empty-state">サーバーを選択してください。</section>`;
  }

  const guild = selectedGuild();
  const guildLabel = guild?.name ? `${guild.name} の設定` : "サーバー設定";
  if (state.loading || !state.guildDataError) {
    return `
      <section class="settings-panel empty-state guild-data-state guild-data-state--loading" aria-live="polite">
        ${icon("refresh")}
        <span>${escapeHtml(guildLabel)}を読み込み中です。</span>
      </section>
    `;
  }

  return `
    <section class="settings-panel empty-state guild-data-state" role="alert">
      ${icon("error")}
      <span>${escapeHtml(state.guildDataError)}</span>
      <button class="icon-button icon-button--ghost" type="button" data-action="reload-guild-data">
        ${icon("refresh")}<span>再読み込み</span>
      </button>
    </section>
  `;
}

function renderTtsSettingsForm() {
  const settings = state.settings;
  const dirty = isViewDirty("tts");
  const voices = state.ttsOptions?.voices?.[settings.tts_engine] ?? [];
  const availableVoices = voices.filter((voice) => voice.available !== false);
  const unavailableVoices = voices.filter((voice) => voice.available === false);
  const voiceAvailabilityLabel = !state.ttsOptions
    ? "取得中"
    : voices.length === 0
      ? "声一覧なし"
      : `${availableVoices.length}/${voices.length}件利用可能`;

  return `
    <section class="settings-panel" aria-label="読み上げ設定">
      ${renderSettingsHeader("volume", "読み上げ設定", "tts", dirty)}

      <div class="settings-grid settings-grid--tts">
        ${renderSwitch("読み上げ", "tts_enabled", settings.tts_enabled)}

        <label class="field">
          <span>デフォルト読み上げエンジン</span>
          <select data-settings-field="tts_engine">
            ${TTS_ENGINES.map((engine) => `<option value="${engine.value}" ${engine.value === settings.tts_engine ? "selected" : ""}>${engine.label}</option>`).join("")}
          </select>
        </label>

        <label class="field">
          <div class="field__header">
            <span>声</span>
            <strong>${voiceAvailabilityLabel}</strong>
          </div>
          <select data-settings-field="tts_speaker">
            <option value="default" ${settings.tts_speaker === "default" ? "selected" : ""}>デフォルト</option>
            ${availableVoices.length > 0 ? `<optgroup label="利用可能">${availableVoices.map((voice) => renderVoiceOption(voice, settings.tts_speaker, false)).join("")}</optgroup>` : ""}
            ${unavailableVoices.length > 0 ? `<optgroup label="未インストール">${unavailableVoices.map((voice) => renderVoiceOption(voice, settings.tts_speaker, true)).join("")}</optgroup>` : ""}
          </select>
        </label>

        ${renderRangeField("全体速度", "tts_speed", 0.5, 2, 0.1, `${settings.tts_speed.toFixed(1)}倍`)}
        ${renderRangeField("全体音量", "tts_volume", 0, 2, 0.1, settings.tts_volume.toFixed(1))}
        ${renderRangeField("全体ピッチ", "tts_pitch", -1, 1, 0.1, settings.tts_pitch.toFixed(1))}
        ${renderRangeField("全体抑揚", "tts_intonation", 0, 2, 0.1, settings.tts_intonation.toFixed(1))}

        <label class="field">
          <div class="field__header">
            <span>読み上げ文字数</span>
            <strong data-value-label="tts_max_text_length">${settings.tts_max_text_length}文字</strong>
          </div>
          <input type="number" min="${TTS_TEXT_LENGTH_MIN}" max="${TTS_TEXT_LENGTH_MAX}" step="1" value="${settings.tts_max_text_length}" data-settings-field="tts_max_text_length" />
        </label>

        ${renderSwitch("送信者名読み上げ", "tts_read_sender", settings.tts_read_sender)}
        ${renderSwitch("接続パネル下固定", "tts_keep_panel_bottom", settings.tts_keep_panel_bottom)}
        ${renderSwitch("入退室読み上げ", "voice_join_announce_enabled", settings.voice_join_announce_enabled)}
        ${renderSwitch("移動読み上げ", "voice_move_announce_enabled", settings.voice_move_announce_enabled)}

        ${renderAutoJoinRules(settings)}
        ${renderDictionaryRules(settings)}
      </div>

      ${
        !state.ttsOptions
          ? `<div class="settings-panel__footer">${icon("radio")}<span>チャンネル一覧を取得中</span></div>`
          : ""
      }
    </section>
  `;
}

function renderSettingsHeader(iconName, title, view, dirty) {
  return `
    <div class="settings-panel__header">
      <div class="panel-heading">
        ${icon(iconName)}<h2>${escapeHtml(title)}</h2>
      </div>
      <button class="icon-button icon-button--primary save-button ${dirty ? "save-button--dirty" : ""}" type="button" data-action="${view === "features" ? "save-feature-settings" : "save-settings"}" data-save-view="${view}" ${state.saving ? "disabled" : ""}>
        ${icon("save")}<span>${state.saving ? "保存中" : "変更を保存"}</span>
      </button>
    </div>
  `;
}

function renderVoiceOption(voice, selectedSpeaker, disabled) {
  return `<option value="${escapeAttribute(voice.name)}" ${voice.name === selectedSpeaker ? "selected" : ""} ${disabled ? "disabled" : ""}>${escapeHtml(voice.label)}${disabled ? "（未インストール）" : ""}</option>`;
}

function renderRangeField(label, field, min, max, step, valueLabel) {
  return `
    <label class="field range-field">
      <div class="range-field__header">
        <span>${label}</span>
        <strong data-value-label="${field}">${valueLabel}</strong>
      </div>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${state.settings[field]}" data-settings-field="${field}" />
    </label>
  `;
}

function renderSwitch(label, field, checked) {
  return `
    <label class="switch-row">
      <span class="switch-row__label">${label}</span>
      <input type="checkbox" ${checked ? "checked" : ""} data-settings-field="${field}" />
    </label>
  `;
}

function renderAutoJoinRules(settings) {
  return `
    <div class="auto-rules">
      <div class="auto-rules__header">
        <span>自動読み上げ設定</span>
        <button class="icon-button icon-button--ghost" type="button" data-action="add-auto-rule" ${!state.ttsOptions ? "disabled" : ""}>
          ${icon("plus")}<span>追加</span>
        </button>
      </div>
      <div class="auto-rules__list">
        ${
          settings.auto_join_rules.length > 0
            ? settings.auto_join_rules.map(renderAutoJoinRule).join("")
            : `<div class="empty-state">自動読み上げ設定はまだありません。</div>`
        }
      </div>
    </div>
  `;
}

function renderAutoJoinRule(rule, index) {
  const readVoiceChannelChat = Boolean(rule.read_voice_channel_chat);
  return `
    <div class="auto-rule-row">
      <label class="field auto-rule-row__field">
        <span>VC</span>
        <select data-auto-rule-index="${index}" data-auto-rule-field="voice_channel_id" ${!state.ttsOptions ? "disabled" : ""}>
          <option value="">未設定</option>
          ${(state.ttsOptions?.voice_channels ?? []).map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === rule.voice_channel_id ? "selected" : ""}>${escapeHtml(channel.name)}</option>`).join("")}
        </select>
      </label>
      <label class="field auto-rule-row__field">
        <span>テキストチャンネル</span>
        <select data-auto-rule-index="${index}" data-auto-rule-field="text_channel_id" ${!state.ttsOptions ? "disabled" : ""}>
          <option value="">${readVoiceChannelChat ? "VC内チャットの読み上げのみ" : "未設定"}</option>
          ${(state.ttsOptions?.text_channels ?? []).map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === rule.text_channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
        </select>
      </label>
      <label class="switch-row auto-rule-row__toggle">
        <span class="switch-row__label">VC内チャットの読み上げ</span>
        <input type="checkbox" ${readVoiceChannelChat ? "checked" : ""} data-auto-rule-index="${index}" data-auto-rule-field="read_voice_channel_chat" />
      </label>
      <button class="icon-button icon-button--ghost auto-rule-row__remove" type="button" data-action="remove-auto-rule" data-index="${index}" title="削除">
        ${icon("trash")}
      </button>
    </div>
  `;
}

function renderDictionaryRules(settings) {
  return `
    <div class="dictionary-rules">
      <div class="dictionary-rules__header">
        <span>ユーザー辞書</span>
        <button class="icon-button icon-button--ghost" type="button" data-action="add-dictionary-entry">
          ${icon("plus")}<span>追加</span>
        </button>
      </div>
      <div class="dictionary-rules__list">
        ${
          settings.user_dictionary.length > 0
            ? settings.user_dictionary.map(renderDictionaryEntry).join("")
            : `<div class="empty-state">ユーザー辞書はまだありません。</div>`
        }
      </div>
    </div>
  `;
}

function renderDictionaryEntry(entry, index) {
  return `
    <div class="dictionary-row">
      <label class="field dictionary-row__field">
        <span>単語</span>
        <input type="text" value="${escapeAttribute(entry.word)}" maxlength="80" data-dictionary-index="${index}" data-dictionary-field="word" />
      </label>
      <label class="field dictionary-row__field">
        <span>読み</span>
        <input type="text" value="${escapeAttribute(entry.reading)}" maxlength="160" data-dictionary-index="${index}" data-dictionary-field="reading" />
      </label>
      <button class="icon-button icon-button--ghost dictionary-row__remove" type="button" data-action="remove-dictionary-entry" data-index="${index}" title="削除">
        ${icon("trash")}
      </button>
    </div>
  `;
}

function renderFeatureSettingsForm() {
  if (!state.featureSettings) {
    return renderGuildDataState();
  }
  const textChannels = state.ttsOptions?.text_channels ?? [];
  const roles = state.ttsOptions?.roles ?? [];
  const dirty = isViewDirty("features");
  const page = activeSettingsPage();
  const content = {
    "welcome-message": () => renderWelcomeMessageSettings(textChannels),
    "sticky-message": () => renderStickyMessageSettings(textChannels),
    "vc-notification": () => renderVcNotificationSettings(textChannels, roles),
  }[page.id]?.() ?? renderGlobalChatSettings(textChannels);

  return `
    <section class="settings-panel" aria-label="${escapeAttribute(page.label)}設定">
      ${renderSettingsHeader(page.icon, `${page.label}設定`, "features", dirty)}
      <div class="feature-settings">
        ${content}
      </div>
    </section>
  `;
}

function renderWelcomeMessageSettings(textChannels) {
  const settings = normalizeWelcomeMessageSettings(state.featureSettings.welcome_message);
  const selectedChannel = textChannels.find((channel) => channel.id === settings.channel_id);
  const enabled = Boolean(settings.enabled && settings.channel_id && settings.message);
  return `
    <section class="feature-card" aria-label="歓迎メッセージ" data-welcome-message-card>
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("message")}<h2>歓迎メッセージ</h2>
        </div>
        <span class="feature-status ${enabled ? "feature-status--on" : ""}" data-welcome-message-status>
          ${enabled ? "有効" : "未設定"}
        </span>
      </div>
      <div class="settings-grid">
        <label class="field welcome-message-toggle">
          <span class="switch-row__label">送信する</span>
          <input type="checkbox" data-welcome-message-field="enabled" ${settings.enabled ? "checked" : ""} />
        </label>
        <label class="field">
          <span>送信先チャンネル</span>
          <select data-welcome-message-field="channel_id" ${selectedGuildCanConfigure() && !state.ttsOptions ? "disabled" : ""}>
            <option value="">未設定</option>
            ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === settings.channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
          </select>
        </label>
        <div class="field welcome-message-text">
          <span>ようこそメッセージ</span>
          ${renderWelcomeTokenGuide()}
          <textarea maxlength="1900" rows="5" data-welcome-message-field="message" aria-label="ようこそメッセージ" placeholder="ようこそ [user]！">${escapeHtml(settings.message)}</textarea>
        </div>
        <div class="field feature-summary">
          <span>現在の設定</span>
          <strong data-welcome-message-summary>${enabled && selectedChannel ? `#${escapeHtml(selectedChannel.name)} へ送信` : "未設定"}</strong>
        </div>
      </div>
    </section>
  `;
}

function renderWelcomeTokenGuide() {
  return `
    <div class="welcome-token-guide" aria-label="利用可能コマンド">
      <span class="welcome-token-guide__title">利用可能コマンド:</span>
      <div class="welcome-token-groups">
        ${WELCOME_MESSAGE_TOKEN_GROUPS.map((group) => `
          <section class="welcome-token-group" aria-label="${escapeAttribute(group.title)}">
            <span class="welcome-token-group__title">${escapeHtml(group.title)}</span>
            <div class="welcome-token-list">
              ${group.tokens.map((token) => `
                <button class="welcome-token-command" type="button" data-action="insert-welcome-token" data-token="${escapeAttribute(token.value)}" title="${escapeAttribute(token.value)}を挿入">
                  <code>${escapeHtml(token.value)}</code>
                  <span>${escapeHtml(token.description)}</span>
                </button>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>
    </div>
  `;
}

function renderGlobalChatSettings(textChannels) {
  const selectedGlobalChannel = textChannels.find((channel) => channel.id === state.featureSettings.global_chat_channel_id);
  return `
    <section class="feature-card" aria-label="グローバルチャット">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("message")}<h2>グローバルチャット</h2>
        </div>
        <span class="feature-status ${state.featureSettings.global_chat_channel_id ? "feature-status--on" : ""}">
          ${state.featureSettings.global_chat_channel_id ? "有効" : "無効"}
        </span>
      </div>
      <div class="settings-grid">
        <label class="field">
          <span>チャンネル</span>
          <select data-feature-field="global_chat_channel_id" ${selectedGuildCanConfigure() && !state.ttsOptions ? "disabled" : ""}>
            <option value="">未設定</option>
            ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === state.featureSettings.global_chat_channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
          </select>
        </label>
        <div class="field feature-summary">
          <span>現在の設定</span>
          <strong>${selectedGlobalChannel ? `#${escapeHtml(selectedGlobalChannel.name)}` : "未設定"}</strong>
        </div>
      </div>
    </section>
  `;
}

function renderStickyMessageSettings(textChannels) {
  const stickyCount = state.featureSettings.sticky_messages.length;
  return `
    <section class="feature-card" aria-label="固定メッセージ">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("pin")}<h2>固定メッセージ</h2>
        </div>
        <span class="feature-status ${stickyCount > 0 ? "feature-status--on" : ""}">
          ${stickyCount > 0 ? `${stickyCount}件` : "未設定"}
        </span>
      </div>
      ${renderStickyMessages(textChannels)}
    </section>
  `;
}

function renderStickyMessages(textChannels) {
  return `
    <div class="sticky-rules">
      <div class="sticky-rules__header">
        <span>チャンネルとメッセージ内容</span>
        <button class="icon-button icon-button--ghost" type="button" data-action="add-sticky-message" ${!state.ttsOptions ? "disabled" : ""}>
          ${icon("plus")}<span>追加</span>
        </button>
      </div>
      <div class="sticky-rules__list">
        ${
          state.featureSettings.sticky_messages.length > 0
            ? state.featureSettings.sticky_messages.map((rule, index) => renderStickyMessageRule(rule, index, textChannels)).join("")
            : `<div class="empty-state">固定メッセージはまだありません。</div>`
        }
      </div>
    </div>
  `;
}

function renderStickyMessageRule(rule, index, textChannels) {
  const selectedChannel = textChannels.find((channel) => channel.id === rule.channel_id);
  return `
    <div class="sticky-row">
      <label class="field sticky-row__channel">
        <span>チャンネル</span>
        <select data-sticky-index="${index}" data-sticky-field="channel_id" ${!state.ttsOptions ? "disabled" : ""}>
          <option value="">未設定</option>
          ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === rule.channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
        </select>
      </label>
      <label class="field sticky-row__content">
        <span>メッセージ内容${selectedChannel ? ` / #${escapeHtml(selectedChannel.name)}` : ""}</span>
        <textarea maxlength="1900" rows="3" data-sticky-index="${index}" data-sticky-field="content">${escapeHtml(rule.content)}</textarea>
      </label>
      <button class="icon-button icon-button--ghost sticky-row__remove" type="button" data-action="remove-sticky-message" data-index="${index}" title="削除">
        ${icon("trash")}
      </button>
    </div>
  `;
}

function renderVcNotificationSettings(textChannels, roles) {
  const settings = state.featureSettings.vc_notification;
  const selectedReactionChannel = textChannels.find((channel) => channel.id === settings.reaction_channel_id);
  const selectedNotificationChannel = textChannels.find((channel) => channel.id === settings.notification_channel_id);
  const selectedRole = roles.find((role) => role.id === settings.role_id);
  const enabled = Boolean(settings.reaction_channel_id && settings.notification_channel_id && settings.emoji && settings.role_id);
  return `
    <section class="feature-card" aria-label="VC通知">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("bell")}<h2>VC通知</h2>
        </div>
        <span class="feature-status ${enabled ? "feature-status--on" : ""}">
          ${enabled ? "有効" : "未設定"}
        </span>
      </div>
      <div class="settings-grid">
        <label class="field">
          <span>リアクション案内チャンネル</span>
          <select data-vc-notification-field="reaction_channel_id" ${selectedGuildCanConfigure() && !state.ttsOptions ? "disabled" : ""}>
            <option value="">未設定</option>
            ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === settings.reaction_channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>VC参加通知チャンネル</span>
          <select data-vc-notification-field="notification_channel_id" ${selectedGuildCanConfigure() && !state.ttsOptions ? "disabled" : ""}>
            <option value="">未設定</option>
            ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === settings.notification_channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>通知ロール</span>
          <select data-vc-notification-field="role_id" ${selectedGuildCanConfigure() && !state.ttsOptions ? "disabled" : ""}>
            <option value="">未設定</option>
            ${roles.map((role) => `<option value="${escapeAttribute(role.id)}" ${role.id === settings.role_id ? "selected" : ""}>@${escapeHtml(role.name)}${role.managed ? "（管理ロール）" : ""}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>リアクション絵文字</span>
          <input type="text" maxlength="80" value="${escapeAttribute(settings.emoji)}" data-vc-notification-field="emoji" placeholder="例: 🔔" />
        </label>
        <label class="field">
          <span>案内メッセージID</span>
          <input type="text" inputmode="numeric" maxlength="32" value="${escapeAttribute(settings.reaction_message_id)}" data-vc-notification-field="reaction_message_id" placeholder="空欄なら保存時に作成" />
        </label>
        <div class="field feature-summary">
          <span>現在の設定</span>
          <strong>${formatVcNotificationSummary(selectedReactionChannel, selectedNotificationChannel, selectedRole, settings)}</strong>
        </div>
      </div>
      <div class="settings-panel__footer">
        ${icon("bell")}<span>メッセージIDが空欄の場合、保存時に案内メッセージを送信してリアクションを付けます。</span>
      </div>
      <div class="feature-card__actions">
        <button class="icon-button icon-button--ghost" type="button" data-action="clear-vc-notification">
          ${icon("trash")}<span>VC通知を解除</span>
        </button>
      </div>
    </section>
  `;
}

function renderHostAdminPanel() {
  const status = state.hostStatus;
  const bot = status?.bot_status ?? null;
  const autoRefreshLabel = `自動更新 ${Math.round(HOST_REFRESH_INTERVAL_MS / 1000)}秒`;
  return `
    <section class="settings-panel host-admin" aria-label="BOT管理者用ページ">
      <div class="settings-panel__header">
        <div class="panel-heading">
          ${icon("activity")}<h2>BOT詳細</h2>
        </div>
        <div class="host-admin__toolbar">
          <span class="refresh-pill ${state.hostLoading ? "refresh-pill--loading" : ""}">
            ${icon("radio")}<span>${escapeHtml(autoRefreshLabel)}</span><small>${escapeHtml(formatTimeOnly(state.hostLastUpdatedAt))}</small>
          </span>
          <button class="icon-button icon-button--primary" type="button" data-action="refresh-host" ${state.hostLoading ? "disabled" : ""}>
            ${icon("refresh")}<span>${state.hostLoading ? "更新中" : "今すぐ更新"}</span>
          </button>
        </div>
      </div>
      ${
        status
          ? `
            ${renderHostOverview(status, bot)}
            <div class="host-metrics">
              ${renderMetricTile("BOT起動時間", formatDuration(bot?.uptime_seconds), formatDateTime(bot?.started_at), Boolean(bot?.online))}
              ${renderMetricTile("Discord Ping", bot?.latency_ms == null ? "測定中" : `${bot.latency_ms}ms`, `${bot?.guild_count ?? 0}サーバー / ${bot?.voice_connection_count ?? 0}VC`, Boolean(bot?.online))}
              ${renderMetricTile("API起動時間", formatDuration(status.uptime_seconds), `PID ${status.process_id}`, true)}
              ${renderMetricTile("データ空き容量", formatBytes(status.data_dir_free_bytes), `${formatBytes(status.data_dir_used_bytes)} 使用中`, status.data_dir_free_bytes > 0)}
            </div>
            <div class="host-admin__grid">
              <section class="host-card">
                <div class="host-card__header">
                  ${icon("bot")}<h3>BOTランタイム</h3>
                </div>
                ${renderDetailList([
                  ["ユーザー", bot?.username ?? "未取得"],
                  ["BOT ID", bot?.user_id ?? "未取得"],
                  ["BOT PID", bot?.process_id ?? "未取得"],
                  ["最終Ready", formatDateTime(bot?.last_ready_at)],
                  ["最終更新", formatDateTime(bot?.status_updated_at)],
                  ["同期済み", bot?.command_sync_completed ? "はい" : "いいえ"],
                  ["Slash Commands", bot?.slash_command_count ?? 0],
                  ["読み込みCog", (bot?.loaded_extensions ?? []).length ? bot.loaded_extensions.join(", ") : "未取得"],
                ])}
              </section>
              <section class="host-card">
                <div class="host-card__header">
                  ${icon("server")}<h3>API / ホスト</h3>
                </div>
                ${renderDetailList([
                  ["ホスト名", status.hostname],
                  ["Python", status.python_version],
                  ["API起動", formatDateTime(status.api_started_at)],
                  ["処理時間", `${status.api_latency_ms.toFixed(2)}ms`],
                  ["公開ポート", status.public_api_port],
                  ["UPnP", status.upnp_enabled ? "有効" : "無効"],
                  ["UPnPリース", formatDuration(status.configuration.upnp_lease_seconds)],
                ])}
              </section>
              <section class="host-card">
                <div class="host-card__header">
                  ${icon("folder")}<h3>データ</h3>
                </div>
                ${renderDetailList([
                  ["データフォルダ", status.data_dir],
                  ["プロジェクト", status.root_dir],
                  ["総容量", formatBytes(status.data_dir_total_bytes)],
                  ["サーバー設定", `${status.data_stats.guild_settings_count}件`],
                  ["読み上げ設定", `${status.data_stats.tts_settings_count}件`],
                  ["音声キャッシュ", `${status.data_stats.tts_voice_cache_count}件`],
                  ["監査ログ", formatBytes(status.data_stats.audit_log_bytes)],
                  ["セッション保存", formatBytes(status.data_stats.session_store_bytes)],
                ])}
              </section>
              <section class="host-card">
                <div class="host-card__header">
                  ${icon("settings")}<h3>細かな設定</h3>
                </div>
                ${renderDetailList([
                  ["ダッシュボード", status.dashboard_url],
                  ["API Host", status.configuration.api_host],
                  ["許可Origin", status.configuration.dashboard_allowed_origins.join(", ")],
                  ["PC操作", status.configuration.host_control_enabled ? "有効" : "無効"],
                  ["許可ユーザー", `${status.configuration.host_control_allowed_user_count}人`],
                  ["JWT有効期限", `${status.configuration.jwt_access_token_minutes}分`],
                  ["セッションTTL", formatDuration(status.configuration.session_ttl_seconds)],
                ])}
              </section>
            </div>
            <section class="host-card host-card--actions">
              <div class="host-card__header">
                ${icon("terminal")}<h3>PC操作</h3>
              </div>
              <div class="host-actions">
                ${renderHostActionButton("open_dashboard", "ダッシュボードを開く", "external")}
                ${renderHostActionButton("open_data_dir", "データフォルダを開く", "folder")}
                ${renderHostActionButton("refresh_upnp", "UPnP更新", "refresh")}
              </div>
            </section>
            <section class="host-card">
              <div class="host-card__header">
                ${icon("history")}<h3>操作ログ</h3>
              </div>
              ${renderHostLogs()}
            </section>
          `
          : `<div class="empty-state">${state.hostLoading ? "管理者用情報を取得中です。" : "管理者用情報はまだ取得されていません。"}</div>`
      }
    </section>
  `;
}

function formatVcNotificationSummary(reactionChannel, notificationChannel, role, settings) {
  const parts = [];
  if (reactionChannel) {
    parts.push(`案内 #${reactionChannel.name}`);
  }
  if (notificationChannel) {
    parts.push(`通知 #${notificationChannel.name}`);
  }
  if (role) {
    parts.push(`@${role.name}`);
  }
  if (settings.emoji) {
    parts.push(settings.emoji);
  }
  return escapeHtml(parts.length ? parts.join(" / ") : "未設定");
}

function renderHostOverview(status, bot) {
  const tone = hostStatusTone(bot);
  const usedPercent =
    status.data_dir_total_bytes > 0
      ? Math.max(0, Math.min(100, (status.data_dir_used_bytes / status.data_dir_total_bytes) * 100))
      : 0;
  const botMeta = bot
    ? `${bot.guild_count ?? 0}サーバー / ${bot.voice_connection_count ?? 0}VC接続`
    : "BOT再起動後にランタイム詳細を取得します";
  return `
    <div class="host-overview host-overview--${tone}">
      <div class="host-overview__status">
        <span class="live-dot live-dot--${tone}"></span>
        <div>
          <span>現在の状態</span>
          <strong>${escapeHtml(botStatusLabel(bot))}</strong>
          <small>${escapeHtml(bot?.username ?? "状態ファイル待ち")} / ${escapeHtml(botMeta)}</small>
        </div>
      </div>
      <div class="host-overview__facts">
        ${renderHostFact("BOT起動", formatDuration(bot?.uptime_seconds))}
        ${renderHostFact("API起動", formatDuration(status.uptime_seconds))}
        ${renderHostFact("更新", formatTimeOnly(state.hostLastUpdatedAt))}
      </div>
      <div class="host-storage">
        <div class="host-storage__header">
          <span>データ容量</span>
          <strong>${escapeHtml(formatBytes(status.data_dir_free_bytes))} 空き</strong>
        </div>
        <div class="host-storage__bar" aria-label="データ使用率">
          <span style="width: ${usedPercent.toFixed(1)}%"></span>
        </div>
        <small>${escapeHtml(`${formatBytes(status.data_dir_used_bytes)} / ${formatBytes(status.data_dir_total_bytes)} 使用中`)}</small>
      </div>
    </div>
  `;
}

function renderHostFact(label, value) {
  return `
    <div class="host-fact">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value ?? "未取得")}</strong>
    </div>
  `;
}

function renderMetricTile(label, value, meta, active) {
  return `
    <div class="metric-tile ${active ? "metric-tile--active" : ""}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value ?? "未取得")}</strong>
      <small>${escapeHtml(meta ?? "")}</small>
    </div>
  `;
}

function renderDetailList(rows) {
  return `
    <dl class="detail-list">
      ${rows
        .map(([label, value]) => `
          <div>
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value ?? "未取得")}</dd>
          </div>
        `)
        .join("")}
    </dl>
  `;
}

function renderHostActionButton(action, label, iconName) {
  const running = state.hostActionRunning === action;
  return `
    <button class="icon-button ${running ? "" : "icon-button--ghost"}" type="button" data-action="host-action" data-host-action="${escapeAttribute(action)}" ${state.hostActionRunning ? "disabled" : ""}>
      ${icon(iconName)}<span>${running ? "実行中" : escapeHtml(label)}</span>
    </button>
  `;
}

function renderHostLogs() {
  if (!state.hostLogs.length) {
    return `<div class="empty-state">操作ログはまだありません。</div>`;
  }
  return `
    <div class="host-log-list">
      ${state.hostLogs.map((log) => `
        <div class="host-log-row">
          <span class="feature-status ${log.status === "ok" ? "feature-status--on" : ""}">${escapeHtml(log.status)}</span>
          <strong>${escapeHtml(hostActionLabel(log.action))}</strong>
          <span>${escapeHtml(log.message)}</span>
          <small>${escapeHtml(formatDateTime(log.created_at))}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function botStatusLabel(bot) {
  if (!bot) {
    return "未取得";
  }
  if (bot.stale) {
    return "更新停止";
  }
  return bot.online ? "オンライン" : "停止中";
}

function hostStatusTone(bot) {
  if (!bot) {
    return "unknown";
  }
  if (bot.stale) {
    return "warning";
  }
  return bot.online ? "online" : "offline";
}

function hostActionLabel(action) {
  return {
    open_dashboard: "ダッシュボードを開く",
    open_data_dir: "データフォルダを開く",
    refresh_upnp: "UPnP更新",
  }[action] ?? action;
}

function renderStatusBanner(tone, message) {
  const iconName = tone === "error" ? "error" : tone === "success" ? "success" : "info";
  return `
    <div class="status-banner status-banner--${tone}" role="${tone === "error" ? "alert" : "status"}">
      ${icon(iconName)}<span>${escapeHtml(message)}</span>
    </div>
  `;
}

function renderStatusToasts() {
  const toasts = collectStatusToasts();
  if (!toasts.length) {
    return "";
  }
  return `
    <div class="status-toast-region" aria-live="polite" aria-label="ステータス通知">
      ${toasts.map((toast) => renderStatusBanner(toast.tone, toast.message)).join("")}
    </div>
  `;
}

function collectStatusToasts() {
  const toasts = [];
  if (state.message) {
    toasts.push({ tone: "error", message: state.message });
  }
  if (!state.user) {
    if (state.security.error) {
      toasts.push({ tone: "error", message: state.security.error });
    }
    if (state.security.message) {
      toasts.push({ tone: state.security.verified ? "success" : "info", message: state.security.message });
    }
  }

  const view = activeSettingsView();
  if (view === "user") {
    if (state.playlistError) {
      toasts.push({ tone: "error", message: state.playlistError });
    }
    if (state.playlistMessage) {
      toasts.push({ tone: "success", message: state.playlistMessage });
    }
    if (state.userActivityError) {
      toasts.push({ tone: "error", message: state.userActivityError });
    }
  } else if (view === "host") {
    if (state.hostError) {
      toasts.push({ tone: "error", message: state.hostError });
    }
    if (state.hostMessage) {
      toasts.push({ tone: "success", message: state.hostMessage });
    }
  }

  return toasts;
}

function renderUnsavedChangesPrompt() {
  if (!hasPendingNavigation() || !hasUnsavedChanges()) {
    return "";
  }
  const saving = state.saving || state.guard.verificationSaving || state.guard.moderationSaving || state.guard.loggingSaving;
  return `
    <div class="unsaved-bar" role="alert" aria-live="assertive">
      <div class="unsaved-bar__message">
        ${icon("alert")}<span>保存していない設定があります。</span>
      </div>
      <div class="unsaved-bar__actions">
        <button class="icon-button icon-button--primary save-button save-button--dirty" type="button" data-action="save-pending-settings" ${saving ? "disabled" : ""}>
          ${icon("save")}<span>${saving ? "保存中" : "設定保存"}</span>
        </button>
        <button class="icon-button icon-button--ghost" type="button" data-action="discard-pending-settings" ${saving ? "disabled" : ""}>
          ${icon("trash")}<span>設定破棄</span>
        </button>
      </div>
    </div>
  `;
}

function hasPendingNavigation() {
  return Boolean(
    state.pendingPageId ||
      state.pendingProductId ||
      state.guard.pendingFeatureId ||
      state.guard.pendingGuildId,
  );
}

function snapshotPendingNavigation() {
  if (state.pendingPageId) {
    return { type: "page", pageId: state.pendingPageId };
  }
  if (state.pendingProductId) {
    return { type: "product", productId: state.pendingProductId };
  }
  if (state.guard.pendingFeatureId) {
    return { type: "guard-feature", featureId: state.guard.pendingFeatureId };
  }
  if (state.guard.pendingGuildId) {
    return { type: "guard-guild", guildId: state.guard.pendingGuildId };
  }
  return null;
}

function clearPendingNavigation() {
  state.pendingPageId = null;
  state.pendingProductId = null;
  state.guard.pendingFeatureId = null;
  state.guard.pendingGuildId = null;
}

async function completePendingNavigation(pending) {
  clearPendingNavigation();
  if (!pending) {
    render();
    return;
  }
  if (pending.type === "product") {
    await activateProduct(pending.productId);
    return;
  }
  if (pending.type === "page") {
    state.activePage = pending.pageId;
    render();
    loadActivePageData();
    return;
  }
  if (pending.type === "guard-feature") {
    state.guard.activeFeature = pending.featureId;
    render();
    return;
  }
  if (pending.type === "guard-guild") {
    applyGuardSettingsForGuild(pending.guildId);
    state.guildListCollapsed = true;
    render();
  }
}

function requestPageChange(pageId) {
  const pages = visibleSettingsPages();
  const nextPageId =
    pageId === USER_PAGE.id
      ? USER_PAGE.id
      : pages.find((page) => page.id === pageId)?.id ?? defaultServerPageId();
  if (nextPageId === state.activePage) {
    clearPendingNavigation();
    render();
    return;
  }
  if (hasUnsavedChanges()) {
    clearPendingNavigation();
    state.pendingPageId = nextPageId;
    render();
    return;
  }
  state.activePage = nextPageId;
  clearPendingNavigation();
  render();
  loadActivePageData();
}

function requestGuardFeatureChange(featureId) {
  if (!GUARD_FEATURES.some((feature) => feature.id === featureId)) {
    return;
  }
  if (featureId === state.guard.activeFeature) {
    clearPendingNavigation();
    render();
    return;
  }
  if (hasUnsavedChanges()) {
    clearPendingNavigation();
    state.guard.pendingFeatureId = featureId;
    render();
    return;
  }
  state.guard.activeFeature = featureId;
  clearPendingNavigation();
  render();
}

function requestGuardGuildChange(guildId) {
  const currentGuildId = activeGuardSelectedGuild()?.id ?? "";
  if (!guildId || guildId === currentGuildId) {
    clearPendingNavigation();
    render();
    return;
  }
  if (hasUnsavedChanges()) {
    clearPendingNavigation();
    state.guard.pendingGuildId = guildId;
    render();
    return;
  }
  applyGuardSettingsForGuild(guildId);
  state.guildListCollapsed = true;
  clearPendingNavigation();
  render();
}

function requestDashboardPageChange(pageId) {
  const nextPageId =
    pageId === "user"
      ? USER_PAGE.id
      : state.activePage === USER_PAGE.id
        ? defaultServerPageId()
        : state.activePage;
  requestPageChange(nextPageId);
}

function loadActivePageData() {
  if (activeSettingsView() === "host") {
    void loadHostData();
  } else if (activeSettingsView() === "user") {
    void loadPlaylist({ silent: true });
    void loadUserActivity({ silent: true });
  } else if (state.selectedGuildId && (!state.settings || !state.featureSettings || !state.ttsOptions)) {
    void loadGuildData(state.selectedGuildId);
  }
}

async function saveActiveSettings() {
  if (state.activeProduct === "guard") {
    const featureId = activeGuardFeature().id;
    if (featureId === "moderation") {
      return saveGuardModerationSettings();
    }
    if (featureId === "logging") {
      return saveGuardLoggingSettings();
    }
    return saveGuardVerificationSettings();
  }
  if (activeSettingsView() === "host" || activeSettingsView() === "user") {
    return true;
  }
  return activeSettingsView() === "features" ? saveFeatureSettings() : saveSettings();
}

async function savePendingSettings() {
  const pending = snapshotPendingNavigation();
  const saved = await saveActiveSettings();
  if (saved) {
    await completePendingNavigation(pending);
  }
}

function discardActiveSettings() {
  if (state.activeProduct === "guard") {
    if (activeGuardFeature().id === "moderation") {
      state.guard.moderationForm = cloneState(state.guard.savedModerationForm) ?? normalizeGuardModerationForm(null);
      state.dirtyViews.guardModeration = false;
    } else if (activeGuardFeature().id === "logging") {
      state.guard.loggingForm = cloneState(state.guard.savedLoggingForm) ?? normalizeGuardLoggingForm(null);
      state.dirtyViews.guardLogging = false;
    } else {
      state.guard.verificationForm = cloneState(state.guard.savedVerificationForm) ?? normalizeGuardVerificationForm(null);
      state.dirtyViews.guardVerification = false;
    }
    return;
  }
  if (activeSettingsView() === "features") {
    state.featureSettings = cloneState(state.savedFeatureSettings);
    state.dirtyViews.features = false;
  } else {
    state.settings = cloneState(state.savedSettings);
    state.dirtyViews.tts = false;
  }
}

async function discardPendingSettings() {
  const pending = snapshotPendingNavigation();
  discardActiveSettings();
  await completePendingNavigation(pending);
}

function handleSubmit(event) {
  const target = event.target;
  if (target instanceof HTMLFormElement && target.matches("[data-playlist-url-form]")) {
    event.preventDefault();
    void addPlaylistUrl();
  } else if (target instanceof HTMLFormElement && target.matches("[data-guard-verification-form]")) {
    event.preventDefault();
    void saveGuardVerificationSettings();
  } else if (target instanceof HTMLFormElement && target.matches("[data-guard-moderation-form]")) {
    event.preventDefault();
    void saveGuardModerationSettings();
  } else if (target instanceof HTMLFormElement && target.matches("[data-guard-logging-form]")) {
    event.preventDefault();
    void saveGuardLoggingSettings();
  } else if (target instanceof HTMLFormElement && target.matches("[data-guard-api-form]")) {
    event.preventDefault();
    saveGuardApiBase();
  }
}

function handleDragOver(event) {
  const target = event.target instanceof Element ? event.target.closest("[data-playlist-drop-zone]") : null;
  if (!target) {
    return;
  }
  event.preventDefault();
  if (!state.playlistDragActive) {
    state.playlistDragActive = true;
    render();
  }
}

function handleDragLeave(event) {
  const target = event.target instanceof Element ? event.target.closest("[data-playlist-drop-zone]") : null;
  if (!target) {
    return;
  }
  const relatedTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null;
  if (relatedTarget && target.contains(relatedTarget)) {
    return;
  }
  state.playlistDragActive = false;
  render();
}

function handleDrop(event) {
  const target = event.target instanceof Element ? event.target.closest("[data-playlist-drop-zone]") : null;
  if (!target) {
    return;
  }
  event.preventDefault();
  state.playlistDragActive = false;
  const file = event.dataTransfer?.files?.[0] ?? null;
  void uploadPlaylistFile(file);
}

function handlePointerDown(event) {
  const target = event.target instanceof Element ? event.target : null;
  const actionEl = target?.closest('[data-action="playlist-toggle-play"]');
  if (!actionEl) {
    return;
  }
  const trackId = actionEl.dataset.trackId;
  if (!trackId) {
    return;
  }
  event.preventDefault();
  lastPlaylistPointerToggleTrackId = trackId;
  lastPlaylistPointerToggleAt = window.performance.now();
  togglePlaylistTrackPlayback(trackId);
}

function handleClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) {
    return;
  }

  const actionEl = target.closest("[data-action]");
  if (actionEl) {
    const action = actionEl.dataset.action;
    if (action === "switch-product") {
      void activateProduct(actionEl.dataset.product);
    } else if (action === "guard-clear-api") {
      clearGuardApiBase();
    } else if (action === "guard-edit-verification-guild") {
      const guildId = actionEl.dataset.guardGuildId;
      if (guildId) {
        requestGuardGuildChange(guildId);
      }
    } else if (action === "save-guard-verification-settings") {
      void saveGuardVerificationSettings();
    } else if (action === "save-guard-moderation-settings") {
      void saveGuardModerationSettings();
    } else if (action === "remove-guard-moderation-channel") {
      removeGuardModerationTargetChannel(actionEl.dataset.guardModerationFeature, actionEl.dataset.channelId);
    } else if (action === "save-guard-logging-settings") {
      void saveGuardLoggingSettings();
    } else if (action === "login") {
      if (currentLoginBlocked()) {
        state.security.error =
          state.security.error || "セキュリティ検証が完了してからログインしてください。";
        render();
        return;
      }
      const turnstileToken = state.security.enabled ? state.security.proofToken : "";
      clearTurnstileProofToken();
      window.location.href = api.loginUrl(turnstileToken);
    } else if (action === "logout") {
      void logout();
    } else if (action === "refresh-service-status") {
      void refreshServiceStatus();
    } else if (action === "refresh-host") {
      void loadHostData();
    } else if (action === "reload-guild-data") {
      if (state.selectedGuildId) {
        void loadGuildData(state.selectedGuildId);
      }
    } else if (action === "playlist-refresh") {
      void loadPlaylist();
    } else if (action === "user-activity-refresh") {
      void loadUserActivity();
    } else if (action === "playlist-add-url") {
      void addPlaylistUrl();
    } else if (action === "playlist-choose-file") {
      const input = root.querySelector("[data-playlist-file-input]");
      if (input instanceof HTMLInputElement) {
        input.click();
      }
    } else if (action === "playlist-toggle-play") {
      const trackId = actionEl.dataset.trackId;
      if (trackId) {
        if (shouldIgnorePlaylistToggleClick(trackId)) {
          return;
        }
        togglePlaylistTrackPlayback(trackId);
      }
    } else if (action === "playlist-delete-track") {
      const trackId = actionEl.dataset.trackId;
      if (trackId) {
        void deletePlaylistTrack(trackId);
      }
    } else if (action === "insert-welcome-token") {
      insertWelcomeMessageToken(actionEl.dataset.token ?? "");
    } else if (action === "host-action") {
      const hostAction = actionEl.dataset.hostAction;
      if (hostAction) {
        void runHostAction(hostAction);
      }
    } else if (action === "toggle-guild-list") {
      state.guildListCollapsed = !state.guildListCollapsed;
      render();
    } else if (action === "save-settings") {
      void saveSettings();
    } else if (action === "save-feature-settings") {
      void saveFeatureSettings();
    } else if (action === "save-pending-settings") {
      void savePendingSettings();
    } else if (action === "discard-pending-settings") {
      void discardPendingSettings();
    } else if (action === "add-auto-rule") {
      state.settings.auto_join_rules = [
        ...state.settings.auto_join_rules,
        { voice_channel_id: "", text_channel_id: "", read_voice_channel_chat: false },
      ];
      updateDirtyState("tts");
      render();
    } else if (action === "remove-auto-rule") {
      const index = Number(actionEl.dataset.index);
      state.settings.auto_join_rules = state.settings.auto_join_rules.filter((_, ruleIndex) => ruleIndex !== index);
      updateDirtyState("tts");
      render();
    } else if (action === "add-dictionary-entry") {
      state.settings.user_dictionary = [...state.settings.user_dictionary, { word: "", reading: "" }];
      updateDirtyState("tts");
      render();
    } else if (action === "remove-dictionary-entry") {
      const index = Number(actionEl.dataset.index);
      state.settings.user_dictionary = state.settings.user_dictionary.filter((_, entryIndex) => entryIndex !== index);
      updateDirtyState("tts");
      render();
    } else if (action === "add-sticky-message") {
      state.featureSettings.sticky_messages = [
        ...state.featureSettings.sticky_messages,
        { channel_id: "", content: "" },
      ];
      updateDirtyState("features");
      render();
    } else if (action === "remove-sticky-message") {
      const index = Number(actionEl.dataset.index);
      state.featureSettings.sticky_messages = state.featureSettings.sticky_messages.filter((_, ruleIndex) => ruleIndex !== index);
      updateDirtyState("features");
      render();
    } else if (action === "clear-vc-notification") {
      state.featureSettings.vc_notification = normalizeVcNotificationSettings(null);
      updateDirtyState("features");
      render();
    }
    return;
  }

  const dashboardPageEl = target.closest("[data-dashboard-page]");
  if (dashboardPageEl) {
    requestDashboardPageChange(dashboardPageEl.dataset.dashboardPage);
    return;
  }

  const guardFeatureEl = target.closest("[data-guard-feature]");
  if (guardFeatureEl && state.activeProduct === "guard") {
    const featureId = guardFeatureEl.dataset.guardFeature;
    requestGuardFeatureChange(featureId);
    return;
  }

  const activityPeriodEl = target.closest("[data-activity-period]");
  if (activityPeriodEl) {
    state.activeActivityPeriod = ACTIVITY_PERIODS.some((period) => period.id === activityPeriodEl.dataset.activityPeriod)
      ? activityPeriodEl.dataset.activityPeriod
      : "daily";
    render();
    return;
  }

  const guardGuildEl = target.closest("[data-guard-guild-id]");
  if (guardGuildEl && state.activeProduct === "guard") {
    const guildId = guardGuildEl.dataset.guardGuildId;
    if (guildId) {
      requestGuardGuildChange(guildId);
    }
    return;
  }

  const guildEl = target.closest("[data-guild-id]");
  if (guildEl) {
    const guildId = guildEl.dataset.guildId;
    if (guildId && guildId !== state.selectedGuildId) {
      state.selectedGuildId = guildId;
      state.guildListCollapsed = true;
      void loadGuildData(guildId);
    }
    return;
  }

  const tabEl = target.closest("[data-tab]");
  if (tabEl) {
    requestPageChange(tabEl.dataset.tab);
  }
}

function shouldIgnorePlaylistToggleClick(trackId) {
  return (
    lastPlaylistPointerToggleTrackId === trackId &&
    window.performance.now() - lastPlaylistPointerToggleAt < 700
  );
}

function handleChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
    return;
  }

  if (target.dataset.guardVerificationField) {
    updateGuardVerificationField(target, { renderAfter: true });
  } else if (target.dataset.guardModerationField) {
    updateGuardModerationField(target, { renderAfter: true });
  } else if (target.dataset.guardLoggingField) {
    updateGuardLoggingField(target, { renderAfter: true });
  } else if (target.dataset.settingsField) {
    updateSettingsField(target);
  } else if (target.dataset.autoRuleField) {
    updateAutoRuleField(target);
  } else if (target.dataset.welcomeMessageField) {
    updateWelcomeMessageField(target);
  } else if (target.dataset.featureField) {
    updateFeatureField(target);
  } else if (target.dataset.stickyField) {
    updateStickyMessageField(target);
  } else if (target.dataset.vcNotificationField) {
    updateVcNotificationField(target);
  } else if ("playlistFileInput" in target.dataset) {
    const file = target.files?.[0] ?? null;
    target.value = "";
    void uploadPlaylistFile(file);
  } else if ("playlistSeek" in target.dataset) {
    handlePlaylistSeekInput(target);
  }
}

function handleInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return;
  }

  if ("playlistSeek" in target.dataset) {
    handlePlaylistSeekInput(target);
    return;
  }

  if (target.dataset.guardVerificationField) {
    updateGuardVerificationField(target, { renderAfter: false });
    return;
  }

  if (target.dataset.guardModerationField) {
    updateGuardModerationField(target, { renderAfter: false });
    return;
  }

  if (target.dataset.guardLoggingField) {
    updateGuardLoggingField(target, { renderAfter: false });
    return;
  }

  if (target.dataset.playlistField === "url") {
    state.playlistUrl = target.value;
    return;
  }

  if (target.dataset.stickyField) {
    updateStickyMessageField(target, { renderAfter: false });
    return;
  }

  if (target.dataset.vcNotificationField) {
    updateVcNotificationField(target, { renderAfter: false });
    return;
  }

  if (target.dataset.welcomeMessageField) {
    updateWelcomeMessageField(target, { renderAfter: false });
    return;
  }

  if (target.dataset.dictionaryField) {
    const index = Number(target.dataset.dictionaryIndex);
    const field = target.dataset.dictionaryField;
    if (Number.isInteger(index) && state.settings?.user_dictionary[index]) {
      state.settings.user_dictionary[index] = {
        ...state.settings.user_dictionary[index],
        [field]: target.value,
      };
      updateDirtyState("tts");
    }
    return;
  }

  if (target.dataset.settingsField) {
    updateSettingsField(target, { renderAfter: false });
  }
}

function updateSettingsField(target, options = { renderAfter: true }) {
  if (!state.settings) {
    return;
  }
  const field = target.dataset.settingsField;
  let value;
  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    value = target.checked;
  } else if (target instanceof HTMLInputElement && target.type === "number") {
    value = clampInteger(target.valueAsNumber, TTS_TEXT_LENGTH_MIN, TTS_TEXT_LENGTH_MAX);
  } else if (target instanceof HTMLInputElement && target.type === "range") {
    value = Number(target.value);
  } else {
    value = target.value;
  }

  if (field === "tts_engine") {
    const nextSettings = { ...state.settings, tts_engine: value, tts_speaker: "default" };
    state.settings = nextSettings;
    updateDirtyState("tts");
    render();
    return;
  }

  if (field === "tts_speaker") {
    const nextSettings = { ...state.settings, tts_speaker: value };
    state.settings = nextSettings;
    updateDirtyState("tts");
    render();
    return;
  }

  state.settings = { ...state.settings, [field]: value };
  updateInlineValueLabel(field, value);
  updateDirtyState("tts");
  if (options.renderAfter) {
    render();
  }
}

function updateInlineValueLabel(field, value) {
  const label = root.querySelector(`[data-value-label="${CSS.escape(field)}"]`);
  if (!label) {
    return;
  }
  if (field === "tts_speed") {
    label.textContent = `${Number(value).toFixed(1)}倍`;
  } else if (field === "tts_volume") {
    label.textContent = Number(value).toFixed(1);
  } else if (field === "tts_pitch" || field === "tts_intonation") {
    label.textContent = Number(value).toFixed(1);
  } else if (field === "tts_max_text_length") {
    label.textContent = `${value}文字`;
  }
}

function updateAutoRuleField(target) {
  if (!state.settings) {
    return;
  }
  const index = Number(target.dataset.autoRuleIndex);
  const field = target.dataset.autoRuleField;
  if (!Number.isInteger(index) || !state.settings.auto_join_rules[index]) {
    return;
  }
  const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
  state.settings.auto_join_rules = state.settings.auto_join_rules.map((rule, ruleIndex) =>
    ruleIndex === index ? { ...rule, [field]: value } : rule,
  );
  updateDirtyState("tts");
  render();
}

function updateWelcomeMessageField(target, options = { renderAfter: true }) {
  if (!state.featureSettings) {
    return;
  }
  const field = target.dataset.welcomeMessageField;
  const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
  state.featureSettings.welcome_message = {
    ...normalizeWelcomeMessageSettings(state.featureSettings.welcome_message),
    [field]: value,
  };
  updateDirtyState("features");
  if (options.renderAfter) {
    render();
  } else {
    refreshWelcomeMessageStatus();
  }
}

function insertWelcomeMessageToken(token) {
  if (!state.featureSettings || !WELCOME_MESSAGE_TOKENS.some((item) => item.value === token)) {
    return;
  }
  const textarea = root.querySelector('[data-welcome-message-field="message"]');
  const currentMessage = normalizeWelcomeMessageSettings(state.featureSettings.welcome_message).message;
  const currentValue = textarea instanceof HTMLTextAreaElement ? textarea.value : currentMessage;
  const selectionStart = textarea instanceof HTMLTextAreaElement ? textarea.selectionStart : currentValue.length;
  const selectionEnd = textarea instanceof HTMLTextAreaElement ? textarea.selectionEnd : selectionStart;
  const nextValue = `${currentValue.slice(0, selectionStart)}${token}${currentValue.slice(selectionEnd)}`.slice(0, 1900);
  state.featureSettings.welcome_message = {
    ...normalizeWelcomeMessageSettings(state.featureSettings.welcome_message),
    message: nextValue,
  };
  if (textarea instanceof HTMLTextAreaElement) {
    textarea.value = nextValue;
    const nextCaret = Math.min(selectionStart + token.length, nextValue.length);
    textarea.focus();
    textarea.setSelectionRange(nextCaret, nextCaret);
  }
  updateDirtyState("features");
  refreshWelcomeMessageStatus();
}

function refreshWelcomeMessageStatus() {
  const card = root.querySelector("[data-welcome-message-card]");
  if (!card) {
    return;
  }
  const settings = normalizeWelcomeMessageSettings(state.featureSettings?.welcome_message);
  const selectedChannel = state.ttsOptions?.text_channels?.find((channel) => channel.id === settings.channel_id);
  const enabled = Boolean(settings.enabled && settings.channel_id && settings.message);
  const status = card.querySelector("[data-welcome-message-status]");
  if (status) {
    status.classList.toggle("feature-status--on", enabled);
    status.textContent = enabled ? "有効" : "未設定";
  }
  const summary = card.querySelector("[data-welcome-message-summary]");
  if (summary) {
    summary.textContent = enabled && selectedChannel ? `#${selectedChannel.name} へ送信` : "未設定";
  }
}

function updateFeatureField(target) {
  if (!state.featureSettings) {
    return;
  }
  const field = target.dataset.featureField;
  state.featureSettings = {
    ...state.featureSettings,
    [field]: target.value || null,
  };
  updateDirtyState("features");
  render();
}

function updateStickyMessageField(target, options = { renderAfter: true }) {
  if (!state.featureSettings) {
    return;
  }
  const index = Number(target.dataset.stickyIndex);
  const field = target.dataset.stickyField;
  if (!Number.isInteger(index) || !state.featureSettings.sticky_messages[index]) {
    return;
  }
  state.featureSettings.sticky_messages = state.featureSettings.sticky_messages.map((rule, ruleIndex) =>
    ruleIndex === index ? { ...rule, [field]: target.value } : rule,
  );
  updateDirtyState("features");
  if (options.renderAfter) {
    render();
  }
}

function updateVcNotificationField(target, options = { renderAfter: true }) {
  if (!state.featureSettings) {
    return;
  }
  const field = target.dataset.vcNotificationField;
  state.featureSettings.vc_notification = {
    ...normalizeVcNotificationSettings(state.featureSettings.vc_notification),
    [field]: target.value,
  };
  updateDirtyState("features");
  if (options.renderAfter) {
    render();
  }
}

function formatError(error, fallback) {
  if (error instanceof ApiError) {
    return error.requestId ? `${error.message} Request ID: ${error.requestId}` : error.message;
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

function clampInteger(value, minimum, maximum) {
  const number = Number.isFinite(value) ? Math.trunc(value) : minimum;
  return Math.max(minimum, Math.min(maximum, number));
}

function clampNumber(value, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return minimum;
  }
  return Math.max(minimum, Math.min(maximum, number));
}

function normalizeNullableString(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

function formatDuration(seconds) {
  if (seconds == null || seconds === "") {
    return "未取得";
  }
  const total = Number(seconds);
  if (!Number.isFinite(total) || total < 0) {
    return "未取得";
  }
  const whole = Math.floor(total);
  const days = Math.floor(whole / 86400);
  const hours = Math.floor((whole % 86400) / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;
  if (days > 0) {
    return `${days}日 ${hours}時間`;
  }
  if (hours > 0) {
    return `${hours}時間 ${minutes}分`;
  }
  if (minutes > 0) {
    return `${minutes}分 ${secs}秒`;
  }
  return `${secs}秒`;
}

function formatActivityDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) {
    return `${hours}時間 ${minutes}分`;
  }
  if (minutes > 0) {
    return `${minutes}分`;
  }
  return `${total % 60}秒`;
}

function formatCompactNumber(value) {
  const number = Math.max(0, Math.trunc(Number(value) || 0));
  return new Intl.NumberFormat("ja-JP", { notation: number >= 10000 ? "compact" : "standard" }).format(number);
}

function sumActivityPoints(points) {
  return (points ?? []).reduce(
    (totals, point) => ({
      vc_seconds: totals.vc_seconds + Math.max(0, Math.trunc(Number(point.vc_seconds) || 0)),
      message_count: totals.message_count + Math.max(0, Math.trunc(Number(point.message_count) || 0)),
      character_count: totals.character_count + Math.max(0, Math.trunc(Number(point.character_count) || 0)),
    }),
    { vc_seconds: 0, message_count: 0, character_count: 0 },
  );
}

function activitySparklinePoints(points, metric) {
  const values = (points ?? []).map((point) => Math.max(0, Number(point?.[metric]) || 0));
  const safeValues = values.length > 0 ? values : [0];
  const maxValue = Math.max(...safeValues, 1);
  const width = 320;
  const height = 110;
  const paddingX = 14;
  const paddingY = 16;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;
  return safeValues
    .map((value, index) => {
      const x = safeValues.length === 1
        ? width / 2
        : paddingX + (plotWidth * index) / (safeValues.length - 1);
      const y = paddingY + plotHeight - (value / maxValue) * plotHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function formatPlaybackTime(seconds) {
  if (seconds == null || seconds === "") {
    return "--:--";
  }
  const total = Number(seconds);
  if (!Number.isFinite(total) || total < 0) {
    return "--:--";
  }
  const whole = Math.floor(total);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;
  const paddedSeconds = String(secs).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
}

function formatDateTime(value) {
  if (!value) {
    return "未取得";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "未取得";
  }
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

function formatTimeOnly(value) {
  if (!value) {
    return "未更新";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "未更新";
  }
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatBytes(value) {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "未取得";
  }
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const digits = unitIndex === 0 ? 0 : size >= 10 ? 1 : 2;
  return `${size.toFixed(digits)} ${units[unitIndex]}`;
}

function isObject(value) {
  return typeof value === "object" && value !== null;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function icon(name, label = "") {
  const paths = {
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    alert: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
    bell: '<path d="M10.3 21a2 2 0 0 0 3.4 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>',
    bot: '<rect width="14" height="10" x="5" y="11" rx="2"/><path d="M12 8V4"/><path d="M8 4h8"/><circle cx="9" cy="16" r="1"/><circle cx="15" cy="16" r="1"/><path d="M2 15h3"/><path d="M19 15h3"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronUp: '<path d="m18 15-6-6-6 6"/>',
    error: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/><path d="M12 7v5l4 2"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    pin: '<path d="M12 17v5"/><path d="M9 10.8V4.5a1.5 1.5 0 0 1 3 0v6.3"/><path d="M15 10.8V4.5a1.5 1.5 0 0 1 3 0v9.8A4.7 4.7 0 0 1 13.3 19H11a6 6 0 0 1-6-6v-1.8a1.5 1.5 0 0 1 3 0V13"/><path d="M12 10.8V3.5a1.5 1.5 0 0 1 3 0v7.3"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    radio: '<path d="M4.9 19.1a10 10 0 0 1 0-14.2"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4"/><circle cx="12" cy="12" r="2"/>',
    refresh: '<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.7-2.7L3 16"/><path d="M3 21v-5h5"/><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.7 2.7L21 8"/><path d="M21 3v5h-5"/>',
    router: '<rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6.5 18h.01"/><path d="M10.5 18h.01"/><path d="M15 14v-4"/><path d="M12 10h6"/><path d="M12 6h6"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 .9-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z"/><path d="m9 12 2 2 4-4"/>',
    success: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    volume: '<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19 6a9 9 0 0 1 0 12"/>',
  };
  return `
    <svg class="svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${label ? `aria-label="${escapeAttribute(label)}"` : 'aria-hidden="true"'}>
      ${paths[name] ?? paths.settings}
    </svg>
  `;
}
