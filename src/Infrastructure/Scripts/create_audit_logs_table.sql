-- AuditLogs table for AuditDb database
-- Run this script against the AuditDb database

CREATE TABLE IF NOT EXISTS "AuditLogs" (
    "Id" bigint NOT NULL,
    "UserId" character varying(256) COLLATE pg_catalog."default",
    "UserEmail" character varying(256) COLLATE pg_catalog."default",
    "Action" character varying(50) COLLATE pg_catalog."default",
    "EntityName" character varying(256) COLLATE pg_catalog."default",
    "EntityId" character varying(256) COLLATE pg_catalog."default",
    "OldValues" text COLLATE pg_catalog."default",
    "NewValues" text COLLATE pg_catalog."default",
    "Timestamp" timestamp with time zone NOT NULL,
    "CorrelationId" character varying(100) COLLATE pg_catalog."default",
    "RemoteIp" character varying(50) COLLATE pg_catalog."default",
    "UserAgent" text COLLATE pg_catalog."default",
    "PreviousHash" character varying(256) COLLATE pg_catalog."default",
    "Hash" character varying(256) COLLATE pg_catalog."default",
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    "UpdatedAt" timestamp with time zone,
    "CreatedBy" character varying(256) COLLATE pg_catalog."default",
    "UpdatedBy" character varying(256) COLLATE pg_catalog."default",
    CONSTRAINT "PK_AuditLogs" PRIMARY KEY ("Id")
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "IX_AuditLogs_Timestamp" ON "AuditLogs" ("Timestamp");
CREATE INDEX IF NOT EXISTS "IX_AuditLogs_CorrelationId" ON "AuditLogs" ("CorrelationId");
CREATE INDEX IF NOT EXISTS "IX_AuditLogs_UserId" ON "AuditLogs" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_AuditLogs_Action" ON "AuditLogs" ("Action");
CREATE INDEX IF NOT EXISTS "IX_AuditLogs_EntityName" ON "AuditLogs" ("EntityName");

-- Create sequence for auto-increment (if not exists)
CREATE SEQUENCE IF NOT EXISTS "AuditLogs_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Set default for Id column
ALTER TABLE "AuditLogs" ALTER COLUMN "Id" SET DEFAULT nextval('"AuditLogs_Id_seq"'::regclass);
