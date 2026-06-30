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
const GUARD_STATUS_REFRESH_INTERVAL_MS = 10000;
const GUILD_OPTIONS_REFRESH_INTERVAL_MS = 60000;
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
const TTS_ENGINE_FIXED = "voicevox";
const HOST_CONTROL_ADMIN_DISCORD_USER_ID = "907254481371144243";
const SUPPORT_MESSAGE_MAX_LENGTH = 1900;
const VC_NOTIFICATION_REACTION_EMOJI = "🔔";

const SUPPORT_PRODUCTS = [
  { id: "one", label: "Discat One" },
  { id: "guard", label: "Discat Guard" },
];

const SUPPORT_REQUIREMENTS = [
  { id: "bug", label: "不具合・エラー" },
  { id: "settings", label: "設定の相談" },
  { id: "permissions", label: "権限・導入" },
  { id: "feature_request", label: "機能要望" },
  { id: "report", label: "通報・緊急相談" },
  { id: "other", label: "その他" },
];

const USER_PAGE = {
  id: "user",
  label: "ユーザーページ",
  eyebrow: "ユーザー",
  description: "プロフィールとプレイリスト",
  icon: "user",
  view: "user",
};
const USER_PANEL_TABS = [
  { id: "playlist", label: "プレイリスト", icon: "music" },
  { id: "activity", label: "アクティビティ", icon: "activity" },
];
const SERVER_DEFAULT_PAGE = "welcome-message";
const ACTIVITY_PERIODS = [
  { id: "daily", label: "日別", summary: "直近7日" },
  { id: "weekly", label: "週別", summary: "直近8週" },
  { id: "monthly", label: "月別", summary: "直近6か月" },
];
const ACTIVITY_POINT_LIMITS = {
  daily: 7,
  weekly: 8,
  monthly: 6,
};
const RANKING_PERIODS = [
  { id: "daily", label: "日", summary: "今日" },
  { id: "weekly", label: "週", summary: "今週" },
  { id: "monthly", label: "月", summary: "今月" },
  { id: "yearly", label: "年", summary: "今年" },
];
const ACTIVE_RANKING_SOURCES = [
  { id: "text", label: "テキスト", metric: "文字数" },
  { id: "message", label: "メッセージ", metric: "送信数" },
  { id: "vc", label: "VC", metric: "接続時間" },
  { id: "bump", label: "BUMP/UP", metric: "回数とpt" },
];
const DEFAULT_ACTIVE_RANKING_SOURCES = ["message", "text", "vc", "bump"];
const BUMP_RANK_RESET_INTERVALS = [
  { id: "none", label: "リセットしない" },
  { id: "daily", label: "毎日" },
  { id: "weekly", label: "毎週" },
  { id: "monthly", label: "毎月" },
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
const TICKET_PANEL_DEFAULT_TITLE = "お問い合わせ・サポート";
const TICKET_PANEL_DEFAULT_DESCRIPTION = "困ったことがある場合は、下のボタンからチケットを作成してください。\nスタッフが順番に対応します。";
const TICKET_CALL_COOLDOWN_MINUTES_DEFAULT = 30;

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
    help: "話者、音量、速度、読み上げ対象チャンネル、ユーザー辞書を設定します。",
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
    id: "ticket",
    label: "チケット",
    eyebrow: "サポート",
    description: "問い合わせチャンネルとスタッフ対応",
    help: "カテゴリ、スタッフロール、ログチャンネル、パネル送信先を設定し、ダッシュボードからチケットパネルを送信できます。",
    icon: "ticket",
    view: "features",
  },
  {
    id: "server-rank",
    label: "サーバーランク",
    eyebrow: "ランキング",
    description: "統合ポイントと表示",
    help: "テキスト、メッセージ、VC、BUMP/UPの加算項目、リセット周期、ランキング送信先を設定し、期間別ランキングを確認します。",
    icon: "activity",
    view: "features",
  },
  {
    id: "bump-rank",
    label: "Bump/Upランク",
    eyebrow: "掲示板",
    description: "掲示板通知とランキング",
    help: "DISBOARDの/bumpとディス速の/up成功を検知し、2時間後の再実行通知とBump/Upポイントを管理します。",
    icon: "activity",
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
    description: "連投リンク、招待リンク、連続投稿、絵文字スパム、連続メンション、暴言、下ネタ、NGワードの検知と処罰を設定します。",
    help: "連投系は検知ペースと処置、暴言/下ネタは処罰と検知しないチャンネル、NGワードは追加語句と処罰を設定します。",
    icon: "shield",
  },
  {
    id: "logging",
    label: "ログ機能",
    description: "参加、BAN、招待、ロール、チャンネル、VC状態、メッセージなどのログ送信先を設定します。",
    help: "イベントごとに有効化とログを送るチャンネルを設定します。",
    icon: "activity",
  },
  {
    id: "admin",
    label: "管理者用",
    description: "Guard BOTの稼働状況と参加サーバーを確認します。",
    help: "Guard BOTが参加しているサーバー一覧を確認し、管理者用の招待リンクを作成します。",
    icon: "bot",
    adminOnly: true,
  },
];

const GUARD_FEATURE_ROWS = [
  ["連投監視", "リンク、招待リンク、連続投稿、絵文字、メンションのペースに応じて処置します。"],
  ["NGワード検知", "管理者が追加した語句を含む投稿を検知して処置します。"],
  ["内容保護", "ログに保存する内容は本文を除外し、必要なメタデータだけを扱います。"],
  ["低権限運用", "スラッシュコマンドや通常コマンドを使わない監視専用BOTとして動作します。"],
];

const GUARD_SAMPLE_EVENTS = [
  { event_type: "bot_ready", guild: { name: "System" }, actor: { name: "Discat Guard" }, level: "info" },
  { event_type: "guild_joined", guild: { name: "Sample Guild" }, actor: { name: "Discord" }, level: "success" },
  { event_type: "moderation_detected", guild: { name: "Sample Guild" }, actor: { name: "sample-user" }, level: "warning" },
];

const GUARD_DUPLICATE_ACTIONS = [
  { id: "notify", label: "通知のみ" },
  { id: "kick", label: "キック" },
  { id: "ban", label: "BAN" },
];

const GUARD_MODERATION_FEATURES = [
  {
    id: "invite_spam",
    label: "招待リンク検知",
    description: "Discordサーバー招待リンクを一定ペース以上で送ったユーザーを検知します。",
  },
  {
    id: "other_links",
    label: "連投リンク検知",
    description: "Discord招待リンク以外のURLを一定ペース以上で送ったユーザーを検知します。",
  },
  {
    id: "spam",
    label: "連続投稿検知",
    description: "短時間に連続投稿したユーザーを検知します。",
  },
  {
    id: "emoji_spam",
    label: "絵文字スパム検知",
    description: "短時間に絵文字を大量投稿したユーザーを検知します。",
  },
  {
    id: "mention_spam",
    label: "連続メンション検知",
    description: "短時間にメンションを連続投稿したユーザーを検知します。",
  },
  {
    id: "profanity",
    label: "暴言検知",
    description: "攻撃的な言葉や暴言を検知します。検知しないチャンネルを追加できます。",
  },
  {
    id: "sexual_language",
    label: "下ネタ検知",
    description: "性的な表現や下ネタを検知します。検知しないチャンネルを追加できます。",
  },
  {
    id: "ng_words",
    label: "NGワード検知",
    description: "追加したNGワードを含むメッセージを検知します。",
  },
];

const GUARD_MODERATION_LEVELS = [
  { id: "low", label: "ゆるめ" },
  { id: "medium", label: "標準" },
  { id: "high", label: "厳しめ" },
];

const GUARD_MODERATION_PACE_FEATURE_IDS = new Set(["invite_spam", "other_links", "spam", "emoji_spam", "mention_spam"]);
const GUARD_MODERATION_TEXT_FILTER_FEATURE_IDS = new Set(["profanity", "sexual_language"]);
const GUARD_MODERATION_NG_WORD_FEATURE_IDS = new Set(["ng_words"]);

const GUARD_MODERATION_ACTIONS = [
  { id: "log", label: "ログのみ" },
  { id: "delete", label: "メッセージ削除" },
  { id: "kick", label: "キック" },
  { id: "ban", label: "BAN" },
];

const GUARD_MODERATION_DEFAULTS = {
  invite_spam: { enabled: true, level: "medium", action: "kick", log_channel_id: "", log_channel_ids: [], target_channel_ids: [], all_channels_enabled: true },
  other_links: { enabled: true, level: "high", action: "delete", log_channel_id: "", log_channel_ids: [], target_channel_ids: [], all_channels_enabled: true },
  spam: { enabled: true, level: "medium", action: "delete", log_channel_id: "", log_channel_ids: [], target_channel_ids: [], all_channels_enabled: true },
  emoji_spam: { enabled: true, level: "medium", action: "delete", log_channel_id: "", log_channel_ids: [], target_channel_ids: [], all_channels_enabled: true },
  mention_spam: { enabled: true, level: "medium", action: "delete", log_channel_id: "", log_channel_ids: [], target_channel_ids: [], all_channels_enabled: true },
  profanity: { enabled: true, level: "medium", action: "delete", log_channel_id: "", log_channel_ids: [], target_channel_ids: [], all_channels_enabled: true },
  sexual_language: { enabled: true, level: "medium", action: "delete", log_channel_id: "", log_channel_ids: [], target_channel_ids: [], all_channels_enabled: true },
  ng_words: { enabled: true, level: "medium", action: "delete", log_channel_id: "", log_channel_ids: [], target_channel_ids: [], all_channels_enabled: true, ng_words: [] },
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
    id: "member_banned",
    label: "メンバーBAN",
    description: "メンバーがBANされた時に、対象ユーザー・実行者・理由を送信します。",
    icon: "alert",
  },
  {
    id: "member_unbanned",
    label: "BAN解除",
    description: "メンバーのBANが解除された時に、対象ユーザー・実行者・理由を送信します。",
    icon: "success",
  },
  {
    id: "invite_created",
    label: "招待リンク作成",
    description: "誰かがサーバー招待リンクを作成した時に、作成者・対象チャンネル・期限・使用上限などを送信します。",
    icon: "link",
  },
  {
    id: "invite_deleted",
    label: "招待リンク削除",
    description: "招待リンクが削除された時に、コード・対象チャンネル・実行者候補を送信します。",
    icon: "trash",
  },
  {
    id: "role_added",
    label: "ロール付与",
    description: "メンバーにロールが付与された時に、ユーザー情報・付与ロール・現在のロール数を送信します。",
    icon: "shield",
  },
  {
    id: "role_created",
    label: "ロール作成",
    description: "ロールが作成された時に、ロールID・権限・表示設定を送信します。",
    icon: "shield",
  },
  {
    id: "role_deleted",
    label: "ロール削除",
    description: "ロールが削除された時に、削除前のロール情報と実行者候補を送信します。",
    icon: "trash",
  },
  {
    id: "role_updated",
    label: "ロール更新",
    description: "ロール名、権限、色、表示設定などの変更前後を送信します。",
    icon: "settings",
  },
  {
    id: "channel_created",
    label: "チャンネル作成",
    description: "チャンネルが作成された時に、種類・カテゴリ・位置などを送信します。",
    icon: "folder",
  },
  {
    id: "channel_deleted",
    label: "チャンネル削除",
    description: "チャンネルが削除された時に、削除前の名前・種類・カテゴリなどを送信します。",
    icon: "trash",
  },
  {
    id: "channel_updated",
    label: "チャンネル更新",
    description: "チャンネル名、トピック、低速モードなどの変更前後を送信します。",
    icon: "settings",
  },
  {
    id: "guild_updated",
    label: "サーバー更新",
    description: "サーバー名、所有者、認証レベルなどの変更前後を送信します。",
    icon: "server",
  },
  {
    id: "webhooks_updated",
    label: "Webhook更新",
    description: "チャンネル内のWebhookが作成、削除、更新された可能性がある時に送信します。",
    icon: "link",
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
    id: "voice_moved",
    label: "VC移動",
    description: "メンバーが別のボイスチャンネルへ移動した時に送信します。",
    icon: "radio",
  },
  {
    id: "voice_screen_share_changed",
    label: "VC画面共有",
    description: "メンバーが画面共有を開始または終了した時に送信します。",
    icon: "monitor",
  },
  {
    id: "voice_self_mute_changed",
    label: "VCセルフミュート",
    description: "メンバーが自分のマイクミュートを切り替えた時に送信します。",
    icon: "volume",
  },
  {
    id: "voice_server_mute_changed",
    label: "VCサーバーミュート",
    description: "メンバーのサーバーミュートが切り替わった時に送信します。",
    icon: "alert",
  },
  {
    id: "voice_self_deaf_changed",
    label: "VCセルフスピーカーミュート",
    description: "メンバーが自分のスピーカーミュートを切り替えた時に送信します。",
    icon: "volume",
  },
  {
    id: "voice_server_deaf_changed",
    label: "VCサーバースピーカーミュート",
    description: "メンバーのサーバースピーカーミュートが切り替わった時に送信します。",
    icon: "alert",
  },
  {
    id: "voice_video_changed",
    label: "VCカメラ",
    description: "メンバーがカメラを開始または終了した時に送信します。",
    icon: "monitor",
  },
  {
    id: "voice_suppressed_changed",
    label: "VC発言抑制",
    description: "ステージチャンネルで発言抑制が切り替わった時に送信します。",
    icon: "lock",
  },
  {
    id: "voice_request_to_speak_changed",
    label: "VCスピーカー申請",
    description: "ステージチャンネルでスピーカー申請が切り替わった時に送信します。",
    icon: "user",
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

function createDefaultSupportState() {
  return {
    open: false,
    product: "",
    guildId: "",
    requirement: "",
    requirementOther: "",
    message: "",
    sending: false,
    error: null,
    success: null,
  };
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
  hostInviteRunning: null,
  hostInviteLinks: {},
  hostLastUpdatedAt: null,
  adminPlaylists: [],
  adminPlaylistsLoading: false,
  adminPlaylistsError: null,
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
  playlistSearchLoading: false,
  playlistSearchResults: [],
  playlistSearchQuery: "",
  playlistDragActive: false,
  userActivity: null,
  userActivityLoading: false,
  userActivityError: null,
  activeActivityPeriod: "daily",
  guildRankings: null,
  guildRankingsLoading: false,
  guildRankingsError: null,
  activeRankingPeriod: "daily",
  activeUserPanelTab: "playlist",
  support: createDefaultSupportState(),
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
  authChecking: Boolean(getAuthToken()),
  loading: false,
  saving: false,
  ticketPanelPublishing: false,
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
  pendingProductPageId: null,
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
    adminMessage: null,
    adminError: null,
    adminInviteRunning: null,
    adminInviteLinks: {},
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
    adminPlaylists: 0,
    serviceStatus: 0,
    playlist: 0,
    activity: 0,
    rankings: 0,
    guard: 0,
    guildOptions: 0,
    ticketPanel: 0,
  },
};

const root = document.getElementById("root");
let hostRefreshTimerId = null;
let serviceStatusRefreshTimerId = null;
let guardStatusRefreshTimerId = null;
let guildOptionsRefreshTimerId = null;
let guildOptionsRefreshInFlight = false;
let guildOptionsRenderPending = false;
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
  void refreshSelectedGuildOptions({ silent: true });
  if (shouldAutoRefreshHost()) {
    void loadHostData({ silent: true, keepMessage: true });
  }
});
document.addEventListener("keydown", handleKeydown);

