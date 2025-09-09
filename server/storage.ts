import {
  users,
  inquiries,
  downloads,
  servicePackages,
  streamplayerOptions,
  googleDriveAccounts,
  googleDriveFiles,
  type User,
  type InsertUser,
  type Inquiry,
  type InsertInquiry,
  type Download,
  type InsertDownload,
  type ServicePackage,
  type InsertServicePackage,
  type StreamplayerOption,
  type InsertStreamplayerOption,
  type GoogleDriveAccount,
  type InsertGoogleDriveAccount,
  type GoogleDriveFile,
  type InsertGoogleDriveFile,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Inquiry operations
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry>;

  // Download operations
  getDownloads(): Promise<Download[]>;
  createDownload(insertDownload: InsertDownload): Promise<Download>;
  updateDownload(id: string, download: Partial<InsertDownload>): Promise<Download>;
  deleteDownload(id: string): Promise<void>;
  incrementDownloadCount(id: string): Promise<void>;

  // Service Package operations
  getServicePackages(): Promise<ServicePackage[]>;
  getServicePackage(serviceId: string): Promise<ServicePackage | undefined>;
  createServicePackage(insertServicePackage: InsertServicePackage): Promise<ServicePackage>;
  updateServicePackage(id: string, servicePackage: Partial<InsertServicePackage>): Promise<ServicePackage>;
  deleteServicePackage(id: string): Promise<void>;

  // StreamPlayer Options operations
  getStreamplayerOptions(): Promise<StreamplayerOption[]>;
  createStreamplayerOption(insertOption: InsertStreamplayerOption): Promise<StreamplayerOption>;
  updateStreamplayerOption(id: string, option: Partial<InsertStreamplayerOption>): Promise<StreamplayerOption>;
  deleteStreamplayerOption(id: string): Promise<void>;

  // Google Drive Account operations
  getGoogleDriveAccounts(): Promise<GoogleDriveAccount[]>;
  getGoogleDriveAccount(id: string): Promise<GoogleDriveAccount | undefined>;
  getGoogleDriveAccountByEmail(email: string): Promise<GoogleDriveAccount | undefined>;
  createGoogleDriveAccount(insertAccount: InsertGoogleDriveAccount): Promise<GoogleDriveAccount>;
  updateGoogleDriveAccount(id: string, account: Partial<InsertGoogleDriveAccount>): Promise<GoogleDriveAccount>;
  updateGoogleDriveAccountTokens(id: string, tokens: { accessToken: string, refreshToken?: string, tokenExpiresAt?: Date }): Promise<GoogleDriveAccount>;
  updateGoogleDriveAccountStatus(id: string, isActive: boolean): Promise<GoogleDriveAccount>;
  deleteGoogleDriveAccount(id: string): Promise<void>;
  setDefaultGoogleDriveAccount(id: string): Promise<void>;
  getDefaultGoogleDriveAccount(): Promise<GoogleDriveAccount | undefined>;

  // Google Drive File operations
  getGoogleDriveFiles(): Promise<GoogleDriveFile[]>;
  getGoogleDriveFilesByAccount(accountId: string): Promise<GoogleDriveFile[]>;
  getGoogleDriveFilesByCategory(category: string): Promise<GoogleDriveFile[]>;
  createGoogleDriveFile(insertFile: InsertGoogleDriveFile): Promise<GoogleDriveFile>;
  updateGoogleDriveFile(id: string, file: Partial<InsertGoogleDriveFile>): Promise<GoogleDriveFile>;
  deleteGoogleDriveFile(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Inquiry operations
  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  // Download operations
  async getDownloads(): Promise<Download[]> {
    return await db.select().from(downloads).orderBy(downloads.sortOrder, desc(downloads.createdAt));
  }

  async createDownload(insertDownload: InsertDownload): Promise<Download> {
    const [download] = await db.insert(downloads).values(insertDownload).returning();
    return download;
  }

  async updateDownload(id: string, download: Partial<InsertDownload>): Promise<Download> {
    const [updated] = await db
      .update(downloads)
      .set({ ...download, updatedAt: new Date() })
      .where(eq(downloads.id, id))
      .returning();
    return updated;
  }

  async deleteDownload(id: string): Promise<void> {
    await db.delete(downloads).where(eq(downloads.id, id));
  }

  async incrementDownloadCount(id: string): Promise<void> {
    const [download] = await db.select().from(downloads).where(eq(downloads.id, id));
    if (download) {
      await db
        .update(downloads)
        .set({ downloadCount: download.downloadCount + 1 })
        .where(eq(downloads.id, id));
    }
  }

  // Service Package operations
  async getServicePackages(): Promise<ServicePackage[]> {
    return await db.select().from(servicePackages).orderBy(servicePackages.sortOrder);
  }

  async getServicePackage(serviceId: string): Promise<ServicePackage | undefined> {
    const [package_] = await db.select().from(servicePackages).where(eq(servicePackages.serviceId, serviceId));
    return package_;
  }

  async createServicePackage(insertServicePackage: InsertServicePackage): Promise<ServicePackage> {
    const [package_] = await db.insert(servicePackages).values(insertServicePackage).returning();
    return package_;
  }

  async updateServicePackage(id: string, servicePackage: Partial<InsertServicePackage>): Promise<ServicePackage> {
    const [updated] = await db
      .update(servicePackages)
      .set({ ...servicePackage, updatedAt: new Date() })
      .where(eq(servicePackages.id, id))
      .returning();
    return updated;
  }

  async deleteServicePackage(id: string): Promise<void> {
    await db.delete(servicePackages).where(eq(servicePackages.id, id));
  }

  // StreamPlayer Options operations
  async getStreamplayerOptions(): Promise<StreamplayerOption[]> {
    return await db.select().from(streamplayerOptions).orderBy(streamplayerOptions.sortOrder);
  }

  async createStreamplayerOption(insertOption: InsertStreamplayerOption): Promise<StreamplayerOption> {
    const [option] = await db.insert(streamplayerOptions).values(insertOption).returning();
    return option;
  }

  async updateStreamplayerOption(id: string, option: Partial<InsertStreamplayerOption>): Promise<StreamplayerOption> {
    const [updated] = await db
      .update(streamplayerOptions)
      .set({ ...option, updatedAt: new Date() })
      .where(eq(streamplayerOptions.id, id))
      .returning();
    return updated;
  }

  async deleteStreamplayerOption(id: string): Promise<void> {
    await db.delete(streamplayerOptions).where(eq(streamplayerOptions.id, id));
  }

  // Google Drive Account operations
  async getGoogleDriveAccounts(): Promise<GoogleDriveAccount[]> {
    return await db.select().from(googleDriveAccounts).orderBy(desc(googleDriveAccounts.createdAt));
  }

  async getGoogleDriveAccount(id: string): Promise<GoogleDriveAccount | undefined> {
    const [account] = await db.select().from(googleDriveAccounts).where(eq(googleDriveAccounts.id, id));
    return account;
  }

  async getGoogleDriveAccountByEmail(email: string): Promise<GoogleDriveAccount | undefined> {
    const [account] = await db.select().from(googleDriveAccounts).where(eq(googleDriveAccounts.email, email));
    return account;
  }

  async createGoogleDriveAccount(insertAccount: InsertGoogleDriveAccount): Promise<GoogleDriveAccount> {
    const [account] = await db.insert(googleDriveAccounts).values(insertAccount).returning();
    return account;
  }

  async updateGoogleDriveAccount(id: string, account: Partial<InsertGoogleDriveAccount>): Promise<GoogleDriveAccount> {
    const [updated] = await db
      .update(googleDriveAccounts)
      .set({ ...account, updatedAt: new Date() })
      .where(eq(googleDriveAccounts.id, id))
      .returning();
    return updated;
  }

  async updateGoogleDriveAccountTokens(id: string, tokens: { accessToken: string, refreshToken?: string, tokenExpiresAt?: Date }): Promise<GoogleDriveAccount> {
    const [updated] = await db
      .update(googleDriveAccounts)
      .set({ 
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: tokens.tokenExpiresAt,
        updatedAt: new Date()
      })
      .where(eq(googleDriveAccounts.id, id))
      .returning();
    return updated;
  }

  async deleteGoogleDriveAccount(id: string): Promise<void> {
    await db.delete(googleDriveAccounts).where(eq(googleDriveAccounts.id, id));
  }

  async setDefaultGoogleDriveAccount(id: string): Promise<void> {
    // 모든 계정의 기본 설정을 해제
    await db.update(googleDriveAccounts).set({ isDefault: false });
    // 선택한 계정만 기본으로 설정
    await db.update(googleDriveAccounts).set({ isDefault: true }).where(eq(googleDriveAccounts.id, id));
  }

  async getDefaultGoogleDriveAccount(): Promise<GoogleDriveAccount | undefined> {
    const [account] = await db.select().from(googleDriveAccounts).where(eq(googleDriveAccounts.isDefault, true));
    return account;
  }

  async updateGoogleDriveAccountStatus(id: string, isActive: boolean): Promise<GoogleDriveAccount> {
    const [updated] = await db
      .update(googleDriveAccounts)
      .set({ 
        isActive: isActive,
        updatedAt: new Date()
      })
      .where(eq(googleDriveAccounts.id, id))
      .returning();
    return updated;
  }

  // Google Drive File operations
  async getGoogleDriveFiles(): Promise<GoogleDriveFile[]> {
    return await db.select().from(googleDriveFiles).orderBy(desc(googleDriveFiles.createdAt));
  }

  async getGoogleDriveFilesByAccount(accountId: string): Promise<GoogleDriveFile[]> {
    return await db.select().from(googleDriveFiles).where(eq(googleDriveFiles.driveAccountId, accountId)).orderBy(desc(googleDriveFiles.createdAt));
  }

  async getGoogleDriveFilesByCategory(category: string): Promise<GoogleDriveFile[]> {
    return await db.select().from(googleDriveFiles).where(eq(googleDriveFiles.category, category)).orderBy(desc(googleDriveFiles.createdAt));
  }

  async createGoogleDriveFile(insertFile: InsertGoogleDriveFile): Promise<GoogleDriveFile> {
    const [file] = await db.insert(googleDriveFiles).values(insertFile).returning();
    return file;
  }

  async updateGoogleDriveFile(id: string, file: Partial<InsertGoogleDriveFile>): Promise<GoogleDriveFile> {
    const [updated] = await db
      .update(googleDriveFiles)
      .set({ ...file, updatedAt: new Date() })
      .where(eq(googleDriveFiles.id, id))
      .returning();
    return updated;
  }

  async deleteGoogleDriveFile(id: string): Promise<void> {
    await db.delete(googleDriveFiles).where(eq(googleDriveFiles.id, id));
  }
}

export const storage = new DatabaseStorage();