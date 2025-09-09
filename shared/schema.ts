import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  service: text("service"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: text("file_type").notNull(),
  downloadUrl: text("download_url").notNull(),
  category: text("category").notNull(),
  version: text("version"),
  isActive: boolean("is_active").default(true).notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  // Google Drive 연동 필드
  googleDriveFileId: text("google_drive_file_id"), // Google Drive 파일 ID
  googleDriveAccountId: varchar("google_drive_account_id"), // 연결된 Google Drive 계정 ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const servicePackages = pgTable("service_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: text("service_id").notNull().unique(), // ott-plus, streamplayer, netflix-account, nohard-system
  name: text("name").notNull(),
  description: text("description"),
  basePrice: integer("base_price").notNull(), // 기본 가격
  priceUnit: text("price_unit").notNull(), // 가격 단위 (room, pc, account)
  priceType: text("price_type").notNull(), // fixed, variable, tiered
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const streamplayerOptions = pgTable("streamplayer_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 넷플릭스 단독, 넷플릭스+디즈니 등
  services: text("services").array().notNull(), // ["netflix", "disney", "tving", "watcha"]
  price: integer("price").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 구글 드라이브 계정 관리 테이블
export const googleDriveAccounts = pgTable("google_drive_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountName: text("account_name").notNull(), // 사용자 지정 계정 이름 (예: "관리자 계정", "백업 계정")
  email: text("email").notNull().unique(), // 구글 계정 이메일
  accessToken: text("access_token"), // 암호화된 액세스 토큰
  refreshToken: text("refresh_token"), // 암호화된 리프레시 토큰
  tokenExpiresAt: timestamp("token_expires_at"), // 토큰 만료 시간
  isActive: boolean("is_active").default(true).notNull(), // 활성화 상태
  isDefault: boolean("is_default").default(false).notNull(), // 기본 계정 여부
  scopes: text("scopes").array().notNull(), // 승인된 권한 범위
  profilePicture: text("profile_picture"), // 프로필 사진 URL
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 구글 드라이브에 업로드된 파일 정보 테이블
export const googleDriveFiles = pgTable("google_drive_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driveAccountId: varchar("drive_account_id").notNull().references(() => googleDriveAccounts.id),
  driveFileId: text("drive_file_id").notNull().unique(), // 구글 드라이브 파일 ID
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(), // 원본 파일명
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  webViewLink: text("web_view_link"), // 웹에서 보기 링크
  webContentLink: text("web_content_link"), // 다운로드 직접 링크
  category: text("category").notNull(), // ott-plus, streamplayer, nohard, manual, other
  isPublic: boolean("is_public").default(false).notNull(), // 공개 여부
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertDownloadSchema = createInsertSchema(downloads, {
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
  fileName: z.string().min(1, "파일명이 필요합니다"),
  fileSize: z.number().min(1, "파일 크기가 필요합니다"),
  fileType: z.string().min(1, "파일 타입이 필요합니다"),
  downloadUrl: z.string().min(1, "다운로드 URL이 필요합니다"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  version: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
});

export const insertServicePackageSchema = createInsertSchema(servicePackages, {
  name: z.string().min(1, "서비스 이름을 입력해주세요"),
  description: z.string().optional(),
  basePrice: z.number().min(0, "가격은 0 이상이어야 합니다"),
  priceUnit: z.string().min(1, "가격 단위를 입력해주세요"),
  priceType: z.string().min(1, "가격 타입을 선택해주세요"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStreamplayerOptionSchema = createInsertSchema(streamplayerOptions, {
  name: z.string().min(1, "옵션 이름을 입력해주세요"),
  services: z.array(z.string()).min(1, "최소 하나의 서비스를 선택해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGoogleDriveAccountSchema = createInsertSchema(googleDriveAccounts, {
  accountName: z.string().min(1, "계정 이름을 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  scopes: z.array(z.string()).min(1, "권한 범위가 필요합니다"),
}).omit({
  id: true,
  accessToken: true,
  refreshToken: true,
  tokenExpiresAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGoogleDriveFileSchema = createInsertSchema(googleDriveFiles, {
  driveFileId: z.string().min(1, "드라이브 파일 ID가 필요합니다"),
  fileName: z.string().min(1, "파일명이 필요합니다"),
  originalName: z.string().min(1, "원본 파일명이 필요합니다"),
  fileSize: z.number().min(0, "파일 크기가 필요합니다"),
  mimeType: z.string().min(1, "파일 타입이 필요합니다"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;
export type InsertServicePackage = z.infer<typeof insertServicePackageSchema>;
export type ServicePackage = typeof servicePackages.$inferSelect;
export type InsertStreamplayerOption = z.infer<typeof insertStreamplayerOptionSchema>;
export type StreamplayerOption = typeof streamplayerOptions.$inferSelect;
export type InsertGoogleDriveAccount = z.infer<typeof insertGoogleDriveAccountSchema>;
export type GoogleDriveAccount = typeof googleDriveAccounts.$inferSelect;
export type InsertGoogleDriveFile = z.infer<typeof insertGoogleDriveFileSchema>;
export type GoogleDriveFile = typeof googleDriveFiles.$inferSelect;