async function boot() {
  const params = new URLSearchParams(window.location.search);
  const authError = params.get("auth_error");
  const sessionToken = params.get("session_token");
  const product = normalizeProductId(params.get("product"));
  const dashboardVersion = params.get("dashboardVersion");

  if (sessionToken) {
    setAuthToken(sessionToken);
    state.authChecking = true;
    params.delete("session_token");
  }
  if (authError) {
    state.authChecking = false;
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
  if (!authError) {
    state.authChecking = Boolean(getAuthToken());
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

async function activateProductPage(productId, options = {}) {
  const nextProduct = normalizeProductId(productId);
  if (!nextProduct) {
    return;
  }
  const nextPageId = nextProduct === "one" ? normalizeOnePageId(options.pageId) : null;
  if (state.activeProduct === nextProduct) {
    if (nextPageId && nextPageId !== state.activePage) {
      requestPageChange(nextPageId);
      return;
    }
    clearPendingNavigation();
    render();
    return;
  }
  if (hasUnsavedChanges()) {
    clearPendingNavigation();
    state.pendingProductId = nextProduct;
    state.pendingProductPageId = nextPageId;
    render();
    return;
  }
  const previousProduct = state.activeProduct;
  state.activeProduct = nextProduct;
  if (nextPageId) {
    state.activePage = nextPageId;
  }
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

function normalizeOnePageId(pageId) {
  if (!pageId) {
    return null;
  }
  if (pageId === USER_PAGE.id) {
    return USER_PAGE.id;
  }
  const pages = visibleSettingsPages();
  return pages.find((page) => page.id === pageId)?.id ?? defaultServerPageId();
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
  if (guildOptionsRefreshTimerId) {
    window.clearInterval(guildOptionsRefreshTimerId);
    guildOptionsRefreshTimerId = null;
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
  guildRankings: (guildId, period) =>
    request(`/guilds/${encodeURIComponent(guildId)}/rankings?period=${encodeURIComponent(period)}`),
  ttsOptions: (guildId) => request(`/guilds/${encodeURIComponent(guildId)}/tts-options`),
  playlist: () => request("/playlist/me"),
  searchPlaylistTracks: (query) =>
    request(
      `/playlist/tracks/search?q=${encodeURIComponent(query)}`,
      {},
      { timeoutMs: 90000 },
    ),
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
  adminPlaylists: () => request("/playlist/admin/users"),
  hostStatus: () => request("/host/status"),
  hostLogs: (limit = 20) => request(`/host/actions?limit=${encodeURIComponent(limit)}`),
  hostAction: (action) =>
    request("/host/actions", {
      method: "POST",
      body: JSON.stringify({ action }),
    }),
  createHostGuildInvite: (guildId) =>
    request(`/host/guilds/${encodeURIComponent(guildId)}/invite`, {
      method: "POST",
    }),
  sendSupportInquiry: (payload) =>
    request("/support/inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
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
  publishTicketPanel: (guildId, channelId) =>
    request(`/guilds/${encodeURIComponent(guildId)}/ticket-panel`, {
      method: "POST",
      body: JSON.stringify({ channel_id: normalizeNullableString(channelId) }),
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
  state.authChecking = true;
  state.loading = true;
  state.message = null;
  state.guildDataError = null;
  state.ticketPanelPublishing = false;
  render();

  try {
    const [me, guilds, playlist] = await Promise.all([api.me(), api.guilds(), api.playlist()]);
    if (requestId !== state.requestIds.account) {
      return;
    }
    state.user = me;
    state.authChecking = false;
    state.guilds = guilds;
    state.playlist = normalizePlaylist(playlist);
    state.userActivity = normalizeUserActivity(null);
    const currentGuild = guilds.find((guild) => guild.id === state.selectedGuildId);
    state.selectedGuildId =
      currentGuild?.bot_present && currentGuild.can_manage
        ? state.selectedGuildId
        : (guilds.find((guild) => guild.bot_present && guild.can_manage)?.id ?? null);
    syncSupportGuildSelection();
    render();
    if (state.selectedGuildId && activeSettingsView() !== "user") {
      await loadGuildData(state.selectedGuildId);
    }
    if (activeSettingsView() === "host") {
      await loadHostAdminData({ silent: true });
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
    state.authChecking = false;
    state.message = error instanceof Error ? error.message : "APIに接続できませんでした。";
  } finally {
    if (requestId === state.requestIds.account) {
      state.authChecking = false;
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
  state.authChecking = true;
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
    state.authChecking = false;
    state.guilds = Array.isArray(guilds) ? guilds : [];
    const currentGuild = state.guilds.find((guild) => guild.id === state.selectedGuildId);
    state.selectedGuildId =
      currentGuild?.bot_present && currentGuild.can_manage
        ? state.selectedGuildId
        : (state.guilds.find((guild) => guild.bot_present && guild.can_manage)?.id ?? null);
    syncSupportGuildSelection();
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
    state.authChecking = false;
    state.message = error instanceof Error ? error.message : "サーバー一覧を取得できませんでした。";
  } finally {
    if (requestId === state.requestIds.account) {
      state.authChecking = false;
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
  state.guildRankings = null;
  state.guildRankingsLoading = false;
  state.guildRankingsError = null;
  state.savedSettings = null;
  state.savedFeatureSettings = null;
  resetDirtyViews();
  render();

  try {
    const rankingPeriod = normalizedRankingPeriod();
    const [settings, options, featureSettings, guildRankings] = await Promise.all([
      api.settings(guildId),
      api.ttsOptions(guildId),
      api.featureSettings(guildId),
      api.guildRankings(guildId, rankingPeriod),
    ]);
    if (requestId !== state.requestIds.guildData) {
      return;
    }
    rememberSavedSettings(settings);
    state.ttsOptions = options;
    guildOptionsRenderPending = false;
    rememberSavedFeatureSettings(featureSettings);
    state.guildRankings = normalizeGuildRankings(guildRankings);
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

async function refreshSelectedGuildOptions(options = {}) {
  const guildId = state.selectedGuildId;
  const view = activeSettingsView();
  if (
    !guildId ||
      state.activeProduct !== "one" ||
      !state.user ||
      state.loading ||
      state.saving ||
      (view !== "tts" && view !== "features")
  ) {
    return;
  }
  if (guildOptionsRefreshInFlight) {
    return;
  }

  guildOptionsRefreshInFlight = true;
  const requestId = state.requestIds.guildOptions + 1;
  state.requestIds.guildOptions = requestId;
  try {
    const nextOptions = await api.ttsOptions(guildId);
    if (
      requestId !== state.requestIds.guildOptions ||
        guildId !== state.selectedGuildId ||
        state.activeProduct !== "one"
    ) {
      return;
    }
    if (guildOptionsChanged(state.ttsOptions, nextOptions)) {
      guildOptionsRenderPending = true;
    }
    state.ttsOptions = nextOptions;
    if (
      guildOptionsRenderPending &&
        options.renderAfter !== false &&
        !shouldDeferGuildOptionsRender()
    ) {
      guildOptionsRenderPending = false;
      render();
    }
  } catch {
    // Keep the current options; regular status refresh handles visible errors.
  } finally {
    guildOptionsRefreshInFlight = false;
  }
}

function guildOptionsChanged(currentOptions, nextOptions) {
  return guildOptionsSignature(currentOptions) !== guildOptionsSignature(nextOptions);
}

function guildOptionsSignature(options) {
  try {
    return JSON.stringify(options ?? null);
  } catch {
    return "";
  }
}

function shouldDeferGuildOptionsRender() {
  const active = document.activeElement;
  return (
    active instanceof HTMLInputElement ||
      active instanceof HTMLSelectElement ||
      active instanceof HTMLTextAreaElement
  );
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

async function loadHostAdminData(options = {}) {
  await Promise.all([
    loadHostData(options),
    loadAdminPlaylists(options),
  ]);
}

async function loadAdminPlaylists(options = {}) {
  if (!state.user || !canViewHostAdmin()) {
    return;
  }
  const requestId = state.requestIds.adminPlaylists + 1;
  state.requestIds.adminPlaylists = requestId;
  state.adminPlaylistsLoading = !options.silent;
  state.adminPlaylistsError = null;
  render();

  try {
    const playlists = await api.adminPlaylists();
    if (requestId !== state.requestIds.adminPlaylists) {
      return;
    }
    state.adminPlaylists = normalizeAdminPlaylists(playlists);
  } catch (error) {
    if (requestId !== state.requestIds.adminPlaylists) {
      return;
    }
    state.adminPlaylistsError = error instanceof Error ? error.message : "ユーザー別プレイリストを取得できませんでした。";
  } finally {
    if (requestId === state.requestIds.adminPlaylists) {
      state.adminPlaylistsLoading = false;
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

async function loadGuildRankings(guildId = state.selectedGuildId, options = {}) {
  if (!guildId) {
    return;
  }
  const requestId = state.requestIds.rankings + 1;
  state.requestIds.rankings = requestId;
  state.guildRankingsLoading = !options.silent;
  state.guildRankingsError = null;
  render();

  try {
    const rankings = await api.guildRankings(guildId, normalizedRankingPeriod());
    if (requestId !== state.requestIds.rankings) {
      return;
    }
    state.guildRankings = normalizeGuildRankings(rankings);
  } catch (error) {
    if (requestId !== state.requestIds.rankings) {
      return;
    }
    state.guildRankingsError = error instanceof Error ? error.message : "ランキングを取得できませんでした。";
  } finally {
    if (requestId === state.requestIds.rankings) {
      state.guildRankingsLoading = false;
      render();
    }
  }
}

async function sendSupportInquiry() {
  const product = normalizeSupportProduct(state.support.product);
  const requirement = normalizeSupportRequirement(state.support.requirement);
  syncSupportGuildSelection();
  const guild = supportSelectedGuild();
  const message = state.support.message.trim();
  const requirementOther = state.support.requirementOther.trim();

  if (!product) {
    state.support.error = "Discat Guard か Discat One のどちらへの問い合わせかを選択してください。";
    state.support.success = null;
    render();
    return;
  }
  if (!guild) {
    state.support.error = `${supportProductLabel(product)} BOTが入っていて、あなたが管理権限を持つサーバーが見つかりません。`;
    state.support.success = null;
    render();
    return;
  }
  if (!requirement) {
    state.support.error = "要件を選択してください。";
    state.support.success = null;
    render();
    return;
  }
  if (requirement === "other" && !requirementOther) {
    state.support.error = "その他の要件を入力してください。";
    state.support.success = null;
    render();
    return;
  }
  if (!message) {
    state.support.error = "メッセージを入力してください。";
    state.support.success = null;
    render();
    return;
  }

  state.support.sending = true;
  state.support.error = null;
  state.support.success = null;
  render();
  try {
    const result = await api.sendSupportInquiry({
      product,
      guild_id: guild.id,
      requirement,
      requirement_other: requirement === "other" ? requirementOther : null,
      message,
    });
    state.support = {
      ...createDefaultSupportState(),
      open: true,
      product,
      guildId: guild.id,
      success: result?.message ?? "問い合わせを送信しました。",
    };
  } catch (error) {
    state.support.error = error instanceof Error ? error.message : "問い合わせの送信に失敗しました。";
  } finally {
    state.support.sending = false;
    render();
  }
}

async function submitPlaylistInput() {
  const input = state.playlistUrl.trim();
  if (!input) {
    state.playlistError = "曲名または音楽サービスのURLを入力してください。";
    state.playlistMessage = null;
    render();
    return;
  }

  if (isHttpUrl(input)) {
    await addPlaylistUrl(input, { clearInput: true, clearSearch: true });
    return;
  }

  await searchPlaylistTracks(input);
}

async function searchPlaylistTracks(query = state.playlistUrl.trim()) {
  const cleanedQuery = query.trim();
  if (!cleanedQuery) {
    state.playlistError = "検索する曲名を入力してください。";
    state.playlistMessage = null;
    render();
    return;
  }
  state.playlistSearchLoading = true;
  state.playlistError = null;
  state.playlistMessage = null;
  state.playlistSearchQuery = cleanedQuery;
  state.playlistSearchResults = [];
  render();
  try {
    const results = await api.searchPlaylistTracks(cleanedQuery);
    state.playlistSearchResults = normalizePlaylistSearchResults(results);
    if (!state.playlistSearchResults.length) {
      state.playlistError = "該当する曲が見つかりませんでした。曲名やアーティスト名を変えて検索してください。";
    }
  } catch (error) {
    state.playlistError = error instanceof Error ? error.message : "曲名検索に失敗しました。";
  } finally {
    state.playlistSearchLoading = false;
    render();
  }
}

async function addPlaylistUrl(url = state.playlistUrl.trim(), options = {}) {
  const cleanedUrl = url.trim();
  if (!cleanedUrl) {
    state.playlistError = "追加するURLを指定してください。";
    state.playlistMessage = null;
    render();
    return;
  }
  state.playlistSaving = true;
  state.playlistError = null;
  state.playlistMessage = null;
  render();
  try {
    const playlist = await api.addPlaylistUrl(cleanedUrl);
    state.playlist = normalizePlaylist(playlist);
    state.playlistMessage = "プレイリストに追加しました。";
    if (options.clearInput) {
      state.playlistUrl = "";
    }
    if (options.clearSearch) {
      state.playlistSearchResults = [];
      state.playlistSearchQuery = "";
    }
  } catch (error) {
    state.playlistError = error instanceof Error ? error.message : "URLの登録に失敗しました。";
  } finally {
    state.playlistSaving = false;
    render();
  }
}

async function addPlaylistSearchResult(url) {
  await addPlaylistUrl(url, { clearInput: true, clearSearch: true });
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

function isHttpUrl(value) {
  return /^https?:\/\//i.test(String(value ?? "").trim());
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
    bot_status: status?.bot_status
      ? {
          ...status.bot_status,
          guilds: normalizeBotGuilds(status.bot_status.guilds),
        }
      : null,
  };
}

function normalizeBotGuilds(guilds) {
  if (!Array.isArray(guilds)) {
    return [];
  }
  return guilds
    .map((guild) => ({
      id: String(guild?.id ?? ""),
      name: String(guild?.name ?? guild?.id ?? "Unknown Server"),
      icon_url: normalizeNullableString(guild?.icon_url),
      member_count: guild?.member_count == null ? null : Number(guild.member_count),
      owner_id: normalizeNullableString(guild?.owner_id),
      created_at: guild?.created_at ?? null,
      joined_at: guild?.joined_at ?? null,
      shard_id: guild?.shard_id == null ? null : Number(guild.shard_id),
    }))
    .filter((guild) => guild.id);
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

function authCheckingActive() {
  return Boolean(state.authChecking && getAuthToken() && !state.user);
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

function shouldAutoRefreshGuildOptions() {
  const view = activeSettingsView();
  return Boolean(
    state.activeProduct === "one" &&
      state.user &&
      state.selectedGuildId &&
      !state.loading &&
      !state.saving &&
      !document.hidden &&
      (view === "tts" || view === "features"),
  );
}

function syncGuildOptionsAutoRefresh() {
  if (shouldAutoRefreshGuildOptions()) {
    if (!guildOptionsRefreshTimerId) {
      guildOptionsRefreshTimerId = window.setInterval(() => {
        if (shouldAutoRefreshGuildOptions()) {
          void refreshSelectedGuildOptions({ silent: true });
        }
      }, GUILD_OPTIONS_REFRESH_INTERVAL_MS);
    }
    return;
  }
  if (guildOptionsRefreshTimerId) {
    window.clearInterval(guildOptionsRefreshTimerId);
    guildOptionsRefreshTimerId = null;
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

async function createHostGuildInvite(guildId) {
  const resolvedGuildId = String(guildId ?? "");
  if (!resolvedGuildId) {
    return;
  }
  state.hostInviteRunning = resolvedGuildId;
  state.hostError = null;
  state.hostMessage = null;
  const pendingInviteWindow = openPendingInviteWindow();
  render();

  try {
    const invite = normalizeAdminGuildInvite(await api.createHostGuildInvite(resolvedGuildId));
    state.hostInviteLinks = { ...state.hostInviteLinks, [resolvedGuildId]: invite };
    state.hostMessage = `${invite.guild_name || "サーバー"} の招待リンクを作成しました。`;
    openInviteUrl(invite.invite_url, pendingInviteWindow);
  } catch (error) {
    closePendingInviteWindow(pendingInviteWindow);
    state.hostError = error instanceof Error ? error.message : "招待リンクを作成できませんでした。";
  } finally {
    state.hostInviteRunning = null;
    render();
  }
}

async function createGuardGuildInvite(guildId) {
  const resolvedGuildId = String(guildId ?? "");
  if (!resolvedGuildId) {
    return;
  }
  if (!getAuthToken()) {
    state.guard.adminError = "管理者ログインが必要です。";
    render();
    return;
  }
  state.guard.adminInviteRunning = resolvedGuildId;
  state.guard.adminError = null;
  state.guard.adminMessage = null;
  const pendingInviteWindow = openPendingInviteWindow();
  render();

  try {
    const invite = normalizeAdminGuildInvite(await guardCreateAdminGuildInvite(resolvedGuildId));
    state.guard.adminInviteLinks = { ...state.guard.adminInviteLinks, [resolvedGuildId]: invite };
    state.guard.adminMessage = `${invite.guild_name || "サーバー"} の招待リンクを作成しました。`;
    openInviteUrl(invite.invite_url, pendingInviteWindow);
  } catch (error) {
    closePendingInviteWindow(pendingInviteWindow);
    state.guard.adminError = error instanceof Error ? error.message : "招待リンクを作成できませんでした。";
  } finally {
    state.guard.adminInviteRunning = null;
    render();
  }
}

function normalizeAdminGuildInvite(invite) {
  return {
    guild_id: String(invite?.guild_id ?? ""),
    guild_name: normalizeNullableString(invite?.guild_name),
    channel_id: String(invite?.channel_id ?? ""),
    channel_name: normalizeNullableString(invite?.channel_name),
    code: String(invite?.code ?? ""),
    invite_url: String(invite?.invite_url ?? ""),
    max_age: Number(invite?.max_age ?? 0),
    max_uses: Number(invite?.max_uses ?? 0),
    temporary: Boolean(invite?.temporary),
  };
}

function openPendingInviteWindow() {
  try {
    const inviteWindow = window.open("about:blank", "_blank");
    if (inviteWindow) {
      inviteWindow.opener = null;
    }
    return inviteWindow;
  } catch {
    return null;
  }
}

function closePendingInviteWindow(inviteWindow) {
  try {
    inviteWindow?.close();
  } catch {
    // Ignore browser popup policy errors.
  }
}

function openInviteUrl(url, inviteWindow = null) {
  const inviteUrl = String(url ?? "").trim();
  if (!inviteUrl) {
    closePendingInviteWindow(inviteWindow);
    return;
  }
  if (inviteWindow) {
    inviteWindow.location.href = inviteUrl;
    return;
  }
  window.open(inviteUrl, "_blank", "noopener");
}

function normalizeDashboardSettings(settings) {
  return {
    ...settings,
    tts_enabled: Boolean(settings.tts_enabled),
    tts_engine: TTS_ENGINE_FIXED,
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
    bump_rank: normalizeBumpRankSettings(featureSettings?.bump_rank),
    ticket: normalizeTicketSettings(featureSettings?.ticket),
  };
}

function normalizePlaylist(playlist) {
  return {
    user_id: String(playlist?.user_id ?? state.user?.discord_user_id ?? ""),
    tracks: Array.isArray(playlist?.tracks) ? playlist.tracks.map(normalizePlaylistTrack) : [],
    updated_at: playlist?.updated_at ?? null,
  };
}

function normalizePlaylistSearchResults(results) {
  return Array.isArray(results)
    ? results
        .map((result) => ({
          title: String(result?.title ?? "Untitled"),
          webpage_url: normalizeNullableString(result?.webpage_url),
          duration: Number.isFinite(Number(result?.duration)) ? Number(result.duration) : null,
          thumbnail: normalizeNullableString(result?.thumbnail),
          source_label: normalizeNullableString(result?.source_label) || "YouTube",
        }))
        .filter((result) => result.webpage_url)
    : [];
}

function normalizeAdminPlaylists(playlists) {
  return Array.isArray(playlists)
    ? playlists
        .map((playlist) => ({
          user_id: String(playlist?.user_id ?? ""),
          username: normalizeNullableString(playlist?.username),
          avatar_url: normalizeNullableString(playlist?.avatar_url),
          tracks: Array.isArray(playlist?.tracks) ? playlist.tracks.map(normalizePlaylistTrack) : [],
          updated_at: playlist?.updated_at ?? null,
        }))
        .filter((playlist) => playlist.user_id)
    : [];
}

function normalizeUserActivity(activity) {
  return {
    user_id: String(activity?.user_id ?? state.user?.discord_user_id ?? ""),
    generated_at: activity?.generated_at ?? null,
    daily: normalizeUserActivityPoints(activity?.daily).slice(-ACTIVITY_POINT_LIMITS.daily),
    weekly: normalizeUserActivityPoints(activity?.weekly).slice(-ACTIVITY_POINT_LIMITS.weekly),
    monthly: normalizeUserActivityPoints(activity?.monthly).slice(-ACTIVITY_POINT_LIMITS.monthly),
  };
}

function normalizeUserActivityPoints(points) {
  return Array.isArray(points)
    ? points.map(normalizeUserActivityPoint).sort(compareUserActivityPoints)
    : [];
}

function compareUserActivityPoints(left, right) {
  const leftKey = left.start_date || left.label;
  const rightKey = right.start_date || right.label;
  return leftKey.localeCompare(rightKey);
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

function normalizeGuildRankings(rankings) {
  const period = normalizeRankingPeriod(rankings?.period ?? state.activeRankingPeriod);
  return {
    guild_id: String(rankings?.guild_id ?? state.selectedGuildId ?? ""),
    generated_at: normalizeNullableString(rankings?.generated_at),
    period,
    start_date: String(rankings?.start_date ?? ""),
    end_date: String(rankings?.end_date ?? ""),
    active_sources: normalizeActiveRankingSources(rankings?.active_sources),
    active: normalizeGuildRankingEntries(rankings?.active),
    text: normalizeGuildRankingEntries(rankings?.text),
    message: normalizeGuildRankingEntries(rankings?.message),
    vc: normalizeGuildRankingEntries(rankings?.vc),
    bump: normalizeGuildRankingEntries(rankings?.bump),
  };
}

function normalizeGuildRankingEntries(entries) {
  return Array.isArray(entries)
    ? entries.map(normalizeGuildRankingEntry).filter((entry) => entry.user_id && entry.points > 0)
    : [];
}

function normalizeGuildRankingEntry(entry) {
  return {
    rank: Math.max(0, Math.trunc(Number(entry?.rank) || 0)),
    user_id: String(entry?.user_id ?? ""),
    display_name: normalizeNullableString(entry?.display_name),
    points: Math.max(0, Math.trunc(Number(entry?.points) || 0)),
    message_count: Math.max(0, Math.trunc(Number(entry?.message_count) || 0)),
    character_count: Math.max(0, Math.trunc(Number(entry?.character_count) || 0)),
    vc_seconds: Math.max(0, Math.trunc(Number(entry?.vc_seconds) || 0)),
    bump_count: Math.max(0, Math.trunc(Number(entry?.bump_count) || 0)),
    bump_points: Math.max(0, Math.trunc(Number(entry?.bump_points ?? entry?.bump_count) || 0)),
  };
}

function normalizeActiveRankingSources(sources) {
  if (!Array.isArray(sources)) {
    return [...DEFAULT_ACTIVE_RANKING_SOURCES];
  }
  const selected = [];
  for (const source of sources) {
    const id = String(source ?? "").trim();
    if (ACTIVE_RANKING_SOURCES.some((item) => item.id === id) && !selected.includes(id)) {
      selected.push(id);
    }
  }
  return selected;
}

function sameStringList(left, right) {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((value, index) => value === right[index]);
}

function normalizeRankingPeriod(value) {
  const period = String(value ?? "daily");
  return RANKING_PERIODS.some((item) => item.id === period) ? period : "daily";
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
    emoji: VC_NOTIFICATION_REACTION_EMOJI,
    role_id: normalizeNullableString(settings?.role_id) ?? "",
  };
}

function normalizeBumpRankSettings(settings) {
  return {
    channel_id: normalizeNullableString(settings?.channel_id) ?? "",
    role_id: normalizeNullableString(settings?.role_id) ?? "",
    reset_interval: normalizeBumpRankResetInterval(settings?.reset_interval),
    ranking_channel_id: normalizeNullableString(settings?.ranking_channel_id) ?? "",
    active_ranking_sources: normalizeActiveRankingSources(settings?.active_ranking_sources),
    total_bumps: Math.max(0, Math.trunc(Number(settings?.total_bumps) || 0)),
    next_bump_at: normalizeNullableString(settings?.next_bump_at),
    last_bump_at: normalizeNullableString(settings?.last_bump_at),
    next_reset_at: normalizeNullableString(settings?.next_reset_at),
    last_reset_at: normalizeNullableString(settings?.last_reset_at),
  };
}

function normalizeTicketSettings(settings) {
  const cooldownSeconds = Number(settings?.staff_call_cooldown_seconds);
  return {
    category_id: normalizeNullableString(settings?.category_id) ?? "",
    staff_role_id: normalizeNullableString(settings?.staff_role_id) ?? "",
    log_channel_id: normalizeNullableString(settings?.log_channel_id) ?? "",
    panel_channel_id: normalizeNullableString(settings?.panel_channel_id) ?? "",
    panel_message_id: normalizeNullableString(settings?.panel_message_id) ?? "",
    panel_title: String(settings?.panel_title ?? TICKET_PANEL_DEFAULT_TITLE).trim() || TICKET_PANEL_DEFAULT_TITLE,
    panel_description:
      String(settings?.panel_description ?? TICKET_PANEL_DEFAULT_DESCRIPTION).trim()
      || TICKET_PANEL_DEFAULT_DESCRIPTION,
    creator_can_close: settings?.creator_can_close !== false,
    staff_call_cooldown_seconds: Number.isFinite(cooldownSeconds)
      ? clampInteger(cooldownSeconds, 60, 86400)
      : TICKET_CALL_COOLDOWN_MINUTES_DEFAULT * 60,
    next_number: Math.max(1, Math.trunc(Number(settings?.next_number) || 1)),
  };
}

function normalizeBumpRankResetInterval(value) {
  const interval = String(value ?? "none");
  return BUMP_RANK_RESET_INTERVALS.some((item) => item.id === interval) ? interval : "none";
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
    tts_engine: TTS_ENGINE_FIXED,
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
  const bumpRank = comparableBumpRankSettings(featureSettings.bump_rank);
  const ticket = comparableTicketSettings(featureSettings.ticket);
  return {
    welcome_message: comparableWelcomeMessageSettings(featureSettings.welcome_message),
    global_chat_channel_id: normalizeNullableString(featureSettings.global_chat_channel_id),
    sticky_messages: (featureSettings.sticky_messages ?? []).map((rule) => ({
      channel_id: rule.channel_id,
      content: rule.content,
    })),
    vc_notification: vcNotification,
    bump_rank: bumpRank,
    ticket,
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
  const hasAnyValue = Boolean(
    normalized.reaction_channel_id
      || normalized.notification_channel_id
      || normalized.reaction_message_id
      || normalized.role_id,
  );
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

function comparableTicketSettings(settings) {
  const normalized = normalizeTicketSettings(settings);
  const hasAnyValue = Boolean(
    normalized.category_id
      || normalized.staff_role_id
      || normalized.log_channel_id
      || normalized.panel_channel_id
      || normalized.panel_message_id
      || normalized.panel_title !== TICKET_PANEL_DEFAULT_TITLE
      || normalized.panel_description !== TICKET_PANEL_DEFAULT_DESCRIPTION
      || normalized.creator_can_close !== true
      || normalized.staff_call_cooldown_seconds !== TICKET_CALL_COOLDOWN_MINUTES_DEFAULT * 60
      || normalized.next_number !== 1,
  );
  if (!hasAnyValue) {
    return null;
  }
  return {
    category_id: normalizeNullableString(normalized.category_id),
    staff_role_id: normalizeNullableString(normalized.staff_role_id),
    log_channel_id: normalizeNullableString(normalized.log_channel_id),
    panel_channel_id: normalizeNullableString(normalized.panel_channel_id),
    panel_message_id: normalizeNullableString(normalized.panel_message_id),
    panel_title: normalized.panel_title,
    panel_description: normalized.panel_description,
    creator_can_close: normalized.creator_can_close,
    staff_call_cooldown_seconds: normalized.staff_call_cooldown_seconds,
    next_number: normalized.next_number,
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
  if (featureId === "admin") {
    return "guardAdmin";
  }
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
      tts_engine: TTS_ENGINE_FIXED,
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
    const updated = await api.updateFeatureSettings(state.selectedGuildId, buildFeatureSettingsPatch());
    if (requestId === state.requestIds.save) {
      rememberSavedFeatureSettings(updated);
      clearPendingNavigation();
      saved = true;
      if (state.selectedGuildId && ["bump-rank", "server-rank"].includes(activeSettingsPage().id)) {
        void loadGuildRankings(state.selectedGuildId, { silent: true });
      }
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

async function publishTicketPanel() {
  if (!state.selectedGuildId || !state.featureSettings) {
    return false;
  }

  if (isViewDirty("features")) {
    const saved = await saveFeatureSettings();
    if (!saved) {
      return false;
    }
  }

  const ticketSettings = normalizeTicketSettings(state.featureSettings.ticket);
  if (!ticketSettings.category_id || !ticketSettings.staff_role_id || !ticketSettings.panel_channel_id) {
    state.message = "カテゴリ、スタッフロール、パネル送信先チャンネルを設定してください。";
    render();
    return false;
  }

  const requestId = state.requestIds.ticketPanel + 1;
  state.requestIds.ticketPanel = requestId;
  state.ticketPanelPublishing = true;
  state.message = null;
  render();

  try {
    const result = await api.publishTicketPanel(state.selectedGuildId, ticketSettings.panel_channel_id);
    if (requestId !== state.requestIds.ticketPanel) {
      return false;
    }
    const refreshed = await api.featureSettings(state.selectedGuildId);
    if (requestId !== state.requestIds.ticketPanel) {
      return false;
    }
    rememberSavedFeatureSettings(refreshed);
    state.message = result?.panel_url
      ? `チケットパネルを送信しました: ${result.panel_url}`
      : "チケットパネルを送信しました。";
    return true;
  } catch (error) {
    if (requestId === state.requestIds.ticketPanel) {
      state.message = error instanceof Error ? error.message : "チケットパネルの送信に失敗しました。";
    }
    return false;
  } finally {
    if (requestId === state.requestIds.ticketPanel) {
      state.ticketPanelPublishing = false;
      render();
    }
  }
}

function buildFeatureSettingsPatch() {
  const pageId = activeSettingsPage().id;
  if (pageId === "welcome-message") {
    return {
      welcome_message: buildWelcomeMessagePatch(state.featureSettings.welcome_message),
    };
  }
  if (pageId === "global-chat") {
    return {
      global_chat_channel_id: normalizeNullableString(state.featureSettings.global_chat_channel_id),
    };
  }
  if (pageId === "sticky-message") {
    return {
      sticky_messages: state.featureSettings.sticky_messages
        .map((rule) => ({
          channel_id: rule.channel_id,
          content: rule.content.trim(),
        }))
        .filter((rule) => rule.channel_id && rule.content),
    };
  }
  if (pageId === "vc-notification") {
    return {
      vc_notification: buildVcNotificationPatch(state.featureSettings.vc_notification),
    };
  }
  if (pageId === "ticket") {
    return {
      ticket: buildTicketPatch(state.featureSettings.ticket),
    };
  }
  if (["bump-rank", "server-rank"].includes(pageId)) {
    return {
      bump_rank: buildBumpRankPatch(state.featureSettings.bump_rank),
    };
  }
  return {};
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
  const hasAnyValue = Boolean(
    normalized.reaction_channel_id
      || normalized.notification_channel_id
      || normalized.reaction_message_id
      || normalized.role_id,
  );
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

function buildTicketPatch(settings) {
  const normalized = normalizeTicketSettings(settings);
  const hasAnyValue = Boolean(
    normalized.category_id
      || normalized.staff_role_id
      || normalized.log_channel_id
      || normalized.panel_channel_id
      || normalized.panel_message_id
      || normalized.panel_title !== TICKET_PANEL_DEFAULT_TITLE
      || normalized.panel_description !== TICKET_PANEL_DEFAULT_DESCRIPTION
      || normalized.creator_can_close !== true
      || normalized.staff_call_cooldown_seconds !== TICKET_CALL_COOLDOWN_MINUTES_DEFAULT * 60
      || normalized.next_number !== 1,
  );
  if (!hasAnyValue) {
    return null;
  }
  return {
    category_id: normalized.category_id || null,
    staff_role_id: normalized.staff_role_id || null,
    log_channel_id: normalized.log_channel_id || null,
    panel_channel_id: normalized.panel_channel_id || null,
    panel_message_id: normalized.panel_message_id || null,
    panel_title: normalized.panel_title,
    panel_description: normalized.panel_description,
    creator_can_close: normalized.creator_can_close,
    staff_call_cooldown_seconds: normalized.staff_call_cooldown_seconds,
    next_number: normalized.next_number,
  };
}

function buildBumpRankPatch(settings) {
  const normalized = normalizeBumpRankSettings(settings);
  const sourcesChanged = !sameStringList(normalized.active_ranking_sources, DEFAULT_ACTIVE_RANKING_SOURCES);
  const hasAnyValue = Boolean(
    normalized.channel_id
      || normalized.role_id
      || normalized.ranking_channel_id
      || normalized.reset_interval !== "none"
      || sourcesChanged,
  );
  if (!hasAnyValue) {
    return null;
  }
  return {
    channel_id: normalized.channel_id || null,
    role_id: normalized.role_id || null,
    reset_interval: normalized.reset_interval,
    ranking_channel_id: normalized.ranking_channel_id || null,
    active_ranking_sources: normalized.active_ranking_sources,
  };
}

async function logout() {
  state.requestIds.account += 1;
  state.requestIds.guildData += 1;
  state.requestIds.save += 1;
  state.requestIds.playlist += 1;
  state.requestIds.rankings += 1;
  state.requestIds.ticketPanel += 1;
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
  state.authChecking = false;
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
  state.hostInviteRunning = null;
  state.hostInviteLinks = {};
  state.hostLastUpdatedAt = null;
  state.adminPlaylists = [];
  state.adminPlaylistsLoading = false;
  state.adminPlaylistsError = null;
  state.playlist = null;
  state.playlistLoading = false;
  state.playlistSaving = false;
  state.playlistError = null;
  state.playlistMessage = null;
  state.playlistUrl = "";
  state.playlistSearchLoading = false;
  state.playlistSearchResults = [];
  state.playlistSearchQuery = "";
  state.playlistDragActive = false;
  state.userActivity = null;
  state.userActivityLoading = false;
  state.userActivityError = null;
  state.activeActivityPeriod = "daily";
  state.guildRankings = null;
  state.guildRankingsLoading = false;
  state.guildRankingsError = null;
  state.activeRankingPeriod = "daily";
  state.activeUserPanelTab = "playlist";
  state.support = createDefaultSupportState();
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

function normalizeSupportProduct(value) {
  const product = String(value ?? "").toLowerCase();
  return SUPPORT_PRODUCTS.some((item) => item.id === product) ? product : "";
}

function normalizeSupportRequirement(value) {
  const requirement = String(value ?? "").toLowerCase();
  return SUPPORT_REQUIREMENTS.some((item) => item.id === requirement) ? requirement : "";
}

function supportProductLabel(product) {
  return SUPPORT_PRODUCTS.find((item) => item.id === product)?.label ?? "BOT";
}

function supportEligibleGuilds(product = state.support.product) {
  const normalizedProduct = normalizeSupportProduct(product);
  if (normalizedProduct === "guard") {
    return guardConfigurableGuilds();
  }
  if (normalizedProduct === "one") {
    return state.guilds.filter((guild) => guild.bot_present && guild.can_manage);
  }
  return [];
}

function preferredSupportGuild(product, guilds = supportEligibleGuilds(product)) {
  const normalizedProduct = normalizeSupportProduct(product);
  if (!normalizedProduct) {
    return null;
  }
  const preferredGuildId =
    normalizedProduct === "guard"
      ? activeGuardSelectedGuild()?.id
      : state.selectedGuildId;
  return guilds.find((guild) => guild.id === preferredGuildId) ?? guilds[0] ?? null;
}

function supportSelectedGuild() {
  const product = normalizeSupportProduct(state.support.product);
  const guilds = supportEligibleGuilds(product);
  return guilds.find((guild) => guild.id === state.support.guildId) ?? preferredSupportGuild(product, guilds);
}

function supportRequiresOther() {
  return normalizeSupportRequirement(state.support.requirement) === "other";
}

function syncSupportGuildSelection() {
  const product = normalizeSupportProduct(state.support.product);
  if (!product) {
    state.support.guildId = "";
    return;
  }
  const guilds = supportEligibleGuilds(product);
  if (!guilds.some((guild) => guild.id === state.support.guildId)) {
    state.support.guildId = preferredSupportGuild(product, guilds)?.id ?? "";
  }
}

function openSupportInquiry() {
  if (!state.user) {
    state.message = "問い合わせにはDiscordログインが必要です。";
    render();
    return;
  }
  state.support.open = true;
  state.support.error = null;
  state.support.success = null;
  syncSupportGuildSelection();
  if (state.support.product === "guard" && state.guard.source !== "api") {
    void loadGuardData();
  }
  render();
}

function closeSupportInquiry() {
  state.support.open = false;
  state.support.error = null;
  state.support.success = null;
  render();
}

function resetSupportInquiryForm() {
  state.support = {
    ...createDefaultSupportState(),
    open: true,
  };
  render();
}

function canViewHostAdmin() {
  return String(state.user?.discord_user_id ?? "") === HOST_CONTROL_ADMIN_DISCORD_USER_ID;
}

function visibleSettingsPages() {
  return SETTINGS_PAGES.filter((page) => page.view !== "host" || canViewHostAdmin());
}

function visibleGuardFeatures() {
  return GUARD_FEATURES.filter((feature) => !feature.adminOnly || canViewHostAdmin());
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
      ${statusOnly ? "" : renderSupportInquiryDialog()}
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
    syncGuildOptionsAutoRefresh();
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
  if (authCheckingActive()) {
    return renderServiceStatusPanel("checking");
  }
  return state.user ? renderDashboard() : renderLoginPanel();
}

function serviceStatusOnlyActive() {
  return serviceCheckingActive() || serviceMaintenanceActive() || authCheckingActive();
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
              <button class="icon-button icon-button--primary support-launch-button" type="button" data-action="open-support-inquiry">
                ${icon("message")}<span>問い合わせ</span>
              </button>
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
  const userActive = isUserPageTopNavActive();
  return `
    <div class="product-switcher" role="tablist" aria-label="Discat dashboard switch">
      ${
        state.user
          ? `
            <button class="product-switcher__item ${userActive ? "product-switcher__item--active" : ""}" type="button" role="tab" aria-selected="${userActive}" data-action="switch-user-page">
              <span>ユーザーページ</span>
            </button>
          `
          : ""
      }
      ${Object.values(PRODUCT_META).map((product) => `
        <button class="product-switcher__item ${isProductTopNavActive(product.id) ? "product-switcher__item--active" : ""}" type="button" role="tab" aria-selected="${isProductTopNavActive(product.id)}" data-action="switch-product" data-product="${product.id}">
          <span>${escapeHtml(product.shortLabel)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function isUserPageTopNavActive() {
  return Boolean(state.user) && state.activeProduct === "one" && activeSettingsView() === "user";
}

function isProductTopNavActive(productId) {
  return state.activeProduct === productId && !isUserPageTopNavActive();
}

function loginButtonState() {
  if (authCheckingActive()) {
    return { icon: "radio", label: "接続中" };
  }
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
  if (authCheckingActive()) {
    return { icon: "radio", label: "接続中" };
  }
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
    authCheckingActive() ||
    state.serviceStatus.loading ||
    serviceMaintenanceActive() ||
    state.security.loading ||
    Boolean(state.security.error && !state.security.verified) ||
    (state.security.enabled && !state.security.verified)
  );
}

function guardLoginBlocked() {
  return (
    authCheckingActive() ||
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
      syncSupportGuildSelection();
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
  syncSupportGuildSelection();
  state.guard.loading = false;
  if (options.renderAfter !== false) {
    render();
  }
}

function guardApiUrl(path) {
  return `${state.guard.apiBase}${path}`;
}

function guardCreateAdminGuildInvite(guildId) {
  const token = getAuthToken();
  if (!token) {
    return Promise.reject(new Error("管理者ログインが必要です。"));
  }
  return guardFetchJson(
    guardApiUrl(`/admin/guilds/${encodeURIComponent(guildId)}/invite`),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
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
    guilds: normalizeBotGuilds(status?.guilds),
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

function normalizeGuardModerationChannelRows(value) {
  const rawItems = Array.isArray(value) ? value : value ? [value] : [];
  const seen = new Set();
  const rows = [];
  rawItems.forEach((item) => {
    const channelId = String(item ?? "").trim();
    if (!channelId) {
      rows.push("");
      return;
    }
    if (/^\d+$/.test(channelId) && !seen.has(channelId)) {
      seen.add(channelId);
      rows.push(channelId);
    }
  });
  return rows;
}

function normalizeGuardModerationWords(value) {
  const rawItems = typeof value === "string"
    ? value.split(/[\n,、]+/)
    : Array.isArray(value)
      ? value
      : value
        ? [value]
        : [];
  const seen = new Set();
  const words = [];
  rawItems.forEach((item) => {
    const word = String(item ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
    const key = word.toLocaleLowerCase();
    if (word && !seen.has(key)) {
      seen.add(key);
      words.push(word);
    }
  });
  return words.slice(0, 100);
}

function normalizeGuardModerationFeatureSettings(featureId, settings) {
  const defaults = GUARD_MODERATION_DEFAULTS[featureId] ?? {
    enabled: true,
    level: "medium",
    action: "delete",
    log_channel_id: "",
    log_channel_ids: [],
    target_channel_ids: [],
    all_channels_enabled: true,
  };
  const rawLogChannelRows = Array.isArray(settings?.log_channel_ids)
    ? settings.log_channel_ids
    : settings?.log_channel_id
      ? [settings.log_channel_id]
      : defaults.log_channel_ids;
  const logChannelIds = normalizeGuardModerationChannelRows(rawLogChannelRows);
  const firstLogChannelId = logChannelIds.find((item) => item) ?? "";
  const targetChannelIds = GUARD_MODERATION_TEXT_FILTER_FEATURE_IDS.has(featureId)
    ? normalizeGuardModerationChannelIds(settings?.target_channel_ids ?? settings?.ignored_channel_ids ?? settings?.disabled_channel_ids ?? defaults.target_channel_ids)
    : [];
  const level = GUARD_MODERATION_TEXT_FILTER_FEATURE_IDS.has(featureId)
    ? defaults.level
    : normalizeGuardModerationLevel(settings?.level ?? defaults.level);
  return {
    enabled: settings?.enabled !== false,
    level,
    action: normalizeGuardModerationAction(settings?.action, defaults.action),
    log_channel_id: firstLogChannelId,
    log_channel_ids: logChannelIds,
    target_channel_ids: targetChannelIds,
    ignored_channel_ids: targetChannelIds,
    all_channels_enabled: true,
    ng_words: GUARD_MODERATION_NG_WORD_FEATURE_IDS.has(featureId)
      ? normalizeGuardModerationWords(settings?.ng_words ?? settings?.words ?? defaults.ng_words)
      : [],
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
  const pageTitle =
    feature.id === "admin"
      ? "BOT詳細"
      : selectedGuild?.name ?? (guardConfigurableGuilds().length ? "サーバーを選択" : "設定可能なサーバーなし");
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
  const features = visibleGuardFeatures();
  return features.find((feature) => feature.id === state.guard.activeFeature) ?? features[0] ?? GUARD_FEATURES[0];
}

function renderGuardFeatureContent(feature) {
  if (feature?.id === "admin") {
    return renderGuardHostAdminPanel();
  }
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
        ${visibleGuardFeatures().map(renderGuardFunctionNavItem).join("")}
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
  const features = visibleGuardFeatures();
  return `
    <section class="settings-panel guard-feature-index" aria-label="Guard機能一覧">
      <div class="settings-panel__header">
        <div class="panel-heading">${icon("shield")}<h2>機能一覧</h2></div>
        <span class="feature-status feature-status--on">${features.length}件</span>
      </div>
      <div class="guard-feature-index__list">
        ${features.map((feature) => `
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
        ${icon("shield")}<span>連投リンク、招待リンク、連続投稿、絵文字スパム、連続メンションはペースと処置を設定します。暴言と下ネタは処罰と検知しないチャンネル、NGワードは追加語句と処罰を設定します。</span>
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
  const isPaceFeature = GUARD_MODERATION_PACE_FEATURE_IDS.has(feature.id);
  const isTextFilterFeature = GUARD_MODERATION_TEXT_FILTER_FEATURE_IDS.has(feature.id);
  const isNgWordFeature = GUARD_MODERATION_NG_WORD_FEATURE_IDS.has(feature.id);
  const statusText = !normalized.enabled
    ? "無効"
    : isTextFilterFeature
      ? normalized.target_channel_ids.length
        ? `除外 ${normalized.target_channel_ids.length}`
        : "除外なし"
      : isNgWordFeature
        ? `NG ${normalized.ng_words.length}`
      : "有効";
  const featureIcon = feature.id === "other_links"
    ? "link"
    : feature.id === "spam" || feature.id === "mention_spam"
      ? "message"
      : "shield";
  return `
    <article class="feature-card guard-moderation-card">
      <div class="feature-card__header">
        <div class="panel-heading">${icon(featureIcon)}<h2>${escapeHtml(feature.label)}</h2></div>
        <span class="feature-status ${normalized.enabled ? "feature-status--on" : ""}">${escapeHtml(statusText)}</span>
      </div>
      <p class="guard-moderation-card__description">${escapeHtml(feature.description)}</p>
      <div class="settings-grid guard-moderation-card__fields">
        <label class="toggle-row guard-verification-toggle">
          <input type="checkbox" data-guard-moderation-feature="${escapeAttribute(feature.id)}" data-guard-moderation-field="enabled" ${normalized.enabled ? "checked" : ""} />
          <span>この検知を有効にする</span>
        </label>
        ${isPaceFeature ? `
          <label class="field">
            <span>検知ペース</span>
            <select data-guard-moderation-feature="${escapeAttribute(feature.id)}" data-guard-moderation-field="level">
              ${GUARD_MODERATION_LEVELS.map((level) => `<option value="${escapeAttribute(level.id)}" ${level.id === normalized.level ? "selected" : ""}>${escapeHtml(level.label)}</option>`).join("")}
            </select>
          </label>
        ` : ""}
        <label class="field">
          <span>処罰内容</span>
          <select data-guard-moderation-feature="${escapeAttribute(feature.id)}" data-guard-moderation-field="action">
            ${GUARD_MODERATION_ACTIONS.map((action) => `<option value="${escapeAttribute(action.id)}" ${action.id === normalized.action ? "selected" : ""}>${escapeHtml(action.label)}</option>`).join("")}
          </select>
        </label>
        ${isTextFilterFeature ? renderGuardModerationTargetChannelsFieldAdditive(feature.id, normalized.target_channel_ids, guild) : ""}
        ${isNgWordFeature ? renderGuardModerationNgWordsField(feature.id, normalized.ng_words) : ""}
      </div>
    </article>
  `;
}

function renderGuardModerationNgWordsField(featureId, words) {
  const normalizedWords = normalizeGuardModerationWords(words);
  return `
    <div class="field guard-moderation-channel-field">
      <span>NGワード</span>
      <div class="guard-moderation-add-list auto-rules">
        <div class="auto-rules__header">
          <input type="text" data-guard-moderation-ng-word-input="${escapeAttribute(featureId)}" placeholder="追加するNGワード" />
          <button class="icon-button icon-button--ghost" type="button" data-action="add-guard-moderation-ng-word" data-guard-moderation-feature="${escapeAttribute(featureId)}">
            ${icon("plus")}<span>追加</span>
          </button>
        </div>
      </div>
      <div class="guard-moderation-channel-list" role="list">
        ${normalizedWords.length
          ? normalizedWords.map((word) => `
            <button class="guard-moderation-channel-chip" type="button" data-action="remove-guard-moderation-ng-word" data-guard-moderation-feature="${escapeAttribute(featureId)}" data-ng-word="${escapeAttribute(word)}" title="NGワードから外す">
              <span>${escapeHtml(word)}</span>${icon("trash")}
            </button>
          `).join("")
          : `<span class="guard-moderation-channel-empty">まだ追加されていません</span>`}
      </div>
      <small>追加した語句を含むメッセージを検知します。複数まとめて追加する場合は改行またはカンマで区切れます。</small>
    </div>
  `;
}

function renderGuardModerationTargetChannelsField(featureId, selectedValues, guild) {
  const channels = guild?.text_channels ?? [];
  const label = "検知しないチャンネル";
  const selectedIds = new Set(normalizeGuardModerationChannelIds(selectedValues));
  if (!channels.length) {
    const optionText = selectedIds.size ? `保存済み: ${[...selectedIds].join(", ")}` : "Guard APIに接続すると選択できます";
    return `
      <label class="field guard-moderation-channel-field">
        <span>${escapeHtml(label)}</span>
        <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="target_channel_ids" multiple disabled>
          <option value="">${escapeHtml(optionText)}</option>
        </select>
        <small>追加したチャンネルでは、この機能の検知を行いません。</small>
      </label>
    `;
  }
  return `
    <label class="field guard-moderation-channel-field">
      <span>${escapeHtml(label)}</span>
      <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="target_channel_ids" multiple size="${Math.min(Math.max(channels.length, 3), 6)}">
        ${channels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${selectedIds.has(channel.id) ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
      </select>
      <small>追加したチャンネルでは、この機能の検知を行いません。</small>
    </label>
  `;
}

function renderGuardModerationTargetChannelsFieldAdditive(featureId, selectedValues, guild) {
  const channels = guild?.text_channels ?? [];
  const label = "検知しないチャンネル";
  const selectedIds = new Set(normalizeGuardModerationChannelIds(selectedValues));
  if (!channels.length) {
    const optionText = selectedIds.size ? `保存済み: ${[...selectedIds].join(", ")}` : "Guard APIに接続すると選択できます";
    return `
      <label class="field guard-moderation-channel-field">
        <span>${escapeHtml(label)}</span>
        <select data-guard-moderation-feature="${escapeAttribute(featureId)}" data-guard-moderation-field="target_channel_ids_add" disabled>
          <option value="">${escapeHtml(optionText)}</option>
        </select>
        <small>追加したチャンネルでは、この機能の検知を行いません。</small>
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
            <button class="guard-moderation-channel-chip" type="button" data-action="remove-guard-moderation-channel" data-guard-moderation-feature="${escapeAttribute(featureId)}" data-channel-id="${escapeAttribute(channel.id)}" title="除外から外す">
              <span>${escapeHtml(channel.label)}</span>${icon("trash")}
            </button>
          `).join("")
          : `<span class="guard-moderation-channel-empty">まだ追加されていません</span>`}
      </div>
      <small>追加したチャンネルでは、この機能の検知を行いません。チャンネルは選ぶたびに追加されます。</small>
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
        ${icon("activity")}<span>参加、BAN、招待、ロール、チャンネル、VC入退室・移動・状態変更、メッセージなどのログ送信先をイベントごとに設定します。</span>
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
  if (field === "log_channel_ids") {
    const index = Number(target.dataset.index);
    if (!Number.isInteger(index) || index < 0) {
      return;
    }
    const logChannelIds = [...currentFeature.log_channel_ids];
    logChannelIds[index] = String(target.value ?? "").trim();
    form.features[featureId] = normalizeGuardModerationFeatureSettings(featureId, {
      ...currentFeature,
      log_channel_ids: logChannelIds,
    });
    state.guard.moderationForm = form;
    state.guard.moderationError = null;
    updateDirtyState("guardModeration");
    if (options.renderAfter) {
      render();
    }
    return;
  }
  if (field === "target_channel_ids_add") {
    const channelId = String(target.value ?? "").trim();
    if (!channelId) {
      return;
    }
    form.features[featureId] = normalizeGuardModerationFeatureSettings(featureId, {
      ...currentFeature,
      all_channels_enabled: true,
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
    ...(field === "target_channel_ids" ? { all_channels_enabled: true } : {}),
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

function addGuardModerationNgWord(featureId) {
  if (!GUARD_MODERATION_NG_WORD_FEATURE_IDS.has(featureId)) {
    return;
  }
  const input = document.querySelector(`[data-guard-moderation-ng-word-input="${CSS.escape(featureId)}"]`);
  const additions = normalizeGuardModerationWords(input instanceof HTMLInputElement ? input.value : "");
  if (!additions.length) {
    return;
  }
  const form = normalizeGuardModerationForm(state.guard.moderationForm);
  const currentFeature = normalizeGuardModerationFeatureSettings(featureId, form.features[featureId]);
  form.features[featureId] = normalizeGuardModerationFeatureSettings(featureId, {
    ...currentFeature,
    ng_words: normalizeGuardModerationWords([...currentFeature.ng_words, ...additions]),
  });
  if (input instanceof HTMLInputElement) {
    input.value = "";
  }
  state.guard.moderationForm = form;
  state.guard.moderationError = null;
  updateDirtyState("guardModeration");
  render();
}

function removeGuardModerationNgWord(featureId, word) {
  if (!GUARD_MODERATION_NG_WORD_FEATURE_IDS.has(featureId)) {
    return;
  }
  const normalizedWord = String(word ?? "").trim();
  if (!normalizedWord) {
    return;
  }
  const form = normalizeGuardModerationForm(state.guard.moderationForm);
  const currentFeature = normalizeGuardModerationFeatureSettings(featureId, form.features[featureId]);
  form.features[featureId] = normalizeGuardModerationFeatureSettings(featureId, {
    ...currentFeature,
    ng_words: currentFeature.ng_words.filter((item) => item !== normalizedWord),
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
  const activePanelTab = normalizedUserPanelTab();
  return `
    <section class="settings-panel user-page" aria-label="ユーザーページ">
      <div class="settings-panel__header">
        <div class="panel-heading">
          ${icon("user")}<h2>ユーザーページ</h2>
        </div>
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
      ${renderUserPanelTabs(activePanelTab, playlist)}
      <div class="user-page__tab-panel" role="tabpanel" id="user-panel-${escapeAttribute(activePanelTab)}" aria-labelledby="user-panel-tab-${escapeAttribute(activePanelTab)}">
        ${activePanelTab === "activity" ? renderUserActivityPanel() : renderPlaylistPanel(playlist)}
      </div>
    </section>
  `;
}

function normalizedUserPanelTab() {
  return USER_PANEL_TABS.some((tab) => tab.id === state.activeUserPanelTab)
    ? state.activeUserPanelTab
    : "playlist";
}

function renderUserPanelTabs(activePanelTab, playlist) {
  const tracks = playlist.tracks ?? [];
  const period = normalizedActivityPeriod();
  const activitySummary = activityPeriodMeta(period).summary;
  return `
    <div class="user-panel-tabs" role="tablist" aria-label="ユーザーページ表示">
      ${USER_PANEL_TABS.map((tab) => {
        const selected = activePanelTab === tab.id;
        const meta = tab.id === "playlist" ? `${tracks.length}曲` : activitySummary;
        return `
          <button
            id="user-panel-tab-${escapeAttribute(tab.id)}"
            class="user-panel-tab ${selected ? "user-panel-tab--active" : ""}"
            type="button"
            role="tab"
            aria-selected="${selected}"
            aria-controls="user-panel-${escapeAttribute(tab.id)}"
            data-user-panel-tab="${escapeAttribute(tab.id)}"
          >
            ${icon(tab.icon)}
            <span>${escapeHtml(tab.label)}</span>
            <strong>${escapeHtml(meta)}</strong>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderSupportInquiryDialog() {
  if (!state.user || !state.support.open) {
    return "";
  }
  const support = state.support;
  const product = normalizeSupportProduct(support.product);
  const requirement = normalizeSupportRequirement(support.requirement);
  const otherReady = requirement !== "other" || Boolean(support.requirementOther.trim());
  const canSubmit = Boolean(product && requirement && otherReady);
  const progress = supportProgress();
  return `
    <div class="support-dialog-backdrop" data-support-backdrop>
      <section class="support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-dialog-title">
        <div class="support-dialog__header">
          <div class="panel-heading">
            ${icon("message")}<h2 id="support-dialog-title">開発者への問い合わせ</h2>
          </div>
          <button class="support-dialog__close" type="button" data-action="close-support-inquiry" title="閉じる" aria-label="閉じる">
            ${icon("error")}
          </button>
        </div>
        <div class="support-dialog__progress" aria-label="入力進捗">
          <span data-support-progress-label>${escapeHtml(`${progress.done}/${progress.total}`)}</span>
          <div><i data-support-progress-bar style="width: ${escapeAttribute(progress.percent)}%"></i></div>
        </div>
        ${support.error ? `<p class="status-banner status-banner--error">${icon("alert")}<span>${escapeHtml(support.error)}</span></p>` : ""}
        ${support.success ? renderSupportSuccess(support.success) : ""}
        <form class="support-survey" data-support-form>
          ${renderSupportQuestion(
            "01",
            "問い合わせ先",
            `<div class="support-choice-grid support-choice-grid--products">
              ${SUPPORT_PRODUCTS.map((item) => renderSupportChoice({
                field: "product",
                value: item.id,
                label: `${item.label}の問い合わせ`,
                checked: product === item.id,
                disabled: support.sending,
              })).join("")}
            </div>`,
          )}
          ${renderSupportQuestion(
            "02",
            "要件",
            `<div class="support-choice-grid">
              ${SUPPORT_REQUIREMENTS.map((item) => renderSupportChoice({
                field: "requirement",
                value: item.id,
                label: item.label,
                checked: requirement === item.id,
                disabled: support.sending,
              })).join("")}
            </div>
            ${supportRequiresOther() ? renderSupportOtherRequirementField(support) : ""}`,
          )}
          ${renderSupportQuestion(
            "03",
            "メッセージ",
            `<label class="field support-message-field">
              <textarea maxlength="${SUPPORT_MESSAGE_MAX_LENGTH}" rows="7" data-support-field="message" required placeholder="困っている内容、再現手順、希望する対応など" ${support.sending ? "disabled" : ""}>${escapeHtml(support.message)}</textarea>
            </label>`,
          )}
          <div class="support-form__footer">
            <span data-support-counter>${escapeHtml(supportMessageCounter())}</span>
            <button class="icon-button icon-button--primary" type="submit" ${!canSubmit || support.sending ? "disabled" : ""}>
              ${icon("message")}<span>${support.sending ? "送信中" : "問い合わせを送信"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderSupportSuccess(message) {
  return `
    <div class="support-success">
      ${icon("success")}
      <span>${escapeHtml(message)}</span>
      <button class="icon-button icon-button--ghost" type="button" data-action="reset-support-inquiry">
        ${icon("plus")}<span>別の問い合わせ</span>
      </button>
    </div>
  `;
}

function renderSupportQuestion(number, title, body) {
  return `
    <section class="support-question">
      <div class="support-question__header">
        <span>${escapeHtml(number)}</span>
        <h3>${escapeHtml(title)}</h3>
      </div>
      <div class="support-question__body">
        ${body}
      </div>
    </section>
  `;
}

function renderSupportOtherRequirementField(support) {
  return `
    <label class="field support-other-field">
      <span>その他の要件</span>
      <input type="text" maxlength="120" value="${escapeAttribute(support.requirementOther)}" data-support-field="requirement_other" placeholder="要件を入力" required ${support.sending ? "disabled" : ""} />
    </label>
  `;
}

function renderSupportChoice({ field, value, label, checked, disabled }) {
  const inputId = `support-${field}-${value}`;
  return `
    <label class="support-choice ${checked ? "support-choice--selected" : ""}" for="${escapeAttribute(inputId)}">
      <input id="${escapeAttribute(inputId)}" type="radio" name="support-${escapeAttribute(field)}" value="${escapeAttribute(value)}" data-support-field="${escapeAttribute(field)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
      <span>${escapeHtml(label)}</span>
      ${checked ? icon("success") : ""}
    </label>
  `;
}

function supportProgress() {
  const product = normalizeSupportProduct(state.support.product);
  const requirement = normalizeSupportRequirement(state.support.requirement);
  const otherReady = requirement !== "other" || Boolean(state.support.requirementOther.trim());
  const steps = [
    Boolean(product),
    Boolean(requirement && otherReady),
    Boolean(state.support.message.trim()),
  ];
  const done = steps.filter(Boolean).length;
  return {
    done,
    total: steps.length,
    percent: String(Math.round((done / steps.length) * 100)),
  };
}

function comparableBumpRankSettings(settings) {
  const normalized = normalizeBumpRankSettings(settings);
  const sourcesChanged = !sameStringList(normalized.active_ranking_sources, DEFAULT_ACTIVE_RANKING_SOURCES);
  const hasAnyValue = Boolean(
    normalized.channel_id
      || normalized.role_id
      || normalized.ranking_channel_id
      || normalized.reset_interval !== "none"
      || sourcesChanged,
  );
  if (!hasAnyValue) {
    return null;
  }
  return {
    channel_id: normalizeNullableString(normalized.channel_id),
    role_id: normalizeNullableString(normalized.role_id),
    reset_interval: normalized.reset_interval,
    ranking_channel_id: normalizeNullableString(normalized.ranking_channel_id),
    active_ranking_sources: normalized.active_ranking_sources,
  };
}

function supportMessageCounter() {
  return `${state.support.message.length}/${SUPPORT_MESSAGE_MAX_LENGTH}`;
}

function renderUserActivityPanel() {
  const activity = normalizeUserActivity(state.userActivity);
  const period = normalizedActivityPeriod();
  const periodMeta = activityPeriodMeta(period);
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
      <div class="activity-range-summary">
        <strong>${escapeHtml(periodMeta.summary)}</strong>
        <span>${escapeHtml(activityRangeLabel(points))}</span>
      </div>
      <div class="activity-metric-grid">
        ${renderActivityMetricCard("VC接続時間", formatActivityDuration(totals.vc_seconds), "vc_seconds", points, "activity-line--vc")}
        ${renderActivityMetricCard("送信メッセージ数", formatCompactNumber(totals.message_count), "message_count", points, "activity-line--messages")}
        ${renderActivityMetricCard("送信文字数", formatCompactNumber(totals.character_count), "character_count", points, "activity-line--characters")}
      </div>
    </section>
  `;
}

function normalizedActivityPeriod() {
  return ACTIVITY_PERIODS.some((item) => item.id === state.activeActivityPeriod)
    ? state.activeActivityPeriod
    : "daily";
}

function activityPeriodMeta(period) {
  return ACTIVITY_PERIODS.find((item) => item.id === period) ?? ACTIVITY_PERIODS[0];
}

function activityRangeLabel(points) {
  if (!points.length) {
    return "記録なし";
  }
  const first = points[0];
  const latest = points.at(-1);
  const firstLabel = first.label || first.start_date || "--";
  const latestLabel = latest?.label || latest?.end_date || "--";
  return firstLabel === latestLabel ? latestLabel : `${firstLabel} - ${latestLabel}`;
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
      <div class="feature-card__header playlist-panel__header">
        <div class="panel-heading">
          ${icon("music")}<h2>プレイリスト</h2>
        </div>
        <div class="feature-card__actions">
          <span class="feature-status ${tracks.length ? "feature-status--on" : ""}">${tracks.length}曲</span>
          <button class="icon-button icon-button--ghost" type="button" data-action="playlist-refresh" ${state.playlistLoading ? "disabled" : ""}>
            ${icon("refresh")}<span>${state.playlistLoading ? "更新中" : "更新"}</span>
          </button>
        </div>
      </div>
      ${renderPlaylistSpotlight(tracks)}
      <form class="playlist-url-form" data-playlist-url-form>
        <label class="field playlist-url-form__field">
          <span>曲名または音楽サービスURL</span>
          <input type="text" value="${escapeAttribute(state.playlistUrl)}" placeholder="曲名 / Spotify・Apple Music・Amazon Music・SoundCloud URL" data-playlist-field="url" ${state.playlistSaving || state.playlistSearchLoading ? "disabled" : ""} />
        </label>
        <button class="icon-button icon-button--primary" type="submit" ${state.playlistSaving || state.playlistSearchLoading ? "disabled" : ""}>
          ${icon(isHttpUrl(state.playlistUrl) ? "link" : "search")}<span>${state.playlistSaving ? "登録中" : state.playlistSearchLoading ? "検索中" : "検索 / 登録"}</span>
        </button>
      </form>
      ${renderPlaylistSearchResults()}
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
            : `<div class="empty-state">登録曲はまだありません。曲名検索、音楽サービスURL、mp3アップロードで追加できます。</div>`
        }
      </div>
    </section>
  `;
}

function renderPlaylistSearchResults() {
  const results = state.playlistSearchResults ?? [];
  if (state.playlistSearchLoading) {
    return `<div class="playlist-search-results"><div class="empty-state">曲名から候補を検索しています。</div></div>`;
  }
  if (!results.length) {
    return "";
  }
  return `
    <div class="playlist-search-results" aria-live="polite">
      <div class="playlist-search-results__header">
        <span>検索結果</span>
        <strong>${escapeHtml(state.playlistSearchQuery || "曲名検索")}</strong>
      </div>
      <div class="playlist-search-results__list">
        ${results.map(renderPlaylistSearchResult).join("")}
      </div>
    </div>
  `;
}

function renderPlaylistSearchResult(result) {
  const escapedUrl = escapeAttribute(result.webpage_url);
  const escapedTitle = escapeAttribute(result.title);
  return `
    <article class="playlist-search-result">
      <div class="playlist-search-result__thumb" aria-hidden="true">
        ${result.thumbnail ? `<img src="${escapeAttribute(result.thumbnail)}" alt="" />` : icon("music")}
      </div>
      <div class="playlist-search-result__body">
        <strong>${escapeHtml(result.title)}</strong>
        <span>${escapeHtml(result.source_label)} / ${escapeHtml(formatDuration(result.duration))}</span>
      </div>
      <button class="icon-button icon-button--ghost playlist-search-result__add" type="button" data-action="playlist-add-search-result" data-track-url="${escapedUrl}" title="${escapedTitle}を追加" ${state.playlistSaving ? "disabled" : ""}>
        ${icon("plus")}<span>追加</span>
      </button>
    </article>
  `;
}

function renderPlaylistSpotlight(tracks) {
  const latestTrack = tracks.at(-1);
  return `
    <div class="playlist-spotlight">
      <div class="playlist-spotlight__record" aria-hidden="true">
        ${icon("music")}
      </div>
      <div class="playlist-spotlight__copy">
        <span>Discat One Playlist</span>
        <strong>曲名検索もサービスURLも、すぐ再生できる曲リストに</strong>
        <p>${escapeHtml(latestTrack ? `最新: ${latestTrack.title}` : "曲名検索、SpotifyなどのURL、mp3を追加すると、ここに自分の曲が並びます。")}</p>
        <div class="playlist-spotlight__chips" aria-label="対応している登録方法">
          <span>${icon("search")}曲名検索</span>
          <span>${icon("link")}Spotify / Apple</span>
          <span>${icon("link")}Amazon / SoundCloud</span>
          <span>${icon("upload")}mp3対応</span>
        </div>
      </div>
      <div class="playlist-spotlight__stat">
        <strong>${escapeHtml(String(tracks.length))}</strong>
        <span>登録曲</span>
      </div>
    </div>
  `;
}

function renderPlaylistTrack(track, options = {}) {
  const sourceLabel = track.source_type === "upload" ? "mp3アップロード" : "URL";
  const readonly = Boolean(options.readonly);
  const ownerUserId = normalizeNullableString(options.ownerUserId);
  const escapedTrackId = escapeAttribute(track.id);
  const escapedTitle = escapeAttribute(track.title);
  const previewDuration = playlistPreviewDuration(track.duration);
  const previewUrl = playlistPreviewUrl(track.id, ownerUserId);
  const rowClass = `playlist-track-row${readonly ? " playlist-track-row--readonly" : ""}`;
  return `
    <article class="${rowClass}">
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
          <audio class="playlist-player__audio" preload="none" data-preview-src="${escapeAttribute(previewUrl)}" data-track-audio data-track-id="${escapedTrackId}"></audio>
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
      ${
        readonly
          ? ""
          : `<button class="icon-button icon-button--ghost playlist-track-row__remove" type="button" data-action="playlist-delete-track" data-track-id="${escapedTrackId}" title="削除" ${state.playlistSaving ? "disabled" : ""}>
              ${icon("trash")}
            </button>`
      }
    </article>
  `;
}

function playlistPreviewUrl(trackId, ownerUserId = null) {
  const token = getAuthToken();
  const query = token ? `?session_token=${encodeURIComponent(token)}` : "";
  const encodedTrackId = encodeURIComponent(trackId);
  const path = ownerUserId
    ? `/playlist/admin/users/${encodeURIComponent(ownerUserId)}/tracks/${encodedTrackId}/preview`
    : `/playlist/tracks/${encodedTrackId}/preview`;
  return `${API_BASE_URL}${path}${query}`;
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
  ensurePlaylistAudioSource(audio);
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

function ensurePlaylistAudioSource(audio) {
  if (audio.getAttribute("src") || !audio.dataset.previewSrc) {
    return;
  }
  audio.src = audio.dataset.previewSrc;
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

  ensurePlaylistAudioSource(audio);
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
  const voices = state.ttsOptions?.voices?.[TTS_ENGINE_FIXED] ?? [];
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
  const categories = state.ttsOptions?.categories ?? [];
  const roles = state.ttsOptions?.roles ?? [];
  const dirty = isViewDirty("features");
  const page = activeSettingsPage();
  const content = {
    "welcome-message": () => renderWelcomeMessageSettings(textChannels),
    "sticky-message": () => renderStickyMessageSettings(textChannels),
    "vc-notification": () => renderVcNotificationSettings(textChannels, roles),
    "ticket": () => renderTicketSettings(categories, textChannels, roles),
    "server-rank": () => renderServerRankSettings(textChannels),
    "bump-rank": () => renderBumpRankSettings(textChannels, roles),
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
  const enabled = Boolean(settings.reaction_channel_id && settings.notification_channel_id && settings.role_id);
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
        <div class="field feature-summary feature-summary--wide">
          <span>現在の設定</span>
          <strong>${formatVcNotificationSummary(selectedReactionChannel, selectedNotificationChannel, selectedRole, settings)}</strong>
        </div>
      </div>
      <div class="settings-panel__footer">
        ${icon("bell")}<span>リアクションは${escapeHtml(VC_NOTIFICATION_REACTION_EMOJI)}固定です。案内メッセージが未作成の場合は保存時に自動作成します。</span>
      </div>
      <div class="feature-card__actions">
        <button class="icon-button icon-button--ghost" type="button" data-action="clear-vc-notification">
          ${icon("trash")}<span>VC通知を解除</span>
        </button>
      </div>
    </section>
  `;
}

function renderTicketSettings(categories, textChannels, roles) {
  const settings = normalizeTicketSettings(state.featureSettings.ticket);
  const category = categories.find((item) => item.id === settings.category_id);
  const staffRole = roles.find((role) => role.id === settings.staff_role_id);
  const logChannel = textChannels.find((channel) => channel.id === settings.log_channel_id);
  const panelChannel = textChannels.find((channel) => channel.id === settings.panel_channel_id);
  const enabled = Boolean(settings.category_id && settings.staff_role_id && settings.panel_channel_id);
  const optionsLoading = selectedGuildCanConfigure() && !state.ttsOptions;
  const cooldownMinutes = Math.max(1, Math.round(settings.staff_call_cooldown_seconds / 60));
  const panelMessageUrl =
    state.selectedGuildId && settings.panel_channel_id && settings.panel_message_id
      ? `https://discord.com/channels/${encodeURIComponent(state.selectedGuildId)}/${encodeURIComponent(settings.panel_channel_id)}/${encodeURIComponent(settings.panel_message_id)}`
      : "";
  const publishDisabled = state.ticketPanelPublishing || optionsLoading || !enabled || !selectedGuildCanConfigure();
  return `
    <section class="feature-card ticket-settings-card" aria-label="チケット設定">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("ticket")}<h2>チケット</h2>
        </div>
        <span class="feature-status ${enabled ? "feature-status--on" : ""}">
          ${enabled ? "設定済み" : "未設定"}
        </span>
      </div>
      <div class="settings-grid">
        <label class="field">
          <span>チケットカテゴリ</span>
          <select data-ticket-field="category_id" ${optionsLoading ? "disabled" : ""}>
            <option value="">未設定</option>
            ${categories.map((item) => `<option value="${escapeAttribute(item.id)}" ${item.id === settings.category_id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>スタッフロール</span>
          <select data-ticket-field="staff_role_id" ${optionsLoading ? "disabled" : ""}>
            <option value="">未設定</option>
            ${roles.map((role) => `<option value="${escapeAttribute(role.id)}" ${role.id === settings.staff_role_id ? "selected" : ""}>@${escapeHtml(role.name)}${role.managed ? "（管理ロール）" : ""}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>ログチャンネル</span>
          <select data-ticket-field="log_channel_id" ${optionsLoading ? "disabled" : ""}>
            <option value="">未設定</option>
            ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === settings.log_channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>パネル送信先</span>
          <select data-ticket-field="panel_channel_id" ${optionsLoading ? "disabled" : ""}>
            <option value="">未設定</option>
            ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === settings.panel_channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>パネルタイトル</span>
          <input type="text" maxlength="100" value="${escapeAttribute(settings.panel_title)}" data-ticket-field="panel_title" />
        </label>
        <label class="field">
          <span>スタッフ呼び出し間隔（分）</span>
          <input type="number" min="1" max="1440" step="1" value="${cooldownMinutes}" data-ticket-field="staff_call_cooldown_minutes" />
        </label>
        <label class="field switch-row">
          <span class="switch-row__label">作成者によるクローズ</span>
          <input type="checkbox" data-ticket-field="creator_can_close" ${settings.creator_can_close ? "checked" : ""} />
        </label>
        <div class="field ticket-description-field">
          <span>パネル説明</span>
          <textarea maxlength="1000" rows="4" data-ticket-field="panel_description">${escapeHtml(settings.panel_description)}</textarea>
        </div>
        <div class="field feature-summary feature-summary--wide">
          <span>現在の設定</span>
          <strong>${category ? escapeHtml(category.name) : "カテゴリ未設定"} / ${staffRole ? `@${escapeHtml(staffRole.name)}` : "スタッフ未設定"} / ${panelChannel ? `#${escapeHtml(panelChannel.name)}` : "パネル未設定"}</strong>
        </div>
        <div class="field feature-summary">
          <span>次の番号</span>
          <strong>#${String(settings.next_number).padStart(4, "0")}</strong>
        </div>
        <div class="field feature-summary">
          <span>ログ</span>
          <strong>${logChannel ? `#${escapeHtml(logChannel.name)}` : "未設定"}</strong>
        </div>
      </div>
      <div class="settings-panel__footer">
        ${icon("info")}<span>チケット作成、クローズ、スタッフ呼び出し、対応開始、ユーザー追加・削除はDiscord内のボタンで操作できます。</span>
      </div>
      <div class="feature-card__actions">
        ${
          panelMessageUrl
            ? `<a class="icon-button icon-button--ghost" href="${escapeAttribute(panelMessageUrl)}" target="_blank" rel="noopener">${icon("external")}<span>既存パネルを開く</span></a>`
            : ""
        }
        <button class="icon-button icon-button--primary" type="button" data-action="publish-ticket-panel" ${publishDisabled ? "disabled" : ""}>
          ${icon(state.ticketPanelPublishing ? "refresh" : "ticket")}<span>${state.ticketPanelPublishing ? "送信中" : "パネルを送信"}</span>
        </button>
      </div>
    </section>
  `;
}

function renderBumpRankSettings(textChannels, roles) {
  const settings = normalizeBumpRankSettings(state.featureSettings.bump_rank);
  const selectedChannel = textChannels.find((channel) => channel.id === settings.channel_id);
  const selectedRole = roles.find((role) => role.id === settings.role_id);
  const enabled = Boolean(settings.channel_id && settings.role_id);
  return `
    <section class="feature-card" aria-label="Bump/Upランク">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("activity")}<h2>Bump/Upランク</h2>
        </div>
        <span class="feature-status ${enabled ? "feature-status--on" : ""}">
          ${enabled ? "有効" : "未設定"}
        </span>
      </div>
      <div class="settings-grid">
        <label class="field">
          <span>再通知チャンネル</span>
          <select data-bump-rank-field="channel_id" ${selectedGuildCanConfigure() && !state.ttsOptions ? "disabled" : ""}>
            <option value="">未設定</option>
            ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === settings.channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>メンションロール</span>
          <select data-bump-rank-field="role_id" ${selectedGuildCanConfigure() && !state.ttsOptions ? "disabled" : ""}>
            <option value="">未設定</option>
            ${roles.map((role) => `<option value="${escapeAttribute(role.id)}" ${role.id === settings.role_id ? "selected" : ""}>@${escapeHtml(role.name)}${role.managed ? "（管理ロール）" : ""}</option>`).join("")}
          </select>
        </label>
        <div class="field feature-summary feature-summary--wide bump-rank-summary">
          <span>現在の設定</span>
          ${renderBumpRankSummary(selectedChannel, selectedRole)}
        </div>
        <div class="field feature-summary">
          <span>次回Bump</span>
          <strong>${escapeHtml(settings.next_bump_at ? formatDateTime(settings.next_bump_at) : "未検知")}</strong>
        </div>
      </div>
      <div class="settings-panel__footer">
        ${icon("info")}<span>DISBOARDの/bumpとディス速の/up成功を検知すると2時間後に再通知します。サーバーアクティブランキングの集計と定期送信はサーバーランクで設定します。</span>
      </div>
      <div class="feature-card__actions">
        <button class="icon-button icon-button--ghost" type="button" data-action="clear-bump-rank">
          ${icon("trash")}<span>Bump/Up通知を解除</span>
        </button>
      </div>
    </section>
  `;
}

function renderServerRankSettings(textChannels) {
  const settings = normalizeBumpRankSettings(state.featureSettings.bump_rank);
  const selectedSources = normalizeActiveRankingSources(settings.active_ranking_sources);
  const selectedRankingChannel = textChannels.find((channel) => channel.id === settings.ranking_channel_id);
  const resetEnabled = settings.reset_interval !== "none";
  return `
    <section class="feature-card server-rank-card" aria-label="サーバーランク">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("activity")}<h2>サーバーランク</h2>
        </div>
        <span class="feature-status ${selectedSources.length > 0 ? "feature-status--on" : ""}">
          ${selectedSources.length > 0 ? `${selectedSources.length}項目` : "加算なし"}
        </span>
      </div>
      <div class="settings-grid server-rank-settings-grid">
        ${renderActiveRankingSourceSettings(settings)}
        ${renderServerRankPointRules(settings)}
        <label class="field">
          <span>アクティブランクリセット周期</span>
          <select data-bump-rank-field="reset_interval" ${selectedGuildCanConfigure() && !state.ttsOptions ? "disabled" : ""}>
            ${BUMP_RANK_RESET_INTERVALS.map((interval) => `<option value="${escapeAttribute(interval.id)}" ${interval.id === settings.reset_interval ? "selected" : ""}>${escapeHtml(interval.label)}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>リセット時ランキング送信チャンネル</span>
          <select data-bump-rank-field="ranking_channel_id" ${!resetEnabled || (selectedGuildCanConfigure() && !state.ttsOptions) ? "disabled" : ""}>
            <option value="">未設定</option>
            ${textChannels.map((channel) => `<option value="${escapeAttribute(channel.id)}" ${channel.id === settings.ranking_channel_id ? "selected" : ""}>#${escapeHtml(channel.name)}</option>`).join("")}
          </select>
        </label>
        <div class="field feature-summary feature-summary--wide active-rank-schedule-summary">
          <span>リセット送信</span>
          ${renderActiveRankScheduleSummary(selectedRankingChannel, settings)}
        </div>
      </div>
      <div class="settings-panel__footer">
        ${icon("info")}<span>メッセージは1件1pt、テキストは100文字1pt、VCは1分1pt、BUMP/UPは獲得ポイント分をサーバーアクティブランキングへ加算します。</span>
      </div>
    </section>
    ${renderGuildRankingsPanel()}
  `;
}

function renderActiveRankingSourceSettings(settings) {
  const selectedSources = normalizeActiveRankingSources(settings.active_ranking_sources);
  const selected = new Set(selectedSources);
  return `
    <div class="field feature-summary feature-summary--wide active-ranking-settings">
      <span>サーバーアクティブランキングに加算</span>
      <div class="active-ranking-source-options">
        ${ACTIVE_RANKING_SOURCES.map((source) => `
          <label class="active-ranking-source ${selected.has(source.id) ? "active-ranking-source--selected" : ""}">
            <input type="checkbox" data-bump-rank-source="${escapeAttribute(source.id)}" ${selected.has(source.id) ? "checked" : ""} />
            <strong>${escapeHtml(source.label)}</strong>
            <small>${escapeHtml(source.metric)}</small>
          </label>
        `).join("")}
      </div>
    </div>
  `;
}

function renderServerRankPointRules(settings) {
  const selected = new Set(normalizeActiveRankingSources(settings.active_ranking_sources));
  return `
    <div class="field feature-summary feature-summary--wide server-rank-point-rules">
      <span>ポイント換算</span>
      <div class="server-rank-rule-grid">
        ${ACTIVE_RANKING_SOURCES.map((source) => `
          <div class="server-rank-rule ${selected.has(source.id) ? "server-rank-rule--active" : ""}">
            <strong>${escapeHtml(source.label)}</strong>
            <span>${escapeHtml(serverRankPointRuleText(source.id))}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function serverRankPointRuleText(source) {
  if (source === "text") {
    return "100文字 = 1pt";
  }
  if (source === "message") {
    return "1送信 = 1pt";
  }
  if (source === "vc") {
    return "1分 = 1pt";
  }
  if (source === "bump") {
    return "Bump/Up獲得pt";
  }
  return "";
}

function renderGuildRankingsPanel() {
  const rankings = normalizeGuildRankings(state.guildRankings);
  const period = normalizedRankingPeriod();
  const periodMeta = rankingPeriodMeta(period);
  const activeSources = normalizeActiveRankingSources(
    state.featureSettings?.bump_rank?.active_ranking_sources ?? rankings.active_sources,
  );
  const activeEntries = activeRankingEntriesForSources(rankings, activeSources);
  return `
    <section class="feature-card guild-ranking-panel" aria-label="サーバーアクティブランキング">
      <div class="feature-card__header">
        <div class="panel-heading">
          ${icon("activity")}<h2>サーバーアクティブランキング</h2>
        </div>
        <button class="icon-button icon-button--ghost" type="button" data-action="guild-ranking-refresh" ${state.guildRankingsLoading ? "disabled" : ""}>
          ${icon("refresh")}<span>${state.guildRankingsLoading ? "更新中" : "更新"}</span>
        </button>
      </div>
      <div class="activity-period-tabs activity-period-tabs--wide" role="tablist" aria-label="ランキング期間">
        ${RANKING_PERIODS.map((item) => `
          <button class="activity-period-tab ${period === item.id ? "activity-period-tab--active" : ""}" type="button" role="tab" aria-selected="${period === item.id}" data-ranking-period="${escapeAttribute(item.id)}">
            ${escapeHtml(item.label)}
          </button>
        `).join("")}
      </div>
      <div class="activity-range-summary">
        <strong>${escapeHtml(periodMeta.summary)}</strong>
        <span>${escapeHtml(rankingRangeLabel(rankings))}</span>
      </div>
      <div class="active-ranking-source-summary">
        ${activeSources.length > 0
          ? activeSources.map((source) => `<span>${escapeHtml(activeRankingSourceLabel(source))}</span>`).join("")
          : `<span>加算項目なし</span>`}
      </div>
      ${renderGuildRankingMetricSummary(rankings, activeEntries)}
      ${state.guildRankingsError ? `<div class="status-banner status-banner--error">${icon("alert")}<span>${escapeHtml(state.guildRankingsError)}</span></div>` : ""}
      <div class="guild-ranking-grid">
        ${renderRankingBoard("サーバーアクティブ", activeEntries, "active")}
        ${renderRankingBoard("文字数", rankings.text, "text")}
        ${renderRankingBoard("メッセージ", rankings.message, "message")}
        ${renderRankingBoard("VC", rankings.vc, "vc")}
        ${renderRankingBoard("BUMP/UP", rankings.bump, "bump")}
      </div>
    </section>
  `;
}

function renderGuildRankingMetricSummary(rankings, activeEntries) {
  const totals = guildRankingTotals(rankings, activeEntries);
  return `
    <div class="guild-ranking-metric-grid" aria-label="期間内訳">
      ${renderGuildRankingMetricCard("総合pt", `${formatCompactNumber(totals.points)} pt`, "加算対象の合計")}
      ${renderGuildRankingMetricCard("メッセージ", `${formatCompactNumber(totals.message_count)}件`, "期間内送信数")}
      ${renderGuildRankingMetricCard("テキスト", `${formatCompactNumber(totals.character_count)}文字`, "期間内文字数")}
      ${renderGuildRankingMetricCard("VC時間", formatActivityDuration(totals.vc_seconds), "期間内接続")}
      ${renderGuildRankingMetricCard("BUMP/UP", `${formatCompactNumber(totals.bump_count)}回 / ${formatCompactNumber(totals.bump_points)} pt`, "期間内実行")}
    </div>
  `;
}

function renderGuildRankingMetricCard(label, value, caption) {
  return `
    <div class="guild-ranking-metric-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(caption)}</small>
    </div>
  `;
}

function renderRankingBoard(title, entries, metric) {
  return `
    <section class="ranking-board" aria-label="${escapeAttribute(title)}ランキング">
      <div class="ranking-board__header">
        <span>${escapeHtml(title)}</span>
        <strong>${escapeHtml(`${entries.length}人`)}</strong>
      </div>
      <div class="ranking-board__list">
        ${entries.length > 0
          ? entries.slice(0, 20).map((entry) => renderRankingRow(entry, metric)).join("")
          : `<div class="empty-state">まだ記録がありません。</div>`}
      </div>
    </section>
  `;
}

function renderRankingRow(entry, metric) {
  return `
    <div class="ranking-row">
      <span class="ranking-row__rank">${escapeHtml(`#${entry.rank}`)}</span>
      <div class="ranking-row__user">
        <strong>${escapeHtml(rankingUserLabel(entry))}</strong>
        <small>${escapeHtml(formatRankingDetail(entry))}</small>
        ${renderRankingBreakdown(entry)}
      </div>
      <span class="ranking-row__value">${escapeHtml(formatRankingMetric(entry, metric))}</span>
    </div>
  `;
}

function renderRankingBreakdown(entry) {
  const chips = [
    ["メッセージ", `${formatCompactNumber(entry.message_count)}件`],
    ["文字", `${formatCompactNumber(entry.character_count)}文字`],
    ["VC", formatActivityDuration(entry.vc_seconds)],
    ["BUMP/UP", `${formatCompactNumber(entry.bump_count)}回`],
    ["BUMP pt", `${formatCompactNumber(entry.bump_points)}pt`],
  ];
  return `
    <div class="ranking-row__breakdown" aria-label="ランキング内訳">
      ${chips.map(([label, value]) => `
        <span class="ranking-row__chip">
          <small>${escapeHtml(label)}</small>
          <strong>${escapeHtml(value)}</strong>
        </span>
      `).join("")}
    </div>
  `;
}

function guildRankingTotals(rankings, activeEntries) {
  const mergedEntries = mergeGuildRankingEntries(rankings);
  return mergedEntries.reduce((totals, entry) => ({
    points: totals.points,
    message_count: totals.message_count + entry.message_count,
    character_count: totals.character_count + entry.character_count,
    vc_seconds: totals.vc_seconds + entry.vc_seconds,
    bump_count: totals.bump_count + entry.bump_count,
    bump_points: totals.bump_points + entry.bump_points,
  }), {
    points: activeEntries.reduce((total, entry) => total + entry.points, 0),
    message_count: 0,
    character_count: 0,
    vc_seconds: 0,
    bump_count: 0,
    bump_points: 0,
  });
}

function mergeGuildRankingEntries(rankings) {
  const entriesByUser = new Map();
  for (const entries of [rankings.active, rankings.text, rankings.message, rankings.vc, rankings.bump]) {
    for (const entry of entries) {
      const current = entriesByUser.get(entry.user_id) ?? {
        ...entry,
        points: 0,
        message_count: 0,
        character_count: 0,
        vc_seconds: 0,
        bump_count: 0,
        bump_points: 0,
      };
      entriesByUser.set(entry.user_id, {
        ...current,
        display_name: current.display_name || entry.display_name,
        message_count: Math.max(current.message_count, entry.message_count),
        character_count: Math.max(current.character_count, entry.character_count),
        vc_seconds: Math.max(current.vc_seconds, entry.vc_seconds),
        bump_count: Math.max(current.bump_count, entry.bump_count),
        bump_points: Math.max(current.bump_points, entry.bump_points),
      });
    }
  }
  return Array.from(entriesByUser.values());
}

function activeRankingEntriesForSources(rankings, sources) {
  const normalizedSources = normalizeActiveRankingSources(sources);
  if (sameStringList(normalizedSources, normalizeActiveRankingSources(rankings.active_sources))) {
    return rankings.active;
  }
  const entriesByUser = new Map();
  for (const entries of [rankings.text, rankings.message, rankings.vc, rankings.bump]) {
    for (const entry of entries) {
      const current = entriesByUser.get(entry.user_id) ?? {
        ...entry,
        points: 0,
        message_count: 0,
        character_count: 0,
        vc_seconds: 0,
        bump_count: 0,
        bump_points: 0,
      };
      entriesByUser.set(entry.user_id, {
        ...current,
        display_name: current.display_name || entry.display_name,
        message_count: Math.max(current.message_count, entry.message_count),
        character_count: Math.max(current.character_count, entry.character_count),
        vc_seconds: Math.max(current.vc_seconds, entry.vc_seconds),
        bump_count: Math.max(current.bump_count, entry.bump_count),
        bump_points: Math.max(current.bump_points, entry.bump_points),
      });
    }
  }
  return Array.from(entriesByUser.values())
    .map((entry) => ({
      ...entry,
      points: rankingPointsForSources(entry, normalizedSources),
    }))
    .filter((entry) => entry.points > 0)
    .sort(compareRankingEntries)
    .slice(0, 50)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function normalizedRankingPeriod() {
  return normalizeRankingPeriod(state.activeRankingPeriod);
}

function rankingPeriodMeta(period) {
  return RANKING_PERIODS.find((item) => item.id === period) ?? RANKING_PERIODS[0];
}

function rankingRangeLabel(rankings) {
  if (!rankings.start_date || !rankings.end_date) {
    return "期間データなし";
  }
  return rankings.start_date === rankings.end_date
    ? rankings.start_date
    : `${rankings.start_date} - ${rankings.end_date}`;
}

function activeRankingSourceLabel(source) {
  return ACTIVE_RANKING_SOURCES.find((item) => item.id === source)?.label ?? source;
}

function rankingUserLabel(entry) {
  return entry.display_name || `User ${entry.user_id}`;
}

function formatRankingMetric(entry, metric) {
  if (metric === "text") {
    return `${formatCompactNumber(entry.character_count)}文字`;
  }
  if (metric === "message") {
    return `${formatCompactNumber(entry.message_count)}件`;
  }
  if (metric === "vc") {
    return formatActivityDuration(entry.vc_seconds);
  }
  if (metric === "bump") {
    return `${formatCompactNumber(entry.bump_count)}回 / ${formatCompactNumber(entry.bump_points)}pt`;
  }
  return `${formatCompactNumber(entry.points)} pt`;
}

function rankingPointsForSources(entry, sources) {
  return sources.reduce((total, source) => {
    if (source === "text") {
      return total + Math.floor(entry.character_count / 100);
    }
    if (source === "message") {
      return total + entry.message_count;
    }
    if (source === "vc") {
      return total + (entry.vc_seconds > 0 ? Math.ceil(entry.vc_seconds / 60) : 0);
    }
    if (source === "bump") {
      return total + entry.bump_points;
    }
    return total;
  }, 0);
}

function compareRankingEntries(left, right) {
  return (
    right.points - left.points
    || right.message_count - left.message_count
    || right.character_count - left.character_count
    || right.vc_seconds - left.vc_seconds
    || right.bump_points - left.bump_points
    || right.bump_count - left.bump_count
    || left.user_id.localeCompare(right.user_id)
  );
}

function formatRankingDetail(entry) {
  return [
    `${formatCompactNumber(entry.message_count)}件`,
    `${formatCompactNumber(entry.character_count)}文字`,
    formatActivityDuration(entry.vc_seconds),
    `${formatCompactNumber(entry.bump_count)}回 BUMP/UP`,
    `${formatCompactNumber(entry.bump_points)}pt`,
  ].join(" / ");
}

function renderHostAdminPanel() {
  const status = state.hostStatus;
  const bot = status?.bot_status ?? null;
  const autoRefreshLabel = `自動更新 ${Math.round(HOST_REFRESH_INTERVAL_MS / 1000)}秒`;
  const refreshBusy = state.hostLoading || state.adminPlaylistsLoading;
  return `
    <section class="settings-panel host-admin" aria-label="BOT管理者用ページ">
      <div class="settings-panel__header">
        <div class="panel-heading">
          ${icon("activity")}<h2>BOT詳細</h2>
        </div>
        <div class="host-admin__toolbar">
          <span class="refresh-pill ${refreshBusy ? "refresh-pill--loading" : ""}">
            ${icon("radio")}<span>${escapeHtml(autoRefreshLabel)}</span><small>${escapeHtml(formatTimeOnly(state.hostLastUpdatedAt))}</small>
          </span>
          <button class="icon-button icon-button--primary" type="button" data-action="refresh-host" ${refreshBusy ? "disabled" : ""}>
            ${icon("refresh")}<span>${refreshBusy ? "更新中" : "今すぐ更新"}</span>
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
            ${renderAdminGuildAccessPanel({
              botLabel: "Discat One",
              guilds: bot?.guilds ?? [],
              inviteLinks: state.hostInviteLinks,
              inviteRunningId: state.hostInviteRunning,
              action: "create-host-guild-invite",
            })}
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
            ${renderAdminPlaylistsPanel()}
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

function renderGuardHostAdminPanel() {
  const status = state.guard.status;
  const user = status.user ?? null;
  const refreshBusy = state.guard.loading || Boolean(state.guard.adminInviteRunning);
  return `
    <section class="settings-panel host-admin" aria-label="Guard BOT管理者用ページ">
      <div class="settings-panel__header">
        <div class="panel-heading">
          ${icon("activity")}<h2>BOT詳細</h2>
        </div>
        <div class="host-admin__toolbar">
          <span class="refresh-pill ${refreshBusy ? "refresh-pill--loading" : ""}">
            ${icon("radio")}<span>自動更新 ${Math.round(GUARD_STATUS_REFRESH_INTERVAL_MS / 1000)}秒</span><small>${escapeHtml(formatTimeOnly(state.guard.loadedAt))}</small>
          </span>
          <button class="icon-button icon-button--primary" type="button" data-action="refresh-guard-admin" ${refreshBusy ? "disabled" : ""}>
            ${icon("refresh")}<span>${refreshBusy ? "更新中" : "今すぐ更新"}</span>
          </button>
        </div>
      </div>
      ${renderGuardApiNotice()}
      ${state.guard.adminError ? `<p class="status-banner status-banner--error">${icon("alert")}<span>${escapeHtml(state.guard.adminError)}</span></p>` : ""}
      ${state.guard.adminMessage ? `<p class="status-banner status-banner--success">${icon("success")}<span>${escapeHtml(state.guard.adminMessage)}</span></p>` : ""}
      <div class="host-metrics">
        ${renderMetricTile("BOT起動時間", formatDuration(status.uptime_seconds), formatDateTime(status.started_at), Boolean(status.online))}
        ${renderMetricTile("Discord Ping", status.latency_ms == null ? "測定中" : `${status.latency_ms}ms`, `${status.guild_count}サーバー / ${status.member_count}メンバー`, Boolean(status.online))}
        ${renderMetricTile("API接続", state.guard.source === "api" ? "接続中" : "未接続", state.guard.health?.api_contract_version || "未取得", state.guard.source === "api")}
        ${renderMetricTile("Security Log", status.security_log_enabled ? "有効" : "無効", status.security_log_path, status.security_log_enabled)}
      </div>
      ${renderAdminGuildAccessPanel({
        botLabel: "Discat Guard",
        guilds: status.guilds ?? [],
        inviteLinks: state.guard.adminInviteLinks,
        inviteRunningId: state.guard.adminInviteRunning,
        action: "create-guard-guild-invite",
      })}
      <div class="host-admin__grid">
        <section class="host-card">
          <div class="host-card__header">
            ${icon("bot")}<h3>BOTランタイム</h3>
          </div>
          ${renderDetailList([
            ["ユーザー", user?.name ?? "未取得"],
            ["BOT ID", user?.id ?? "未取得"],
            ["BOT PID", status.process_id ?? "未取得"],
            ["最終Ready", formatDateTime(status.last_ready_at)],
            ["最終更新", formatDateTime(status.status_updated_at)],
            ["コマンド", status.commands_enabled ? "有効" : "無効"],
          ])}
        </section>
        <section class="host-card">
          <div class="host-card__header">
            ${icon("shield")}<h3>Guard API</h3>
          </div>
          ${renderDetailList([
            ["API URL", state.guard.apiBase || "未設定"],
            ["API Contract", state.guard.health?.api_contract_version || "未取得"],
            ["接続元", state.guard.source],
            ["取得時刻", formatDateTime(state.guard.loadedAt)],
            ["認証設定", `${state.guard.verificationSettings.length}件`],
            ["荒らし対策設定", `${state.guard.moderationSettings.length}件`],
            ["ログ設定", `${state.guard.loggingSettings.length}件`],
          ])}
        </section>
      </div>
    </section>
  `;
}

function renderAdminGuildAccessPanel({ botLabel, guilds, inviteLinks, inviteRunningId, action }) {
  const normalizedGuilds = normalizeBotGuilds(guilds);
  const body = normalizedGuilds.length
    ? `<div class="admin-guild-list">${normalizedGuilds.map((guild) => renderAdminGuildRow(guild, { inviteLinks, inviteRunningId, action })).join("")}</div>`
    : `<div class="empty-state">${escapeHtml(botLabel)} が参加しているサーバーはまだ取得されていません。</div>`;
  return `
    <section class="host-card admin-guilds">
      <div class="host-card__header">
        ${icon("server")}<h3>参加サーバー</h3>
        <span class="feature-status ${normalizedGuilds.length ? "feature-status--on" : ""}">
          ${escapeHtml(`${normalizedGuilds.length}件`)}
        </span>
      </div>
      ${body}
    </section>
  `;
}

function renderAdminGuildRow(guild, { inviteLinks, inviteRunningId, action }) {
  const invite = inviteLinks?.[guild.id] ?? null;
  const running = inviteRunningId === guild.id;
  const memberLabel = guild.member_count == null ? "members unknown" : `${formatCompactNumber(guild.member_count)} members`;
  return `
    <article class="admin-guild-row">
      ${renderAdminGuildIcon(guild)}
      <div class="admin-guild-row__body">
        <strong>${escapeHtml(guild.name)}</strong>
        <small>${escapeHtml(memberLabel)} / joined ${escapeHtml(formatDateTime(guild.joined_at))}</small>
        <code>${escapeHtml(guild.id)}</code>
        ${invite?.invite_url ? `<a href="${escapeAttribute(invite.invite_url)}" target="_blank" rel="noreferrer">${escapeHtml(invite.invite_url)}</a>` : ""}
      </div>
      <button class="icon-button icon-button--ghost admin-guild-row__invite" type="button" data-action="${escapeAttribute(action)}" data-admin-guild-id="${escapeAttribute(guild.id)}" ${running ? "disabled" : ""}>
        ${icon(running ? "refresh" : "link")}<span>${running ? "作成中" : "招待リンク作成"}</span>
      </button>
    </article>
  `;
}

function renderAdminGuildIcon(guild) {
  if (guild.icon_url) {
    return `<img class="admin-guild-row__icon" src="${escapeAttribute(guild.icon_url)}" alt="" />`;
  }
  return `<span class="admin-guild-row__icon admin-guild-row__icon--fallback">${escapeHtml((guild.name || "?").slice(0, 1))}</span>`;
}

function renderAdminPlaylistsPanel() {
  const playlists = state.adminPlaylists;
  const totalTracks = playlists.reduce((total, playlist) => total + (playlist.tracks?.length ?? 0), 0);
  const body = state.adminPlaylistsLoading
    ? `<div class="empty-state">ユーザー別プレイリストを取得中です。</div>`
    : playlists.length
      ? `<div class="host-playlist-list">${playlists.map(renderAdminPlaylistUser).join("")}</div>`
      : `<div class="empty-state">ユーザーのプレイリストデータはまだありません。</div>`;
  return `
    <section class="host-card host-playlists">
      <div class="host-card__header">
        ${icon("music")}<h3>ユーザープレイリスト</h3>
        <span class="feature-status ${totalTracks ? "feature-status--on" : ""}">
          ${escapeHtml(`${playlists.length}人 / ${totalTracks}曲`)}
        </span>
      </div>
      ${state.adminPlaylistsError ? `<p class="status-banner status-banner--error">${icon("alert")}<span>${escapeHtml(state.adminPlaylistsError)}</span></p>` : ""}
      ${body}
    </section>
  `;
}

function renderAdminPlaylistUser(playlist) {
  const tracks = playlist.tracks ?? [];
  const displayName = playlist.username || `User ${playlist.user_id}`;
  const trackLabel = `${tracks.length}曲`;
  return `
    <details class="host-playlist-user" ${tracks.length ? "open" : ""}>
      <summary class="host-playlist-user__summary">
        <div class="host-playlist-user__identity">
          ${
            playlist.avatar_url
              ? `<img class="host-playlist-user__avatar" src="${escapeAttribute(playlist.avatar_url)}" alt="" />`
              : `<span class="host-playlist-user__avatar host-playlist-user__avatar--fallback">${icon("user")}</span>`
          }
          <div class="host-playlist-user__meta">
            <strong>${escapeHtml(displayName)}</strong>
            <span>Discord ID ${escapeHtml(playlist.user_id)}</span>
          </div>
        </div>
        <div class="host-playlist-user__stats">
          <span>${escapeHtml(trackLabel)}</span>
          <span>${escapeHtml(`更新 ${formatDateTime(playlist.updated_at)}`)}</span>
        </div>
      </summary>
      <div class="host-playlist-user__tracks">
        ${
          tracks.length
            ? tracks.map((track) => renderPlaylistTrack(track, { ownerUserId: playlist.user_id, readonly: true })).join("")
            : `<div class="empty-state">登録曲はありません。</div>`
        }
      </div>
    </details>
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
  if (parts.length) {
    parts.push(VC_NOTIFICATION_REACTION_EMOJI);
  }
  return escapeHtml(parts.length ? parts.join(" / ") : "未設定");
}

function renderBumpRankSummary(channel, role) {
  const rows = [];
  if (channel) {
    rows.push(["再通知", `#${channel.name}`]);
  }
  if (role) {
    rows.push(["メンション", `@${role.name}`]);
  }
  if (!rows.length) {
    return "<strong>未設定</strong>";
  }
  return `
    <div class="bump-rank-summary__list">
      ${rows.map(([label, value]) => `
        <div class="bump-rank-summary__item">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderActiveRankScheduleSummary(rankingChannel, settings) {
  if (settings.reset_interval === "none") {
    return "<strong>リセット送信なし</strong>";
  }
  const resetLabel = BUMP_RANK_RESET_INTERVALS.find((item) => item.id === settings.reset_interval)?.label;
  const rows = [
    ["周期", resetLabel ?? settings.reset_interval],
    ["送信先", rankingChannel ? `#${rankingChannel.name}` : "未設定"],
    ["次回リセット", settings.next_reset_at ? formatDateTime(settings.next_reset_at) : "保存後に設定"],
  ];
  return `
    <div class="bump-rank-summary__list">
      ${rows.map(([label, value]) => `
        <div class="bump-rank-summary__item">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `).join("")}
    </div>
  `;
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
    if (state.adminPlaylistsError) {
      toasts.push({ tone: "error", message: state.adminPlaylistsError });
    }
    if (state.hostMessage) {
      toasts.push({ tone: "success", message: state.hostMessage });
    }
  }
  if (state.user && !state.support.open) {
    if (state.support.error) {
      toasts.push({ tone: "error", message: state.support.error });
    }
    if (state.support.success) {
      toasts.push({ tone: "success", message: state.support.success });
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
    return {
      type: "product",
      productId: state.pendingProductId,
      pageId: state.pendingProductPageId,
    };
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
  state.pendingProductPageId = null;
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
    await activateProductPage(pending.productId, { pageId: pending.pageId });
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
  if (!visibleGuardFeatures().some((feature) => feature.id === featureId)) {
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

function loadActivePageData() {
  if (activeSettingsView() === "host") {
    void loadHostAdminData();
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
  if (target instanceof HTMLFormElement && target.matches("[data-support-form]")) {
    event.preventDefault();
    void sendSupportInquiry();
  } else if (target instanceof HTMLFormElement && target.matches("[data-playlist-url-form]")) {
    event.preventDefault();
    void submitPlaylistInput();
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

function handleKeydown(event) {
  if (event.key === "Escape" && state.support.open) {
    closeSupportInquiry();
  }
}

function handleClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) {
    return;
  }

  const supportBackdrop = target.closest("[data-support-backdrop]");
  if (supportBackdrop && target === supportBackdrop) {
    closeSupportInquiry();
    return;
  }

  const actionEl = target.closest("[data-action]");
  if (actionEl) {
    const action = actionEl.dataset.action;
    if (action === "switch-product") {
      const productId = actionEl.dataset.product;
      void activateProductPage(productId, {
        pageId: productId === "one" ? defaultServerPageId() : null,
      });
    } else if (action === "switch-user-page") {
      void activateProductPage("one", { pageId: USER_PAGE.id });
    } else if (action === "open-support-inquiry") {
      openSupportInquiry();
    } else if (action === "close-support-inquiry") {
      closeSupportInquiry();
    } else if (action === "reset-support-inquiry") {
      resetSupportInquiryForm();
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
    } else if (action === "add-guard-moderation-ng-word") {
      addGuardModerationNgWord(actionEl.dataset.guardModerationFeature);
    } else if (action === "remove-guard-moderation-ng-word") {
      removeGuardModerationNgWord(actionEl.dataset.guardModerationFeature, actionEl.dataset.ngWord);
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
      void loadHostAdminData();
    } else if (action === "refresh-guard-admin") {
      void loadGuardData();
    } else if (action === "reload-guild-data") {
      if (state.selectedGuildId) {
        void loadGuildData(state.selectedGuildId);
      }
    } else if (action === "playlist-refresh") {
      void loadPlaylist();
    } else if (action === "user-activity-refresh") {
      void loadUserActivity();
    } else if (action === "guild-ranking-refresh") {
      void loadGuildRankings();
    } else if (action === "playlist-add-url") {
      void submitPlaylistInput();
    } else if (action === "playlist-add-search-result") {
      const trackUrl = actionEl.dataset.trackUrl;
      if (trackUrl) {
        void addPlaylistSearchResult(trackUrl);
      }
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
    } else if (action === "create-host-guild-invite") {
      const guildId = actionEl.dataset.adminGuildId;
      if (guildId) {
        void createHostGuildInvite(guildId);
      }
    } else if (action === "create-guard-guild-invite") {
      const guildId = actionEl.dataset.adminGuildId;
      if (guildId) {
        void createGuardGuildInvite(guildId);
      }
    } else if (action === "toggle-guild-list") {
      state.guildListCollapsed = !state.guildListCollapsed;
      render();
    } else if (action === "save-settings") {
      void saveSettings();
    } else if (action === "save-feature-settings") {
      void saveFeatureSettings();
    } else if (action === "publish-ticket-panel") {
      void publishTicketPanel();
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
    } else if (action === "clear-bump-rank") {
      state.featureSettings.bump_rank = {
        ...normalizeBumpRankSettings(state.featureSettings.bump_rank),
        channel_id: "",
        role_id: "",
      };
      updateDirtyState("features");
      render();
    }
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

  const rankingPeriodEl = target.closest("[data-ranking-period]");
  if (rankingPeriodEl) {
    state.activeRankingPeriod = normalizeRankingPeriod(rankingPeriodEl.dataset.rankingPeriod);
    void loadGuildRankings();
    return;
  }

  const userPanelTabEl = target.closest("[data-user-panel-tab]");
  if (userPanelTabEl) {
    state.activeUserPanelTab = USER_PANEL_TABS.some((tab) => tab.id === userPanelTabEl.dataset.userPanelTab)
      ? userPanelTabEl.dataset.userPanelTab
      : "playlist";
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
  } else if (target.dataset.supportField) {
    updateSupportField(target);
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
  } else if (target.dataset.ticketField) {
    updateTicketField(target);
  } else if (target.dataset.vcNotificationField) {
    updateVcNotificationField(target);
  } else if (target.dataset.bumpRankField) {
    updateBumpRankField(target);
  } else if (target.dataset.bumpRankSource) {
    updateBumpRankSource(target);
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

  if (target.dataset.supportField) {
    updateSupportField(target, { renderAfter: false });
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

  if (target.dataset.ticketField) {
    updateTicketField(target, { renderAfter: false });
    return;
  }

  if (target.dataset.vcNotificationField) {
    updateVcNotificationField(target, { renderAfter: false });
    return;
  }

  if (target.dataset.bumpRankField) {
    updateBumpRankField(target, { renderAfter: false });
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

function updateSupportField(target, options = { renderAfter: true }) {
  const field = target.dataset.supportField;
  if (!field) {
    return;
  }
  const value = target.value;
  state.support.error = null;
  state.support.success = null;

  if (field === "product") {
    state.support.product = normalizeSupportProduct(value);
    syncSupportGuildSelection();
    if (state.support.product === "guard" && state.guard.source !== "api") {
      void loadGuardData();
    }
  } else if (field === "guild_id") {
    state.support.guildId = String(value ?? "").trim();
  } else if (field === "requirement") {
    state.support.requirement = normalizeSupportRequirement(value);
    if (!supportRequiresOther()) {
      state.support.requirementOther = "";
    }
  } else if (field === "requirement_other") {
    state.support.requirementOther = String(value ?? "").slice(0, 120);
    refreshSupportMessageCounter();
    return;
  } else if (field === "message") {
    state.support.message = String(value ?? "").slice(0, SUPPORT_MESSAGE_MAX_LENGTH);
    refreshSupportMessageCounter();
    return;
  }

  if (options.renderAfter) {
    render();
  }
}

function refreshSupportMessageCounter() {
  const counter = root.querySelector("[data-support-counter]");
  if (counter) {
    counter.textContent = supportMessageCounter();
  }
  const progress = supportProgress();
  const progressLabel = root.querySelector("[data-support-progress-label]");
  if (progressLabel) {
    progressLabel.textContent = `${progress.done}/${progress.total}`;
  }
  const progressBar = root.querySelector("[data-support-progress-bar]");
  if (progressBar instanceof HTMLElement) {
    progressBar.style.width = `${progress.percent}%`;
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

function updateTicketField(target, options = { renderAfter: true }) {
  if (!state.featureSettings) {
    return;
  }
  const field = target.dataset.ticketField;
  if (!field) {
    return;
  }
  const current = normalizeTicketSettings(state.featureSettings.ticket);
  let patch;
  if (field === "creator_can_close") {
    patch = { creator_can_close: target instanceof HTMLInputElement ? target.checked : current.creator_can_close };
  } else if (field === "staff_call_cooldown_minutes") {
    patch = {
      staff_call_cooldown_seconds: clampInteger(Number(target.value), 1, 1440) * 60,
    };
  } else if (field === "panel_title") {
    patch = { panel_title: String(target.value ?? "").slice(0, 100) };
  } else if (field === "panel_description") {
    patch = { panel_description: String(target.value ?? "").slice(0, 1000) };
  } else {
    patch = { [field]: target.value };
  }
  state.featureSettings.ticket = {
    ...current,
    ...patch,
  };
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
  if (field === "emoji") {
    return;
  }
  state.featureSettings.vc_notification = {
    ...normalizeVcNotificationSettings(state.featureSettings.vc_notification),
    [field]: target.value,
  };
  updateDirtyState("features");
  if (options.renderAfter) {
    render();
  }
}

function updateBumpRankField(target, options = { renderAfter: true }) {
  if (!state.featureSettings) {
    return;
  }
  const field = target.dataset.bumpRankField;
  const current = normalizeBumpRankSettings(state.featureSettings.bump_rank);
  const value = field === "reset_interval"
    ? normalizeBumpRankResetInterval(target.value)
    : target.value;
  state.featureSettings.bump_rank = {
    ...current,
    [field]: value,
    ...(field === "reset_interval" && value === "none" ? { ranking_channel_id: "" } : {}),
  };
  updateDirtyState("features");
  if (options.renderAfter) {
    render();
  }
}

function updateBumpRankSource(target, options = { renderAfter: true }) {
  if (!state.featureSettings || !(target instanceof HTMLInputElement)) {
    return;
  }
  const source = String(target.dataset.bumpRankSource ?? "").trim();
  if (!ACTIVE_RANKING_SOURCES.some((item) => item.id === source)) {
    return;
  }
  const current = normalizeBumpRankSettings(state.featureSettings.bump_rank);
  const selected = new Set(current.active_ranking_sources);
  if (target.checked) {
    selected.add(source);
  } else {
    selected.delete(source);
  }
  state.featureSettings.bump_rank = {
    ...current,
    active_ranking_sources: ACTIVE_RANKING_SOURCES
      .map((item) => item.id)
      .filter((id) => selected.has(id)),
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
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 .9-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z"/><path d="m9 12 2 2 4-4"/>',
    success: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    terminal: '<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
    ticket: '<path d="M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
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
